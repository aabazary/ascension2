// Avatar and profile picture constants
export const MAGE_AVATARS = [
  { id: 'earth_mage', name: 'Earth Mage', image: '/mages/earth_mage.png' },
  { id: 'fire_mage', name: 'Fire Mage', image: '/mages/fire_mage.png' },
  { id: 'water_mage', name: 'Water Mage', image: '/mages/water_mage.png' },
  { id: 'lightning_mage', name: 'Lightning Mage', image: '/mages/lightning_mage.png' },
  { id: 'ice_mage', name: 'Ice Mage', image: '/mages/ice_mage.png' },
  { id: 'shadow_mage', name: 'Shadow Mage', image: '/mages/shadow_mage.png' }
];

export const DRAGONLING_AVATARS = [
  { id: 'earth__dragonling', name: 'Earth Dragonling', image: '/dragonling/earth__dragonling.png' },
  { id: 'infero_dragonling', name: 'Fire Dragonling', image: '/dragonling/infero_dragonling.png' },
  { id: 'water_dragonling', name: 'Water Dragonling', image: '/dragonling/water_dragonling.png' },
  { id: 'lightning_dragonling', name: 'Lightning Dragonling', image: '/dragonling/lightning_dragonling.png' },
  { id: 'ice_dragonling', name: 'Ice Dragonling', image: '/dragonling/ice_dragonling.png' },
  { id: 'void_dragonling', name: 'Void Dragonling', image: '/dragonling/void_dragonling.png' }
];

export const DRAGON_AVATARS = [
  { id: 'mountain_wyrm', name: 'Mountain Wyrm', image: '/dragons/mountain_wyrm.png' },
  { id: 'inferno_drake', name: 'Inferno Drake', image: '/dragons/inferno_drake.png' },
  { id: 'tsunami_serpent', name: 'Tsunami Serpent', image: '/dragons/tsunami_serpent.png' },
  { id: 'thunder_dragon', name: 'Thunder Dragon', image: '/dragons/thunder_dragon.png' },
  { id: 'frost_wyvern', name: 'Frost Wyvern', image: '/dragons/frost_wyvern.png' },
  { id: 'void_hydra', name: 'Void Hydra', image: '/dragons/void_hydra.png' }
];

export const ALL_PROFILE_PICTURES = [
  ...MAGE_AVATARS,
  ...DRAGONLING_AVATARS,
  ...DRAGON_AVATARS
];

// Avatar mapping for backward compatibility
export const AVATAR_MAP = {
  // Mages
  'earth_mage': '/mages/earth_mage.png',
  'fire_mage': '/mages/fire_mage.png',
  'water_mage': '/mages/water_mage.png',
  'lightning_mage': '/mages/lightning_mage.png',
  'ice_mage': '/mages/ice_mage.png',
  'shadow_mage': '/mages/shadow_mage.png',
  
  // Dragonlings
  'earth__dragonling': '/dragonling/earth__dragonling.png',
  'infero_dragonling': '/dragonling/infero_dragonling.png',
  'water_dragonling': '/dragonling/water_dragonling.png',
  'lightning_dragonling': '/dragonling/lightning_dragonling.png',
  'ice_dragonling': '/dragonling/ice_dragonling.png',
  'void_dragonling': '/dragonling/void_dragonling.png',
  
  // Dragons
  'mountain_wyrm': '/dragons/mountain_wyrm.png',
  'inferno_drake': '/dragons/inferno_drake.png',
  'tsunami_serpent': '/dragons/tsunami_serpent.png',
  'thunder_dragon': '/dragons/thunder_dragon.png',
  'frost_wyvern': '/dragons/frost_wyvern.png',
  'void_hydra': '/dragons/void_hydra.png'
};

// Helper function to get avatar image with backward compatibility
export const getAvatarImage = (avatar) => {
  if (!avatar) return '/mages/earth_mage.png';
  
  // Handle both old format (earth, fire, etc.) and new format (earth_mage, fire_mage, etc.)
  let avatarKey = avatar;
  if (!avatar.includes('_')) {
    avatarKey = `${avatar}_mage`;
  }
  
  return AVATAR_MAP[avatarKey] || '/mages/earth_mage.png';
};
