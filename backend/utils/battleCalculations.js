import { BATTLE_CONFIG } from './battleConfig.js';
import { UPGRADE_CONFIG } from './upgradeConfig.js';

export const calculateCharacterHealth = (character) => {
  const baseHealth = BATTLE_CONFIG.baseHealth; // 10 HP base
  let healthBonus = 0;

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      const bonus = UPGRADE_CONFIG.equipmentBonuses[item];
      const tierIndex = Math.min(stats.tier, bonus.health.length - 1);
      healthBonus += bonus.health[tierIndex]; // Tier-based health bonus
    }
  });

  return baseHealth + healthBonus;
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

  let damage = spell.baseDamage;
  let missChance = spell.missChance;
  let critChance = spell.critChance;

  // Apply equipment damage bonuses (tier-based bonuses)
  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      const bonus = UPGRADE_CONFIG.equipmentBonuses[item];
      const tierIndex = Math.min(stats.tier, bonus.damage.length - 1);
      damage += bonus.damage[tierIndex]; // Tier-based damage bonus
    }
  });

  // Tier penalty for higher tier enemies
  const tierPenalty = tier * 0.05;
  missChance = Math.min(0.5, missChance + tierPenalty);

  return {
    baseDamage: damage,
    missChance,
    critChance,
    critMultiplier: spell.critMultiplier
  };
};

export const executeSpell = (spellType, character, tier) => {
  const spellStats = calculateSpellDamage(spellType, character, tier);
  
  // Check for miss
  if (Math.random() < spellStats.missChance) {
    return {
      hit: false,
      damage: 0,
      crit: false,
      message: `${BATTLE_CONFIG.spells[spellType].name} missed!`
    };
  }
  
  // Check for crit
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

