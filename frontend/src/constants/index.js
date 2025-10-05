// Shared constants across the application

export const TIER_THEMES = {
  0: {
    name: 'Earth',
    color: 'from-amber-500 to-yellow-600',
    borderColor: 'border-amber-500',
    glow: 'shadow-amber-500/50',
    egg: '🪨',
  },
  1: {
    name: 'Fire',
    color: 'from-red-500 to-orange-600',
    borderColor: 'border-red-500',
    glow: 'shadow-red-500/50',
    egg: '🔥',
  },
  2: {
    name: 'Water',
    color: 'from-blue-500 to-cyan-600',
    borderColor: 'border-blue-500',
    glow: 'shadow-blue-500/50',
    egg: '💧',
  },
  3: {
    name: 'Lightning',
    color: 'from-yellow-400 to-yellow-600',
    borderColor: 'border-yellow-400',
    glow: 'shadow-yellow-400/50',
    egg: '⚡',
  },
  4: {
    name: 'Ice',
    color: 'from-cyan-400 to-blue-500',
    borderColor: 'border-cyan-400',
    glow: 'shadow-cyan-400/50',
    egg: '❄️',
  },
  5: {
    name: 'Shadow',
    color: 'from-purple-500 to-pink-600',
    borderColor: 'border-purple-500',
    glow: 'shadow-purple-500/50',
    egg: '🌑',
  },
};

export const ELEMENT_COLORS = {
  fire: {
    glow: '#ff6b35',
    shadow: '#ff0000',
    particle: '#ff8c42'
  },
  water: {
    glow: '#42a5f5',
    shadow: '#1976d2',
    particle: '#64b5f6'
  },
  earth: {
    glow: '#ffb74d',
    shadow: '#f57c00',
    particle: '#ffcc02'
  },
  lightning: {
    glow: '#ffeb3b',
    shadow: '#fbc02d',
    particle: '#fff176'
  },
  ice: {
    glow: '#81d4fa',
    shadow: '#29b6f6',
    particle: '#b3e5fc'
  },
  shadow: {
    glow: '#ba68c8',
    shadow: '#8e24aa',
    particle: '#ce93d8'
  }
};

export const SPELL_CONFIGS = {
  nova: {
    name: 'Nova',
    emoji: '💥',
    hitChance: 0.5,
    critChance: 0.3,
    damage: 25
  },
  bolt: {
    name: 'Bolt',
    emoji: '⚡',
    hitChance: 0.6,
    critChance: 0.0,
    damage: 20
  },
  blast: {
    name: 'Blast',
    emoji: '💢',
    hitChance: 0.3,
    critChance: 1.0,
    damage: 35
  }
};
