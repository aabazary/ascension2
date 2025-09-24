import Character from '../models/Character.js';
import { UPGRADE_CONFIG } from '../utils/upgradeConfig.js';

export const getUpgradeInfo = (character, equipmentType) => {
  const currentTier = character.equipment[equipmentType].tier;
  const maxTier = UPGRADE_CONFIG.maxTier;
  
  if (currentTier >= maxTier) {
    return {
      canUpgrade: false,
      message: `${equipmentType} is already at maximum tier`
    };
  }
  
  const targetTier = currentTier + 1;
  const infusionCost = UPGRADE_CONFIG.infusionCosts[currentTier];
  const requirements = UPGRADE_CONFIG.equipmentRequirements[equipmentType];
  const resourceCosts = UPGRADE_CONFIG.resourceCosts[currentTier];
  
  const requiredResources = {};
  const resourceStatus = {};
  
  requirements.resources.forEach(resourceType => {
    const requiredAmount = resourceCosts[resourceType] * infusionCost;
    const currentAmount = character.getResourceCount(resourceType, currentTier);
    
    requiredResources[resourceType] = requiredAmount;
    resourceStatus[resourceType] = {
      required: requiredAmount,
      current: currentAmount,
      needed: Math.max(0, requiredAmount - currentAmount),
      hasEnough: currentAmount >= requiredAmount
    };
  });
  
  const canUpgrade = Object.values(resourceStatus).every(status => status.hasEnough);
  
  return {
    canUpgrade,
    currentTier,
    targetTier,
    infusionCost,
    requiredResources,
    resourceStatus,
    description: requirements.description,
    totalInfusionsNeeded: infusionCost,
    message: canUpgrade 
      ? `Ready to upgrade ${equipmentType} to tier ${targetTier}`
      : `Need more resources to upgrade ${equipmentType} to tier ${targetTier}`
  };
};

export const performUpgrade = async (character, equipmentType) => {
  const upgradeInfo = getUpgradeInfo(character, equipmentType);
  
  if (!upgradeInfo.canUpgrade) {
    throw new Error(upgradeInfo.message);
  }
  
  const { requiredResources, targetTier } = upgradeInfo;
  const currentTier = character.equipment[equipmentType].tier;
  
  for (const [resourceType, requiredAmount] of Object.entries(requiredResources)) {
    const resourceIndex = character.resources.findIndex(r => r.type === resourceType && r.tier === currentTier);
    character.resources[resourceIndex].count -= requiredAmount;
    
    if (character.resources[resourceIndex].count <= 0) {
      character.resources.splice(resourceIndex, 1);
    }
  }
  
  character.equipment[equipmentType].tier = targetTier;
  character.equipment[equipmentType].infused = true;
  
  await character.save();
  
  return {
    success: true,
    message: `${equipmentType} upgraded to tier ${targetTier}`,
    newTier: targetTier,
    resourcesUsed: requiredResources
  };
};

export const checkTierUnlock = (character) => {
  const allEquipmentTier = Math.min(
    character.equipment.ring.tier,
    character.equipment.cloak.tier,
    character.equipment.belt.tier
  );
  
  const maxUnlockedTier = allEquipmentTier;
  const currentTier = character.currentTier;
  
  if (maxUnlockedTier > currentTier) {
    character.currentTier = maxUnlockedTier;
    return {
      tierUnlocked: true,
      newTier: maxUnlockedTier,
      message: `Tier ${maxUnlockedTier} unlocked! You can now access tier ${maxUnlockedTier} activities.`
    };
  }
  
  return {
    tierUnlocked: false,
    currentTier,
    maxUnlockedTier
  };
};
