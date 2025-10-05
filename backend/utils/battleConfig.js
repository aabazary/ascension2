export const BATTLE_CONFIG = {
  tiers: {
    0: {
      minionHealth: 80,
      minionDamage: 30,
      minionName: 'Earth Dragonling',
      minionImage: '/dragonling/earth__dragonling.png',
      bossHealth: 200,
      bossDamage: 40,
      bossName: 'Mountain Wyrm',
      bossImage: '/dragons/mountain_wyrm.png'
    },
    1: {
      minionHealth: 240,
      minionDamage: 70,
      minionName: 'Inferno Dragonling',
      minionImage: '/dragonling/infero_dragonling.png',
      bossHealth: 400,
      bossDamage: 85,
      bossName: 'Inferno Drake',
      bossImage: '/dragons/inferno_drake.png'
    },
    2: {
      minionHealth: 500,
      minionDamage: 135,
      minionName: 'Water Dragonling',
      minionImage: '/dragonling/water_dragonling.png',
      bossHealth: 700,
      bossDamage: 150,
      bossName: 'Tsunami Serpent',
      bossImage: '/dragons/tsunami_serpent.png'
    },
    3: {
      minionHealth: 1300,
      minionDamage: 300,
      minionName: 'Lightning Dragonling',
      minionImage: '/dragonling/lightning_dragonling.png',
      bossHealth: 1500,
      bossDamage: 350,
      bossName: 'Thunder Dragon',
      bossImage: '/dragons/thunder_dragon.png'
    },
    4: {
      minionHealth: 3000,
      minionDamage: 660,
      minionName: 'Ice Dragonling',
      minionImage: '/dragonling/ice_dragonling.png',
      bossHealth: 3500,
      bossDamage: 750,
      bossName: 'Frost Wyvern',
      bossImage: '/dragons/frost_wyvern.png'
    },
    5: {
      minionHealth: 7000,
      minionDamage: 1500,
      minionName: 'Shadow Dragonling',
      minionImage: '/dragonling/void_dragonling.png',
      bossHealth: 10000,
      bossDamage: 2000,
      bossName: 'Void Hydra',
      bossImage: '/dragons/void_hydra.png'
    },
    6: {
      // Tier 6 has no minion - only Master boss battle
      bossHealth: 25000,
      bossDamage: 5000,
      bossName: 'Master',
      bossImage: '/mages/shadow_master.png' // Will be dynamically generated based on character avatar
    }
  },
  
  spells: {
    blast: {
      name: 'Blast',
      emoji: '💥',
      hitChance: 0.5,
      baseDamage: 15,
      critChance: 1.0,
      critMultiplier: 2.0,
      compensationFactor: 1.0, // Average damage: 15
      description: 'A powerful energy blast'
    },
    nova: {
      name: 'Nova',
      emoji: '🌟',
      hitChance: 0.6,
      baseDamage: 20,
      critChance: 0.25,
      critMultiplier: 2.0,
      compensationFactor: 1.333, // Average damage: 15
      description: 'A devastating nova explosion'
    },
    bolt: {
      name: 'Bolt',
      emoji: '⚡',
      hitChance: 0.6,
      baseDamage: 25,
      critChance: 0.0,
      critMultiplier: 2.0,
      compensationFactor: 1.6667, // Average damage: 15
      description: 'A quick lightning bolt'
    }
  },
  
  player: {
    baseHealth: 100,
    baseDamage: 0 // Player damage comes from spells
  },
  
  avatars: {
    earth: '/mages/earth_mage.png',
    fire: '/mages/fire_mage.png',
    water: '/mages/water_mage.png',
    lightning: '/mages/lightning_mage.png',
    ice: '/mages/ice_mage.png',
    shadow: '/mages/shadow_mage.png'
  }
};