import Character from '../models/Character.js';
import ActivityLog from '../models/ActivityLog.js';
import BattleSession from '../models/BattleSession.js';
import { executeSpell } from '../utils/battleCalculations.js';
import { BATTLE_CONFIG } from '../utils/battleConfig.js';

export const startMinionBattle = async (character, tier) => {
  const minion = BATTLE_CONFIG.minions[tier];
  if (!minion) {
    throw new Error('Invalid tier');
  }
  
  // End any existing battle for this character
  await BattleSession.findOneAndUpdate(
    { characterId: character._id, active: true },
    { active: false }
  );
  
  const battleSession = await BattleSession.create({
    characterId: character._id,
    tier: tier,
    battleType: 'minion',
    enemyHealth: minion.health,
    characterHealth: 100,
    turn: 1,
    battleLog: []
  });
  
  return {
    battleId: battleSession._id,
    battleStats: {
      enemyName: minion.name,
      enemyMaxHealth: minion.health,
      enemyCurrentHealth: minion.health,
      enemyDamage: minion.damage,
      characterMaxHealth: 100,
      characterCurrentHealth: 100,
      turn: 1
    }
  };
};

export const startBossBattle = async (character, tier) => {
  const boss = BATTLE_CONFIG.bosses[tier];
  if (!boss) {
    throw new Error('Invalid tier');
  }
  
  // End any existing battle for this character
  await BattleSession.findOneAndUpdate(
    { characterId: character._id, active: true },
    { active: false }
  );
  
  const battleSession = await BattleSession.create({
    characterId: character._id,
    tier: tier,
    battleType: 'boss',
    enemyHealth: boss.health,
    characterHealth: 100,
    turn: 1,
    battleLog: []
  });
  
  return {
    battleId: battleSession._id,
    battleStats: {
      enemyName: boss.name,
      enemyMaxHealth: boss.health,
      enemyCurrentHealth: boss.health,
      enemyDamage: boss.damage,
      characterMaxHealth: 100,
      characterCurrentHealth: 100,
      turn: 1
    }
  };
};

export const processBattleTurn = async (character, battleId, spellType) => {
  const battleSession = await BattleSession.findOne({
    _id: battleId,
    characterId: character._id,
    active: true
  });
  
  if (!battleSession) {
    throw new Error('Battle session not found or inactive');
  }
  
  const enemy = battleSession.battleType === 'minion' 
    ? BATTLE_CONFIG.minions[battleSession.tier]
    : BATTLE_CONFIG.bosses[battleSession.tier];
    
  const spellResult = executeSpell(spellType, character, battleSession.tier);
  
  battleSession.battleLog.push({
    turn: battleSession.turn,
    spellType,
    spellResult
  });
  
  if (spellResult.hit) {
    battleSession.enemyHealth -= spellResult.damage;
  }
  
  let battleWon = false;
  let battleLost = false;
  
  if (battleSession.enemyHealth <= 0) {
    battleWon = true;
    battleSession.active = false;
  } else {
    battleSession.characterHealth -= enemy.damage;
    if (battleSession.characterHealth <= 0) {
      battleLost = true;
      battleSession.active = false;
    }
  }
  
  battleSession.turn++;
  await battleSession.save();
  
  let resourcesGained = 0;
  let resourcesGainedDetails = [];
  
  if (battleWon) {
    const resourceType = battleSession.battleType;
    resourcesGained = Math.floor(Math.random() * 3) + 1;
    await character.addResource(resourceType, battleSession.tier, resourcesGained);
    
    resourcesGainedDetails = [{
      type: resourceType,
      tier: battleSession.tier,
      amount: resourcesGained
    }];
    
    character.stats.totalBattles++;
    character.stats.wins++;
    await character.save();
    
    await ActivityLog.create({
      characterId: character._id,
      activityType: resourceType,
      tier: battleSession.tier,
      success: true,
      resourcesGained: resourcesGainedDetails,
      equipmentUsed: character.equipment,
      battleDetails: {
        battleLog: battleSession.battleLog,
        finalEnemyHealth: battleSession.enemyHealth,
        finalCharacterHealth: battleSession.characterHealth
      },
      duration: 0
    });
  } else if (battleLost) {
    character.stats.totalBattles++;
    character.stats.losses++;
    await character.save();
    
    await ActivityLog.create({
      characterId: character._id,
      activityType: battleSession.battleType,
      tier: battleSession.tier,
      success: false,
      resourcesGained: [],
      equipmentUsed: character.equipment,
      battleDetails: {
        battleLog: battleSession.battleLog,
        finalEnemyHealth: battleSession.enemyHealth,
        finalCharacterHealth: battleSession.characterHealth
      },
      duration: 0
    });
  }
  
  character.lastActivity = new Date();
  await character.save();
  
  return {
    battleWon,
    battleLost,
    spellResult,
    resourcesGained,
    resourcesGainedDetails,
    battleStats: {
      enemyName: enemy.name,
      enemyMaxHealth: enemy.health,
      enemyCurrentHealth: Math.max(0, battleSession.enemyHealth),
      enemyDamage: enemy.damage,
      characterMaxHealth: 100,
      characterCurrentHealth: Math.max(0, battleSession.characterHealth),
      turn: battleSession.turn - 1
    },
    character: {
      resources: character.resources,
      stats: character.stats
    }
  };
};
