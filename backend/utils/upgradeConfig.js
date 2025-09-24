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
    0: { gathering: 5, minion: 3, boss: 2 },
    1: { gathering: 8, minion: 5, boss: 3 },
    2: { gathering: 12, minion: 8, boss: 5 },
    3: { gathering: 18, minion: 12, boss: 8 },
    4: { gathering: 25, minion: 18, boss: 12 }
  },
  
  maxTier: 5,
  validEquipmentTypes: ['ring', 'cloak', 'belt']
};
