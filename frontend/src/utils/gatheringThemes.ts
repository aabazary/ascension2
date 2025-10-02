export interface TierTheme {
  name: string;
  egg: string;
  color: string;
  glow: string;
  borderColor: string;
}

export const TIER_THEMES: Record<number, TierTheme> = {
  0: {
    name: 'Earth',
    egg: '🪨',
    color: 'from-amber-600 to-yellow-700',
    glow: 'shadow-[0_0_30px_rgba(217,119,6,0.5)]',
    borderColor: 'border-amber-500'
  },
  1: {
    name: 'Fire',
    egg: '🔥',
    color: 'from-red-600 to-orange-600',
    glow: 'shadow-[0_0_30px_rgba(239,68,68,0.5)]',
    borderColor: 'border-red-500'
  },
  2: {
    name: 'Water',
    egg: '💧',
    color: 'from-blue-600 to-cyan-500',
    glow: 'shadow-[0_0_30px_rgba(37,99,235,0.5)]',
    borderColor: 'border-blue-500'
  },
  3: {
    name: 'Lightning',
    egg: '⚡',
    color: 'from-yellow-400 to-purple-500',
    glow: 'shadow-[0_0_30px_rgba(234,179,8,0.5)]',
    borderColor: 'border-yellow-400'
  },
  4: {
    name: 'Ice',
    egg: '❄️',
    color: 'from-cyan-400 to-blue-300',
    glow: 'shadow-[0_0_30px_rgba(34,211,238,0.5)]',
    borderColor: 'border-cyan-400'
  },
  5: {
    name: 'Shadow',
    egg: '🌑',
    color: 'from-purple-900 to-indigo-900',
    glow: 'shadow-[0_0_30px_rgba(109,40,217,0.5)]',
    borderColor: 'border-purple-600'
  }
};

