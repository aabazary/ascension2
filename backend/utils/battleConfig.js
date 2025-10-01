export const BATTLE_CONFIG = {
  // Base character health
  baseHealth: 100,
  
  spells: {
            blast: {
              name: 'Blast',
              baseDamage: 20.0, // Will be calculated from character power
              hitRate: 0.20,    // 20% hit rate
              critChance: 1.0,  // 100% crit when it hits
              critMultiplier: 2.0
            },
            nova: {
              name: 'Nova',
              baseDamage: 20.0, // Will be calculated from character power
              hitRate: 0.50,    // 50% hit rate
              critChance: 0.30, // 30% crit when it hits
              critMultiplier: 2.0
            },
            bolt: {
              name: 'Bolt',
              baseDamage: 20.0, // Will be calculated from character power
              hitRate: 0.60,    // 60% hit rate
              critChance: 1.0,  // 100% crit when it hits
              critMultiplier: 2.0
            }
  },
  minions: {
    0: { health: 200, damage: 25, hitRate: 0.80, name: 'Tier 0 Dragonling' },
    1: { health: 450, damage: 55, hitRate: 0.80, name: 'Tier 1 Dragonling' },
    2: { health: 1000, damage: 120, hitRate: 0.80, name: 'Tier 2 Dragonling' },
    3: { health: 2250, damage: 270, hitRate: 0.80, name: 'Tier 3 Dragonling' },
    4: { health: 5000, damage: 600, hitRate: 0.80, name: 'Tier 4 Dragonling' },
    5: { health: 11250, damage: 1350, hitRate: 0.80, name: 'Tier 5 Dragonling' }
  },
  bosses: {
    0: { health: 280, damage: 35, hitRate: 0.75, name: 'Tier 0 Dragon' },
    1: { health: 630, damage: 75, hitRate: 0.75, name: 'Tier 1 Dragon' },
    2: { health: 1400, damage: 170, hitRate: 0.75, name: 'Tier 2 Dragon' },
    3: { health: 3150, damage: 380, hitRate: 0.75, name: 'Tier 3 Dragon' },
    4: { health: 7000, damage: 850, hitRate: 0.75, name: 'Tier 4 Dragon' },
    5: { health: 15750, damage: 1900, hitRate: 0.75, name: 'Tier 5 Dragon' }
  },
  // Equipment bonuses are now defined in upgradeConfig.js
  // This is kept for backward compatibility but should use UPGRADE_CONFIG.equipmentBonuses
};
