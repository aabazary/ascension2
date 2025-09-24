export const BATTLE_CONFIG = {
  spells: {
    blast: {
      name: 'Blast',
      baseDamage: 10,
      missChance: 0.15,
      critChance: 0.10,
      critMultiplier: 2.0
    },
    nova: {
      name: 'Nova',
      baseDamage: 15,
      missChance: 0.20,
      critChance: 0.15,
      critMultiplier: 2.5
    },
    bolt: {
      name: 'Bolt',
      baseDamage: 8,
      missChance: 0.10,
      critChance: 0.05,
      critMultiplier: 3.0
    }
  },
  minions: {
    0: { health: 50, damage: 5, name: 'Tier 0 Dragonling' },
    1: { health: 75, damage: 8, name: 'Tier 1 Dragonling' },
    2: { health: 100, damage: 12, name: 'Tier 2 Dragonling' },
    3: { health: 125, damage: 15, name: 'Tier 3 Dragonling' },
    4: { health: 150, damage: 18, name: 'Tier 4 Dragonling' },
    5: { health: 175, damage: 22, name: 'Tier 5 Dragonling' }
  },
  bosses: {
    0: { health: 100, damage: 10, name: 'Tier 0 Dragon' },
    1: { health: 150, damage: 15, name: 'Tier 1 Dragon' },
    2: { health: 200, damage: 20, name: 'Tier 2 Dragon' },
    3: { health: 250, damage: 25, name: 'Tier 3 Dragon' },
    4: { health: 300, damage: 30, name: 'Tier 4 Dragon' },
    5: { health: 350, damage: 35, name: 'Tier 5 Dragon' }
  },
  equipmentBonuses: {
    ring: { damage: 0.1, accuracy: 0.05 },
    cloak: { damage: 0.15, accuracy: 0.10 },
    belt: { damage: 0.1, accuracy: 0.05 }
  }
};
