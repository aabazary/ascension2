/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Arcade-style neon colors
        'neon-blue': '#00f3ff',
        'neon-pink': '#ff00ff',
        'neon-purple': '#9d00ff',
        'neon-green': '#39ff14',
        'neon-yellow': '#ffff00',
        'neon-orange': '#ff6600',
        'dark-bg': '#0a0a0f',
        'dark-panel': '#1a1a2e',
        'dark-border': '#2d2d44',
      },
      fontFamily: {
        'arcade': ['"Press Start 2P"', 'cursive'],
        'pixel': ['"VT323"', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 10px currentColor, 0 0 20px currentColor',
        'neon-strong': '0 0 15px currentColor, 0 0 30px currentColor, 0 0 45px currentColor',
      },
      animation: {
        'pulse-neon': 'pulse-neon 2s ease-in-out infinite',
        'flicker': 'flicker 3s linear infinite',
        'slide-up': 'slide-up 0.3s ease-out',
      },
      keyframes: {
        'pulse-neon': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '41.99%': { opacity: '1' },
          '42%': { opacity: '0' },
          '43%': { opacity: '0' },
          '45%': { opacity: '1' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}

