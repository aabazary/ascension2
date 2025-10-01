import { BATTLE_CONFIG } from './battleConfig.js';
import { UPGRADE_CONFIG } from './upgradeConfig.js';

export const calculateCharacterHealth = (character) => {
  const baseHealth = BATTLE_CONFIG.baseHealth; // 100 HP base
  let healthBonus = 0;
  let minTier = 999;
  let tier1Items = 0;

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused && stats.tier >= 1) {
      const bonus = UPGRADE_CONFIG.equipmentBonuses[item];
      const tierIndex = Math.min(stats.tier, bonus.health.length - 1);
      healthBonus += bonus.health[tierIndex]; // Tier-based health bonus
      tier1Items++;
      minTier = Math.min(minTier, stats.tier);
    }
  });

  // Apply set bonus if all 3 pieces are tier 1+ (based on lowest tier)
  if (tier1Items >= 3 && minTier < UPGRADE_CONFIG.setBonuses.length) {
    healthBonus += UPGRADE_CONFIG.setBonuses[minTier].health;
  }

  return baseHealth + healthBonus;
};

export const calculateCharacterPower = (character) => {
  const basePower = 20; // 20 power base
  let powerBonus = 0;
  let minTier = 999;
  let tier1Items = 0;

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused && stats.tier >= 1) {
      const bonus = UPGRADE_CONFIG.equipmentBonuses[item];
      const tierIndex = Math.min(stats.tier, bonus.damage.length - 1);
      powerBonus += bonus.damage[tierIndex]; // Tier-based power bonus
      tier1Items++;
      minTier = Math.min(minTier, stats.tier);
    }
  });

  // Apply set bonus if all 3 pieces are tier 1+ (based on lowest tier)
  if (tier1Items >= 3 && minTier < UPGRADE_CONFIG.setBonuses.length) {
    powerBonus += UPGRADE_CONFIG.setBonuses[minTier].damage;
  }

  return basePower + powerBonus;
};

export const calculateTierLevel = (character) => {
  // Count how many tier 1+ items the character has
  let tierItems = 0;
  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused && stats.tier >= 1) {
      tierItems++;
    }
  });
  return tierItems;
};

const calculateSpellDamage = (spellType, character, tier) => {
  const spell = BATTLE_CONFIG.spells[spellType];
  if (!spell) {
    throw new Error('Invalid spell type');
  }

  // Use character's total power as base damage
  const characterPower = calculateCharacterPower(character);
  
  return {
    baseDamage: characterPower,
    hitRate: spell.hitRate,
    critChance: spell.critChance,
    critMultiplier: spell.critMultiplier
  };
};

export const executeSpell = (spellType, character, tier) => {
  const spellStats = calculateSpellDamage(spellType, character, tier);
  
  // Check for hit (using hit rate instead of miss chance)
  if (Math.random() >= spellStats.hitRate) {
    return {
      hit: false,
      damage: 0,
      crit: false,
      message: `${BATTLE_CONFIG.spells[spellType].name} missed!`
    };
  }
  
  // Check for crit (only if spell hits)
  const isCrit = Math.random() < spellStats.critChance;
  const damage = isCrit 
    ? Math.floor(spellStats.baseDamage * spellStats.critMultiplier)
    : spellStats.baseDamage;
  
  return {
    hit: true,
    damage,
    crit: isCrit,
    message: isCrit 
      ? `${BATTLE_CONFIG.spells[spellType].name} critical hit for ${damage} damage!`
      : `${BATTLE_CONFIG.spells[spellType].name} hit for ${damage} damage!`
  };
};

