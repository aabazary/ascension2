export const UPGRADE_CONFIG = {
  infusionCosts: {
    0: 1,    // Tier 0 -> 1: 1 infusion
    1: 3,    // Tier 1 -> 2: 3 infusions
    2: 5,    // Tier 2 -> 3: 5 infusions
    3: 8,    // Tier 3 -> 4: 8 infusions
    4: 12,   // Tier 4 -> 5: 12 infusions
    5: 18,   // Tier 5 -> 6: 18 infusions
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
    4: { gathering: 250, minion: 180, boss: 120 },
    5: { gathering: 350, minion: 250, boss: 180 }
  },

          equipmentBonuses: {
            ring: { 
              damage: [0, 4, 9, 20, 45, 100, 225],       
              health: [0, 20, 45, 100, 225, 500, 1125]   
            },
            cloak: { 
              damage: [0, 4, 9, 20, 45, 100, 225],      
              health: [0, 20, 45, 100, 225, 500, 1125]  
            },
            belt: { 
              damage: [0, 4, 9, 20, 45, 100, 225],      
              health: [0, 20, 45, 100, 225, 500, 1125]  
            }
          },
          
          // Set bonuses for having all 3 pieces at each tier level
          setBonuses: [
            { damage: 0, health: 0 },       
            { damage: 20, health: 100 },    
            { damage: 45, health: 225 },    
            { damage: 100, health: 500 },   
            { damage: 225, health: 1125 },  
            { damage: 500, health: 2500 },  
            { damage: 2500, health: 15000 }  
          ],
  
  maxTier: 6,
  validEquipmentTypes: ['ring', 'cloak', 'belt']
};
