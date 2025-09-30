export const UPGRADE_CONFIG = {
  infusionCosts: {
    0: 1,    // Tier 0 -> 1: 1 infusion
    1: 3,    // Tier 1 -> 2: 3 infusions
    2: 5,    // Tier 2 -> 3: 5 infusions
    3: 8,    // Tier 3 -> 4: 8 infusions
    4: 12,   // Tier 4 -> 5: 12 infusions
  },
  
  equipmentRequirements: {
    belt: {
      resources: ['gathering'],
      description: 'Requires gathering resources'
    },
    cloak: {
      resources: ['gathering', 'minion'],
      description: 'Requires gathering and minion resources'
    },
    ring: {
      resources: ['gathering', 'minion', 'boss'],
      description: 'Requires all resources (gathering, minion, boss)'
    }
  },
  
  resourceCosts: {
    0: { gathering: 50, minion: 30, boss: 20 },
    1: { gathering: 80, minion: 50, boss: 30 },
    2: { gathering: 120, minion: 80, boss: 50 },
    3: { gathering: 180, minion: 120, boss: 80 },
    4: { gathering: 250, minion: 180, boss: 120 }
  },

          equipmentBonuses: {
            ring: { 
              damage: [0, 0.14, 0.35, 0.9, 1.7],     // +0, +0.14, +0.35, +0.9, +1.7 damage per tier
              health: [0, 0.24, 0.65, 1.7, 2.7]     // +0, +0.24, +0.65, +1.7, +2.7 health per tier
            },
            cloak: { 
              damage: [0, 0.14, 0.35, 0.9, 1.7],     // +0, +0.14, +0.35, +0.9, +1.7 damage per tier
              health: [0, 0.24, 0.65, 1.7, 2.7]     // +0, +0.24, +0.65, +1.7, +2.7 health per tier
            },
            belt: { 
              damage: [0, 0.14, 0.35, 0.9, 1.7],     // +0, +0.14, +0.35, +0.9, +1.7 damage per tier
              health: [0, 0.24, 0.65, 1.7, 2.7]     // +0, +0.24, +0.65, +1.7, +2.7 health per tier
            }
          },
  
  maxTier: 5,
  validEquipmentTypes: ['ring', 'cloak', 'belt']
};
