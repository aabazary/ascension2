import Character from '../models/Character.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { BATTLE_CONFIG } from '../utils/battleConfig.js';

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
    // Update character stats
    if (battleResult.won) {
      character.stats.wins = (character.stats.wins || 0) + 1;
      character.stats.totalBattles = (character.stats.totalBattles || 0) + 1;
      
      // Add minion resources based on tier
      const resourcesGained = Math.floor(Math.random() * 10) + (tier * 2) + 5;
      await character.addResource('minion', tier, resourcesGained);
      
      res.json({
        success: true,
        won: true,
        message: 'Battle won!',
        resourcesGained,
        character: {
          stats: character.stats,
          resources: character.resources
        }
      });
    } else {
      character.stats.losses = (character.stats.losses || 0) + 1;
      character.stats.totalBattles = (character.stats.totalBattles || 0) + 1;
      
      res.json({
        success: true,
        won: false,
        message: 'Battle lost!',
        resourcesGained: 0,
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

// Start boss battle (placeholder for future)
const startBossBattle = asyncHandler(async (req, res) => {
  res.json({
    success: false,
    message: 'Boss battles coming soon!'
  });
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
  startMinionBattle,
  startBossBattle,
  performBattleTurn
};