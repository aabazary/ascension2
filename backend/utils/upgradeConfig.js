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
              damage: [0, 4, 9, 20, 45, 100],       // Tier 0-5: +0, +4, +9, +20, +45, +100 power per tier
              health: [0, 20, 45, 100, 225, 500]    // Tier 0-5: +0, +20, +45, +100, +225, +500 health per tier
            },
            cloak: { 
              damage: [0, 4, 9, 20, 45, 100],       // Tier 0-5: +0, +4, +9, +20, +45, +100 power per tier
              health: [0, 20, 45, 100, 225, 500]    // Tier 0-5: +0, +20, +45, +100, +225, +500 health per tier
            },
            belt: { 
              damage: [0, 4, 9, 20, 45, 100],       // Tier 0-5: +0, +4, +9, +20, +45, +100 power per tier
              health: [0, 20, 45, 100, 225, 500]    // Tier 0-5: +0, +20, +45, +100, +225, +500 health per tier
            }
          },
          
          // Set bonuses for having all 3 pieces at each tier level
          setBonuses: [
            { damage: 0, health: 0 },       // Tier 0: no set bonus
            { damage: 20, health: 100 },    // Tier 1: +20 power, +100 health
            { damage: 45, health: 225 },    // Tier 2: +45 power, +225 health
            { damage: 100, health: 500 },   // Tier 3: +100 power, +500 health
            { damage: 225, health: 1125 },  // Tier 4: +225 power, +1125 health
            { damage: 500, health: 2500 }   // Tier 5: +500 power, +2500 health
          ],
  
  maxTier: 5,
  validEquipmentTypes: ['ring', 'cloak', 'belt']
};
