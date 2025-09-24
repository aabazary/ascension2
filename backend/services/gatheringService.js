import Character from '../models/Character.js';
import ActivityLog from '../models/ActivityLog.js';
import { validateGatheringAttempt } from '../utils/gatheringValidation.js';
import { calculateGatheringSuccess, calculateResourcesGained } from '../utils/gatheringCalculations.js';
import { GATHERING_CONFIG } from '../utils/gatheringConfig.js';

export const processGatheringAttempt = async (character, tier, gatheringAttempt) => {
  const validation = validateGatheringAttempt(gatheringAttempt, tier);
  if (!validation.valid) {
    throw new Error(`Invalid gathering attempt: ${validation.reason}`);
  }
  
  const skillResult = calculateGatheringSuccess(gatheringAttempt.buttonClicks, tier);
  
  let resourcesGained = 0;
  let resourcesGainedDetails = [];
  
  if (skillResult.success) {
    resourcesGained = calculateResourcesGained(tier);
    await character.addResource('gathering', tier, resourcesGained);
    
    resourcesGainedDetails = [{
      type: 'gathering',
      tier: tier,
      amount: resourcesGained
    }];
  }
  
  character.lastActivity = new Date();
  await character.save();
  
  await ActivityLog.create({
    characterId: character._id,
    activityType: 'gathering',
    tier: tier,
    success: skillResult.success,
    resourcesGained: resourcesGainedDetails,
    equipmentUsed: character.equipment,
    battleDetails: {
      successRate: skillResult.successRate,
      successfulClicks: skillResult.successfulClicks,
      requiredClicks: skillResult.requiredClicks,
      totalButtons: GATHERING_CONFIG.tiers[tier].totalButtons,
      buttonWindow: GATHERING_CONFIG.tiers[tier].buttonWindow,
      timeSpent: gatheringAttempt.timeSpent
    },
    duration: Math.floor(gatheringAttempt.timeSpent / 1000)
  });
  
  return {
    success: skillResult.success,
    successRate: skillResult.successRate,
    successfulClicks: skillResult.successfulClicks,
    requiredClicks: skillResult.requiredClicks,
    resourcesGained,
    resourcesGainedDetails,
    gatheringStats: {
      totalButtons: GATHERING_CONFIG.tiers[tier].totalButtons,
      buttonWindow: GATHERING_CONFIG.tiers[tier].buttonWindow,
      timeSpent: gatheringAttempt.timeSpent
    },
    character: {
      resources: character.resources,
      stats: character.stats
    }
  };
};
