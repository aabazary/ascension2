import Character from '../models/Character.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { processGatheringAttempt } from '../services/gatheringService.js';
import { GATHERING_CONFIG } from '../utils/gatheringConfig.js';

const performGathering = asyncHandler(async (req, res) => {
  const { characterId, tier, gatheringAttempt } = req.body;
  
  if (!characterId || tier === undefined || !gatheringAttempt) {
    return res.status(400).json({
      success: false,
      message: 'Character ID, tier, and gathering attempt are required'
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
      message: 'Character tier too low for this gathering activity'
    });
  }
  
  try {
    const result = await processGatheringAttempt(character, tier, gatheringAttempt);
    res.json(result);
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message
    });
  }
});

const getGatheringConfig = (req, res) => {
  res.json({
    success: true,
    config: {
      tiers: GATHERING_CONFIG.tiers
    }
  });
};

export default {
  performGathering,
  getGatheringConfig
};


