import Character from '../models/Character.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { startMinionBattle as startMinionBattleService, startBossBattle as startBossBattleService, processBattleTurn } from '../services/battleService.js';
import { BATTLE_CONFIG } from '../utils/battleConfig.js';

const startMinionBattle = asyncHandler(async (req, res) => {
  const { characterId, tier } = req.body;
  
  if (!characterId || tier === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Character ID and tier are required'
    });
  }
  
  if (tier < 0 || tier > 5) {
    return res.status(400).json({
      success: false,
      message: 'Invalid tier (0-5)'
    });
  }
  
  if (!characterId || typeof characterId !== 'string' || characterId.length !== 24) {
    return res.status(400).json({
      success: false,
      message: 'Invalid character ID format'
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
    const result = await startMinionBattleService(character, tier);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

const startBossBattle = asyncHandler(async (req, res) => {
  const { characterId, tier } = req.body;
  
  if (!characterId || tier === undefined) {
    return res.status(400).json({
      success: false,
      message: 'Character ID and tier are required'
    });
  }
  
  if (tier < 0 || tier > 5) {
    return res.status(400).json({
      success: false,
      message: 'Invalid tier (0-5)'
    });
  }
  
  if (!characterId || typeof characterId !== 'string' || characterId.length !== 24) {
    return res.status(400).json({
      success: false,
      message: 'Invalid character ID format'
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
    const result = await startBossBattleService(character, tier);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

const performBattleTurn = asyncHandler(async (req, res) => {
  const { characterId, battleId, spellType } = req.body;
  
  if (!characterId || !battleId || !spellType) {
    return res.status(400).json({
      success: false,
      message: 'Character ID, battle ID, and spell type are required'
    });
  }
  
  if (!['blast', 'nova', 'bolt'].includes(spellType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid spell type. Must be blast, nova, or bolt'
    });
  }
  
  if (!characterId || typeof characterId !== 'string' || characterId.length !== 24) {
    return res.status(400).json({
      success: false,
      message: 'Invalid character ID format'
    });
  }
  
  if (!battleId || typeof battleId !== 'string' || battleId.length !== 24) {
    return res.status(400).json({
      success: false,
      message: 'Invalid battle ID format'
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
  
  try {
    const result = await processBattleTurn(character, battleId, spellType);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

const getBattleConfig = (req, res) => {
  res.json({
    success: true,
    config: {
      spells: BATTLE_CONFIG.spells,
      minions: BATTLE_CONFIG.minions,
      bosses: BATTLE_CONFIG.bosses,
      equipmentBonuses: BATTLE_CONFIG.equipmentBonuses
    }
  });
};

export default {
  startMinionBattle,
  startBossBattle,
  performBattleTurn,
  getBattleConfig
};
