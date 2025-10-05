// Character calculation utilities
// These functions match the backend logic for consistency

export const calculateTotalPowerBonus = (character) => {
  if (!character?.equipment) return 0;
  
  let powerBonus = 0;
  let minTier = 999;
  let tier1Items = 0;

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      // Equipment bonuses from config
      const equipmentBonuses = {
        ring: { damage: [0, 4, 9, 20, 45, 100, 225] },
        cloak: { damage: [0, 4, 9, 20, 45, 100, 225] },
        belt: { damage: [0, 4, 9, 20, 45, 100, 225] }
      };
      
      const bonus = equipmentBonuses[item];
      if (bonus) {
        const tierIndex = Math.min(stats.tier, bonus.damage.length - 1);
        powerBonus += bonus.damage[tierIndex];
      }
      
      if (stats.tier >= 1) {
        tier1Items++;
        minTier = Math.min(minTier, stats.tier);
      }
    }
  });

  // Set bonus
  const setBonuses = [
    { damage: 0, health: 0 },       // Tier 0: no set bonus
    { damage: 20, health: 100 },    // Tier 1: +20 power, +100 health
    { damage: 45, health: 225 },    // Tier 2: +45 power, +225 health
    { damage: 100, health: 500 },   // Tier 3: +100 power, +500 health
    { damage: 225, health: 1125 },  // Tier 4: +225 power, +1125 health
    { damage: 500, health: 2500 },  // Tier 5: +500 power, +2500 health
    { damage: 1125, health: 5625 }  // Tier 6: +1125 power, +5625 health
  ];

  if (tier1Items >= 3 && minTier >= 1) {
    const setBonusIndex = Math.min(minTier, setBonuses.length - 1);
    powerBonus += setBonuses[setBonusIndex].damage;
  }

  return powerBonus;
};

export const calculateTotalHealthBonus = (character) => {
  if (!character?.equipment) return 0;
  
  let healthBonus = 0;
  let minTier = 999;
  let tier1Items = 0;

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      // Equipment bonuses from config
      const equipmentBonuses = {
        ring: { health: [0, 20, 45, 100, 225, 500, 1125] },
        cloak: { health: [0, 20, 45, 100, 225, 500, 1125] },
        belt: { health: [0, 20, 45, 100, 225, 500, 1125] }
      };
      
      const bonus = equipmentBonuses[item];
      if (bonus) {
        const tierIndex = Math.min(stats.tier, bonus.health.length - 1);
        healthBonus += bonus.health[tierIndex];
      }
      
      if (stats.tier >= 1) {
        tier1Items++;
        minTier = Math.min(minTier, stats.tier);
      }
    }
  });

  // Set bonus
  const setBonuses = [
    { damage: 0, health: 0 },       // Tier 0: no set bonus
    { damage: 20, health: 100 },    // Tier 1: +20 power, +100 health
    { damage: 45, health: 225 },    // Tier 2: +45 power, +225 health
    { damage: 100, health: 500 },   // Tier 3: +100 power, +500 health
    { damage: 225, health: 1125 },  // Tier 4: +225 power, +1125 health
    { damage: 500, health: 2500 },  // Tier 5: +500 power, +2500 health
    { damage: 1125, health: 5625 }  // Tier 6: +1125 power, +5625 health
  ];

  if (tier1Items >= 3 && minTier >= 1) {
    const setBonusIndex = Math.min(minTier, setBonuses.length - 1);
    healthBonus += setBonuses[setBonusIndex].health;
  }

  return healthBonus;
};

