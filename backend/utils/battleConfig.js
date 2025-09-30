export const BATTLE_CONFIG = {
  // Base character health
  baseHealth: 10,
  
  spells: {
            blast: {
              name: 'Blast',
              baseDamage: 3.0,
              missChance: 0.10,
              critChance: 0.15,
              critMultiplier: 2.0
            },
            nova: {
              name: 'Nova',
              baseDamage: 3.0,
              missChance: 0.10,
              critChance: 0.15,
              critMultiplier: 2.0
            },
            bolt: {
              name: 'Bolt',
              baseDamage: 3.0,
              missChance: 0.10,
              critChance: 0.15,
              critMultiplier: 2.0
            }
  },
  minions: {
    0: { health: 16, damage: 3, hitRate: 0.90, name: 'Tier 0 Dragonling' },
    1: { health: 15, damage: 4, hitRate: 0.90, name: 'Tier 1 Dragonling' },
    2: { health: 20, damage: 5, hitRate: 0.90, name: 'Tier 2 Dragonling' },
    3: { health: 25, damage: 6, hitRate: 0.90, name: 'Tier 3 Dragonling' },
    4: { health: 30, damage: 7, hitRate: 0.90, name: 'Tier 4 Dragonling' },
    5: { health: 35, damage: 8, hitRate: 0.90, name: 'Tier 5 Dragonling' }
  },
  bosses: {
    0: { health: 14, damage: 4, hitRate: 0.85, name: 'Tier 0 Dragon' },
    1: { health: 15, damage: 12, hitRate: 0.95, name: 'Tier 1 Dragon' },
    2: { health: 20, damage: 14, hitRate: 0.95, name: 'Tier 2 Dragon' },
    3: { health: 25, damage: 16, hitRate: 0.95, name: 'Tier 3 Dragon' },
    4: { health: 30, damage: 18, hitRate: 0.95, name: 'Tier 4 Dragon' },
    5: { health: 35, damage: 20, hitRate: 0.95, name: 'Tier 5 Dragon' }
  },
  // Equipment bonuses are now defined in upgradeConfig.js
  // This is kept for backward compatibility but should use UPGRADE_CONFIG.equipmentBonuses
};
