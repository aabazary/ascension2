import Character from '../models/Character.js';
import BattleSession from '../models/BattleSession.js';
import ActivityLog from '../models/ActivityLog.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { BATTLE_CONFIG } from '../utils/battleConfig.js';
import { calculateCharacterHealth, calculateCharacterPower } from '../utils/battleCalculations.js';

// Get battle configuration
const getBattleConfig = (req, res) => {
  res.json({
    success: true,
    config: {
      tiers: BATTLE_CONFIG.tiers,
      spells: BATTLE_CONFIG.spells,
      player: BATTLE_CONFIG.player,
      avatars: BATTLE_CONFIG.avatars
    }
  });
};

// Initialize battle - get calculated stats
const initBattle = asyncHandler(async (req, res) => {
  const { characterId, tier, isBossBattle } = req.body;
  
  if (!characterId || tier === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Character ID and tier are required'
    });
  }
  
  const character = await Character.findOne({
    _id: characterId,
    userId: req.user.userId
  });
  
  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found or does not belong to you'
    });
  }
  
  if (character.currentTier < tier) {
    return res.status(400).json({
      success: false,
      message: 'Character tier too low for this battle'
    });
  }
  
  try {
    // Calculate character stats for battle
    const characterHealth = calculateCharacterHealth(character);
    const characterPower = calculateCharacterPower(character);
    
    // Get enemy stats based on tier and battle type
    const tierConfig = BATTLE_CONFIG.tiers[tier];
    const enemyHealth = isBossBattle ? tierConfig.bossHealth : tierConfig.minionHealth;
    const enemyDamage = isBossBattle ? tierConfig.bossDamage : tierConfig.minionDamage;
    
    res.json({
      success: true,
      battleStats: {
        characterMaxHealth: characterHealth,
        characterCurrentHealth: characterHealth,
        characterPower: characterPower,
        enemyMaxHealth: enemyHealth,
        enemyCurrentHealth: enemyHealth,
        enemyDamage: enemyDamage
      }
    });
    
  } catch (error) {
    console.error('Battle init error:', error);
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Start minion battle
const startMinionBattle = asyncHandler(async (req, res) => {
  const { characterId, tier, battleResult } = req.body;
  
  if (!characterId || tier === undefined || !battleResult) {
    return res.status(400).json({
      success: false,
      message: 'Character ID, tier, and battle result are required'
    });
  }
  
  if (tier < 0 || tier > 5) {
    return res.status(400).json({
      success: false,
      message: 'Invalid tier (0-5)'
    });
  }
  
  const character = await Character.findOne({
    _id: characterId,
    userId: req.user.userId
  });
  
  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found or does not belong to you'
    });
  }
  
  if (character.currentTier < tier) {
    return res.status(400).json({
      success: false,
      message: 'Character tier too low for this battle'
    });
  }
  
  try {
    // Calculate character stats for battle
    const characterHealth = calculateCharacterHealth(character);
    const characterPower = calculateCharacterPower(character);
    
    // Create a BattleSession to store the battle log
    const battleSession = await BattleSession.create({
      characterId: character._id,
      tier: tier,
      battleType: 'minion',
      enemyHealth: battleResult.enemyHealth || 100,
      characterHealth: battleResult.playerHealth || characterHealth,
      turn: 1,
      battleLog: battleResult.battleLog || []
    });
    
    // Update character stats
    if (battleResult.won) {
      character.stats.wins = (character.stats.wins || 0) + 1;
      character.stats.totalBattles = (character.stats.totalBattles || 0) + 1;
      
      // Add minion resources based on tier
      const resourcesGained = Math.floor(Math.random() * 10) + (tier * 2) + 5;
      await character.addResource('minion', tier, resourcesGained);
      
      // Create activity log entry
      try {
        await ActivityLog.create({
          characterId: character._id,
          activityType: 'minion',
          tier: tier,
          success: true,
          resourcesGained: [{
            type: 'minion',
            tier: tier,
            amount: resourcesGained
          }],
          equipmentUsed: character.equipment || {},
          battleDetails: {
            battleLog: battleResult.battleLog || [],
            finalEnemyHealth: 0,
            finalCharacterHealth: battleResult.playerHealth || characterHealth
          },
          duration: 0
        });
      } catch (logError) {
        console.error('Failed to create ActivityLog for minion battle:', logError);
      }
      
      res.json({
        success: true,
        won: true,
        message: 'Battle won!',
        resourcesGained,
        battleStats: {
          characterMaxHealth: characterHealth,
          characterCurrentHealth: battleResult.playerHealth || characterHealth,
          characterPower: characterPower
        },
        character: {
          stats: character.stats,
          resources: character.resources
        }
      });
    } else {
      character.stats.losses = (character.stats.losses || 0) + 1;
      character.stats.totalBattles = (character.stats.totalBattles || 0) + 1;
      
      // Create activity log entry for loss
      try {
        await ActivityLog.create({
          characterId: character._id,
          activityType: 'minion',
          tier: tier,
          success: false,
          resourcesGained: [],
          equipmentUsed: character.equipment || {},
          battleDetails: {
            battleLog: battleResult.battleLog || [],
            finalEnemyHealth: battleResult.enemyHealth || 100,
            finalCharacterHealth: 0
          },
          duration: 0
        });
      } catch (logError) {
        console.error('Failed to create ActivityLog for minion battle loss:', logError);
      }
      
      res.json({
        success: true,
        won: false,
        message: 'Battle lost!',
        resourcesGained: 0,
        battleStats: {
          characterMaxHealth: characterHealth,
          characterCurrentHealth: battleResult.playerHealth || 0,
          characterPower: characterPower
        },
        character: {
          stats: character.stats,
          resources: character.resources
        }
      });
    }
    
    character.lastActivity = new Date();
    await character.save();
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Start boss battle
const startBossBattle = asyncHandler(async (req, res) => {
  const { characterId, tier, battleResult } = req.body;
  
  if (!characterId || tier === undefined || !battleResult) {
    return res.status(400).json({
      success: false,
      message: 'Character ID, tier, and battle result are required'
    });
  }
  
  if (tier < 0 || tier > 5) {
    return res.status(400).json({
      success: false,
      message: 'Invalid tier (0-5)'
    });
  }
  
  const character = await Character.findOne({
    _id: characterId,
    userId: req.user.userId
  });
  
  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found or does not belong to you'
    });
  }
  
  if (character.currentTier < tier) {
    return res.status(400).json({
      success: false,
      message: 'Character tier too low for this battle'
    });
  }
  
  try {
    // Calculate character stats for battle
    const characterHealth = calculateCharacterHealth(character);
    const characterPower = calculateCharacterPower(character);
    
    // Create a BattleSession to store the battle log
    const battleSession = await BattleSession.create({
      characterId: character._id,
      tier: tier,
      battleType: 'boss',
      enemyHealth: battleResult.enemyHealth || 150,
      characterHealth: battleResult.playerHealth || characterHealth,
      turn: 1,
      battleLog: battleResult.battleLog || []
    });
    
    // Update character stats
    if (battleResult.won) {
      character.stats.wins = (character.stats.wins || 0) + 1;
      character.stats.totalBattles = (character.stats.totalBattles || 0) + 1;
      character.stats.totalBosses = (character.stats.totalBosses || 0) + 1;
      
      // Add boss resources based on tier (higher rewards than minions)
      const resourcesGained = Math.floor(Math.random() * 15) + (tier * 3) + 10;
      await character.addResource('boss', tier, resourcesGained);
      
      // Create activity log entry
      try {
        await ActivityLog.create({
          characterId: character._id,
          activityType: 'boss',
          tier: tier,
          success: true,
          resourcesGained: [{
            type: 'boss',
            tier: tier,
            amount: resourcesGained
          }],
          equipmentUsed: character.equipment || {},
          battleDetails: {
            battleLog: battleResult.battleLog || [],
            finalEnemyHealth: 0,
            finalCharacterHealth: battleResult.playerHealth || characterHealth
          },
          duration: 0
        });
      } catch (logError) {
        console.error('Failed to create ActivityLog for boss battle:', logError);
      }
      
      res.json({
        success: true,
        won: true,
        message: 'Boss defeated!',
        resourcesGained,
        battleStats: {
          characterMaxHealth: characterHealth,
          characterCurrentHealth: battleResult.playerHealth || characterHealth,
          characterPower: characterPower
        },
        character: {
          stats: character.stats,
          resources: character.resources
        }
      });
    } else {
      character.stats.losses = (character.stats.losses || 0) + 1;
      character.stats.totalBattles = (character.stats.totalBattles || 0) + 1;
      character.stats.totalBosses = (character.stats.totalBosses || 0) + 1;
      
      // Create activity log entry for loss
      try {
        await ActivityLog.create({
          characterId: character._id,
          activityType: 'boss',
          tier: tier,
          success: false,
          resourcesGained: [],
          equipmentUsed: character.equipment || {},
          battleDetails: {
            battleLog: battleResult.battleLog || [],
            finalEnemyHealth: battleResult.enemyHealth || 150,
            finalCharacterHealth: 0
          },
          duration: 0
        });
      } catch (logError) {
        console.error('Failed to create ActivityLog for boss battle loss:', logError);
      }
      
      res.json({
        success: true,
        won: false,
        message: 'Boss battle lost!',
        resourcesGained: 0,
        battleStats: {
          characterMaxHealth: characterHealth,
          characterCurrentHealth: battleResult.playerHealth || 0,
          characterPower: characterPower
        },
        character: {
          stats: character.stats,
          resources: character.resources
        }
      });
    }
    
    character.lastActivity = new Date();
    await character.save();
    
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

// Perform battle turn (placeholder for future)
const performBattleTurn = asyncHandler(async (req, res) => {
  res.json({
    success: false,
    message: 'Turn-based battles coming soon!'
  });
});

export default {
  getBattleConfig,
  initBattle,
  startMinionBattle,
  startBossBattle,
  performBattleTurn
};