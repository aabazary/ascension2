import { BATTLE_CONFIG } from './battleConfig.js';
import { UPGRADE_CONFIG } from './upgradeConfig.js';

export const calculateCharacterHealth = (character) => {
  const baseHealth = BATTLE_CONFIG.player.baseHealth; // 100 HP base
  let healthBonus = 0;
  let minTier = 999;
  let tier1Items = 0;

  if (!character.equipment) {
    return baseHealth;
  }

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      const bonus = UPGRADE_CONFIG.equipmentBonuses[item];
      const tierIndex = Math.min(stats.tier, bonus.health.length - 1);
      healthBonus += bonus.health[tierIndex]; // Tier-based health bonus
      if (stats.tier >= 1) {
        tier1Items++;
        minTier = Math.min(minTier, stats.tier);
      }
    }
  });

  // Apply set bonus if all 3 pieces are tier 1+ (based on lowest tier)
  if (tier1Items >= 3 && minTier < UPGRADE_CONFIG.setBonuses.length) {
    healthBonus += UPGRADE_CONFIG.setBonuses[minTier].health;
  }

  const totalHealth = baseHealth + healthBonus;
  return totalHealth;
};

export const calculateCharacterPower = (character) => {
  const basePower = 0; // No base power - power comes only from equipment
  let powerBonus = 0;
  let minTier = 999;
  let tier1Items = 0;

  if (!character.equipment) {
    return basePower;
  }

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      const bonus = UPGRADE_CONFIG.equipmentBonuses[item];
      const tierIndex = Math.min(stats.tier, bonus.damage.length - 1);
      const itemBonus = bonus.damage[tierIndex];
      powerBonus += itemBonus; // Tier-based power bonus
      if (stats.tier >= 1) {
        tier1Items++;
        minTier = Math.min(minTier, stats.tier);
      }
    }
  });

  // Apply set bonus if all 3 pieces are tier 1+ (based on lowest tier)
  if (tier1Items >= 3 && minTier < UPGRADE_CONFIG.setBonuses.length) {
    const setBonus = UPGRADE_CONFIG.setBonuses[minTier].damage;
    powerBonus += setBonus;
  }

  const totalPower = basePower + powerBonus;
  return totalPower;
};


