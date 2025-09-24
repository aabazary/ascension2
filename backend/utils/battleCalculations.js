import { BATTLE_CONFIG } from './battleConfig.js';

const calculateSpellDamage = (spellType, character, tier) => {
  const spell = BATTLE_CONFIG.spells[spellType];
  if (!spell) {
    throw new Error('Invalid spell type');
  }
  
  let damage = spell.baseDamage;
  let missChance = spell.missChance;
  let critChance = spell.critChance;
  
  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      const bonus = BATTLE_CONFIG.equipmentBonuses[item];
      damage += Math.floor(damage * bonus.damage);
      missChance = Math.max(0, missChance - bonus.accuracy);
    }
  });
  
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

