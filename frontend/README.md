# Ascension Frontend

Modern React frontend for the Ascension game with an arcade-style theme.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Axios** for API calls

## Folder Structure

```
src/
├── components/       # Reusable components
│   └── AuthModal.tsx # Login/Signup modal
├── pages/           # Page components
│   ├── LandingPage.tsx  # Home page with high scores
│   └── Dashboard.tsx    # Main dashboard
├── App.tsx          # Main app component with routing
├── main.tsx         # Entry point
├── index.css        # Global styles & Tailwind
└── vite-env.d.ts    # TypeScript definitions
```

## Features

### ✨ Arcade Theme
- Retro pixel fonts (Press Start 2P, VT323)
- Neon color palette (blue, purple, pink, green)
- Glowing effects and animations
- Responsive design

### 🎮 Pages

**Landing Page**
- High scores leaderboard
- Login/Signup modal
- Game features showcase

**Dashboard**
- Choose your activity:
  - Gather resources
  - Fight minions
  - Fight bosses
- Character stats (placeholder)
- Quick stats overview

### 🔐 Authentication
- Modal-based login/signup
- Toggle between forms
- JWT token storage
- Protected routes

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment

The frontend runs on `http://localhost:5173` and proxies API requests to `http://localhost:3000`.

## Next Steps

- [ ] Character creation/selection
- [ ] Battle interface
- [ ] Gathering mini-game
- [ ] Equipment/upgrade system
- [ ] Real-time high scores from API
- [ ] Character stats display

