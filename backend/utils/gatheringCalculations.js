import { GATHERING_CONFIG } from './gatheringConfig.js';

export const calculateGatheringSuccess = (buttonClicks, tier) => {
  const tierConfig = GATHERING_CONFIG.tiers[tier];
  const successfulClicks = buttonClicks.filter(click => click.clicked).length;
  const successRate = successfulClicks / tierConfig.totalButtons;
  
  return {
    success: successRate >= tierConfig.successThreshold,
    successRate: successRate,
    successfulClicks: successfulClicks,
    requiredClicks: Math.ceil(tierConfig.totalButtons * tierConfig.successThreshold)
  };
};

export const calculateResourcesGained = (tier) => {
  const tierConfig = GATHERING_CONFIG.tiers[tier];
  return Math.floor(Math.random() * (tierConfig.resourceRewards.max - tierConfig.resourceRewards.min + 1)) + tierConfig.resourceRewards.min;
};
