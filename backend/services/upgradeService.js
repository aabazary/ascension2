import Character from '../models/Character.js';
import { UPGRADE_CONFIG } from '../utils/upgradeConfig.js';

export const getUpgradeInfo = (character, equipmentType) => {
  const currentTier = character.equipment[equipmentType].tier;
  const currentInfusionLevel = character.equipment[equipmentType].infusionLevel;
  const maxTier = UPGRADE_CONFIG.maxTier;
  
  if (currentTier >= maxTier) {
    return {
      canUpgrade: false,
      currentTier,
      maxTier,
      currentInfusionLevel,
      targetTier: currentTier,
      totalInfusionsNeeded: 0,
      requiredResources: {},
      resourceStatus: {},
      description: `${equipmentType} at maximum tier`,
      message: `${equipmentType} is already at maximum tier`
    };
  }
  
  const targetTier = currentTier + 1;
  const totalInfusionsNeeded = UPGRADE_CONFIG.infusionCosts[currentTier];
  const requirements = UPGRADE_CONFIG.equipmentRequirements[equipmentType];
  const resourceCosts = UPGRADE_CONFIG.resourceCosts[currentTier];
  
  // Calculate resources needed for one infusion
  const requiredResources = {};
  const resourceStatus = {};
  
  requirements.resources.forEach(resourceType => {
    const requiredAmount = resourceCosts[resourceType]; // Per infusion, not total
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
    currentInfusionLevel,
    targetTier,
    totalInfusionsNeeded,
    requiredResources,
    resourceStatus,
    description: requirements.description,
    message: canUpgrade 
      ? `Ready to infuse ${equipmentType} (${currentInfusionLevel + 1}/${totalInfusionsNeeded} infusions)`
      : `Need more resources to infuse ${equipmentType}`
  };
};

export const performUpgrade = async (character, equipmentType) => {
  const upgradeInfo = getUpgradeInfo(character, equipmentType);
  
  if (!upgradeInfo.canUpgrade) {
    throw new Error(upgradeInfo.message);
  }
  
  const { requiredResources, currentTier, currentInfusionLevel, totalInfusionsNeeded, targetTier } = upgradeInfo;
  
  // Spend resources for one infusion
  for (const [resourceType, requiredAmount] of Object.entries(requiredResources)) {
    const resourceIndex = character.resources.findIndex(r => r.type === resourceType && r.tier === currentTier);
    character.resources[resourceIndex].count -= requiredAmount;
    
    if (character.resources[resourceIndex].count <= 0) {
      character.resources.splice(resourceIndex, 1);
    }
  }
  
  // Increment infusion level
  character.equipment[equipmentType].infusionLevel += 1;
  
  // Check if we've completed all infusions for this tier
  if (character.equipment[equipmentType].infusionLevel >= totalInfusionsNeeded) {
    character.equipment[equipmentType].tier = targetTier;
    character.equipment[equipmentType].infused = true;
    character.equipment[equipmentType].infusionLevel = 0; // Reset for next tier
  }
  
  // Update character's currentTier based on infused equipment
  updateCharacterTier(character);
  
  await character.save();
  
  const newInfusionLevel = character.equipment[equipmentType].infusionLevel;
  const newTier = character.equipment[equipmentType].tier;
  
  return {
    success: true,
    message: character.equipment[equipmentType].infused 
      ? `${equipmentType} upgraded to tier ${newTier}!`
      : `${equipmentType} infused (${newInfusionLevel}/${totalInfusionsNeeded} infusions)`,
    newTier,
    newInfusionLevel,
    resourcesUsed: requiredResources,
    tierUpgraded: character.equipment[equipmentType].infused
  };
};

const updateCharacterTier = (character) => {
  // Calculate currentTier based on the minimum tier of ALL equipment (infused or not)
  if (!character.equipment) {
    character.currentTier = 0;
    return;
  }
  
  const allEquipmentTiers = Object.values(character.equipment).map(equip => equip.tier || 0);
  const minTier = Math.min(...allEquipmentTiers);
  character.currentTier = minTier;
};

export const checkTierUnlock = (character) => {
  if (!character.equipment) {
    return {
      tierUnlocked: false,
      currentTier: 0,
      maxUnlockedTier: 0
    };
  }
  
  const allEquipmentTier = Math.min(
    character.equipment.ring?.tier || 0,
    character.equipment.cloak?.tier || 0,
    character.equipment.belt?.tier || 0
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
