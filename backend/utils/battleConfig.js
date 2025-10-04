export const BATTLE_CONFIG = {
  tiers: {
    0: {
      minionHealth: 50,
      minionDamage: 15,
      minionName: 'Earth Dragonling',
      minionImage: '/dragonling/earth__dragonling.png',
      bossHealth: 150,
      bossDamage: 30,
      bossName: 'Mountain Wyrm',
      bossImage: '/dragons/mountain_wyrm.png'
    },
    1: {
      minionHealth: 70,
      minionDamage: 20,
      minionName: 'Inferno Dragonling',
      minionImage: '/dragonling/infero_dragonling.png',
      bossHealth: 200,
      bossDamage: 40,
      bossName: 'Inferno Drake',
      bossImage: '/dragons/inferno_drake.png'
    },
    2: {
      minionHealth: 90,
      minionDamage: 25,
      minionName: 'Water Dragonling',
      minionImage: '/dragonling/water_dragonling.png',
      bossHealth: 250,
      bossDamage: 50,
      bossName: 'Tsunami Serpent',
      bossImage: '/dragons/tsunami_serpent.png'
    },
    3: {
      minionHealth: 120,
      minionDamage: 30,
      minionName: 'Lightning Dragonling',
      minionImage: '/dragonling/lightning_dragonling.png',
      bossHealth: 300,
      bossDamage: 60,
      bossName: 'Thunder Dragon',
      bossImage: '/dragons/thunder_dragon.png'
    },
    4: {
      minionHealth: 150,
      minionDamage: 35,
      minionName: 'Ice Dragonling',
      minionImage: '/dragonling/ice_dragonling.png',
      bossHealth: 350,
      bossDamage: 70,
      bossName: 'Frost Wyvern',
      bossImage: '/dragons/frost_wyvern.png'
    },
    5: {
      minionHealth: 200,
      minionDamage: 40,
      minionName: 'Shadow Dragonling',
      minionImage: '/dragonling/void_dragonling.png',
      bossHealth: 400,
      bossDamage: 80,
      bossName: 'Void Hydra',
      bossImage: '/dragons/void_hydra.png'
    }
  },
  
  spells: {
    blast: {
      name: 'Blast',
      emoji: '💥',
      hitChance: 0.3,
      baseDamage: 25,
      critChance: 1.0,
      description: 'A powerful energy blast'
    },
    nova: {
      name: 'Nova',
      emoji: '🌟',
      hitChance: 0.5,
      baseDamage: 35,
      critChance: 0.3,
      description: 'A devastating nova explosion'
    },
    bolt: {
      name: 'Bolt',
      emoji: '⚡',
      hitChance: 0.6,
      baseDamage: 20,
      critChance: 0.0,
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