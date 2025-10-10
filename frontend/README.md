# Ascension Frontend

React frontend for Ascension - The Elemental Trial game.

## Tech Stack

- **Framework**: React 18.3
- **Build Tool**: Vite 7.1
- **Routing**: React Router DOM 6.28
- **Styling**: TailwindCSS 3.4
- **HTTP Client**: Axios
- **State Management**: React Context API + Hooks
- **Deployment**: Vercel

## Project Structure

```
frontend/
├── public/
│   ├── armor/              # Equipment images
│   ├── ascenion/          # Logo and branding
│   ├── dragonling/        # Tier 0 enemy images
│   ├── dragons/           # Boss enemy images
│   ├── mages/             # Avatar images
│   ├── screenshots/       # Game screenshots
│   └── spells/            # Spell effect images
├── src/
│   ├── components/
│   │   ├── battle/
│   │   │   ├── BattleField.jsx
│   │   │   ├── BattleLog.jsx
│   │   │   ├── BattleStats.jsx
│   │   │   └── SpellButtons.jsx
│   │   ├── dashboard/
│   │   │   ├── ActivityLog.jsx
│   │   │   ├── CharacterCard.jsx
│   │   │   ├── CharacterSelection.jsx
│   │   │   ├── CreateCharacterModal.jsx
│   │   │   └── TierProgress.jsx
│   │   ├── gathering/
│   │   │   ├── GatheringAnimation.jsx
│   │   │   └── GatheringProgress.jsx
│   │   ├── shared/
│   │   │   ├── Header.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── upgrade/
│   │   │   ├── GearDisplay.jsx
│   │   │   └── UpgradeModal.jsx
│   │   ├── AuthModal.jsx
│   │   ├── CharacterEditModal.jsx
│   │   ├── CharacterModal.jsx
│   │   ├── EnergyWave.jsx
│   │   └── ProfileModal.jsx
│   ├── constants/
│   │   ├── avatars.js      # Avatar configurations
│   │   └── index.js
│   ├── contexts/
│   │   └── CharacterContext.jsx
│   ├── hooks/
│   │   ├── useBattle.js
│   │   ├── useBattleActions.js
│   │   ├── useBattleAPI.js
│   │   ├── useBattleState.js
│   │   ├── useBossBattle.js
│   │   ├── useBossBattleAPI.js
│   │   ├── useDashboard.js
│   │   ├── useGathering.js
│   │   └── useUpgrade.js
│   ├── pages/
│   │   ├── BattlePage.jsx
│   │   ├── BossBattlePage.jsx
│   │   ├── Dashboard.jsx
│   │   ├── GatheringPage.jsx
│   │   ├── LandingPage.jsx
│   │   ├── Leaderboard.jsx
│   │   └── UpgradeStore.jsx
│   ├── utils/
│   │   ├── api.js          # Axios configuration
│   │   ├── authUtils.js    # Authentication helpers
│   │   ├── battleUtils.js
│   │   ├── cacheUtils.js   # Client-side caching
│   │   └── formatters.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vercel.json
└── vite.config.ts
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- Backend API running (see [backend README](../backend/README.md))

### Installation

1. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**
   
   Create a `.env.local` file in the frontend directory:
   ```env
   # Backend API URL
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

## Key Features & Components

### Authentication System

- **JWT-based Authentication**: Uses httpOnly cookies for security
- **Google OAuth**: Alternative login method
- **Password Reset**: Email-based password recovery
- **Auto-refresh**: Automatic token refresh on expiry

### Page Structure

#### Landing Page
- Hero section with game information
- Feature highlights
- Screenshots carousel
- Authentication modal

#### Dashboard
- Character selection/creation (max 3)
- Character stats and tier progress
- Quick action buttons (Gather, Battle, Upgrade)
- Activity log

#### Gathering Page
- Visual gathering animation
- Progress tracking
- Resource display
- Success/failure feedback

#### Battle Page
- Real-time battle simulation
- Spell selection (Blast, Nova, Bolt)
- Health bars and damage display
- Battle log
- Victory/defeat screens

#### Boss Battle Page
- Enhanced battle interface
- Boss-specific mechanics
- Tier progression on victory

#### Upgrade Store
- Equipment display (Ring, Cloak, Belt)
- Resource requirements
- Upgrade confirmation
- Visual feedback on upgrades

#### Leaderboard
- Top players by wins
- Tier-based filtering
- Top gatherers

### State Management

#### Character Context
```javascript
const CharacterContext = createContext({
  characters: [],
  selectedCharacter: null,
  loading: false,
  setSelectedCharacter: () => {},
  refreshCharacters: () => {},
  updateCharacter: () => {}
});
```

### Custom Hooks

#### `useBattle()`
Manages battle state, animations, and API calls for minion battles.

#### `useBossBattle()`
Enhanced battle logic for boss encounters with tier progression.

#### `useGathering()`
Handles gathering mechanics, animations, and resource updates.

#### `useUpgrade()`
Manages equipment upgrade flow and validation.

#### `useDashboard()`
Centralizes dashboard data fetching and state management.

### Styling System

#### Custom Colors (TailwindCSS)
```javascript
colors: {
  'dark-bg': '#0a0a0f',
  'dark-panel': '#14141f',
  'dark-border': '#2a2a3f',
  'neon-green': '#00ff41',
  'neon-blue': '#00d4ff',
  'neon-pink': '#ff00ff',
  'neon-purple': '#8b00ff',
  'neon-yellow': '#ffea00'
}
```

#### Custom Components
- `.arcade-button`: Retro-style action buttons
- `.neon-text`: Glowing text effects
- `.arcade-panel`: Dark-themed content panels

### Performance Optimizations

#### Caching Strategy
```javascript
// Battle config caching (1 hour)
battleConfigCache = {
  data: null,
  timestamp: null,
  ttl: 60 * 60 * 1000
}

// User data caching
// Cleared on logout or profile update
```

#### Code Splitting
- Lazy loading for heavy components
- Dynamic imports for routes
- Optimized bundle size

### API Integration

#### Axios Configuration
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,  // Include cookies
  headers: {
    'Content-Type': 'application/json'
  }
});
```

#### Interceptors
- Automatic token refresh on 401
- Error handling
- Request/response logging (dev mode)

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 1024px
- **Desktop**: > 1024px

### Responsive Features
- Hamburger menu on mobile/tablet
- Adaptive resource display
- Touch-optimized buttons
- Responsive grid layouts
- Mobile-first approach

## Building for Production

```bash
# Build the app
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## Deployment

### Vercel Deployment

1. **Push to GitHub**
   ```bash
   git push origin main
   ```

2. **Configure Vercel Project**
   - Root Directory: `frontend`
   - Framework: Vite (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Set Environment Variable**
   - `VITE_API_URL`: Your backend API URL

### Environment Variables

For production deployment, set:
```
VITE_API_URL=https://your-backend-url.vercel.app/api
```

**Note**: Vite environment variables must be prefixed with `VITE_` to be exposed to the client.

## Development Tips

### Hot Module Replacement (HMR)
Vite provides instant HMR. Changes to components reflect immediately without full page reload.

### Debug Mode
The app includes console logging in development mode. Check browser console for API calls and state changes.

### Testing Locally with Backend
```bash
# Terminal 1 - Backend
cd backend && npm run dev

# Terminal 2 - Frontend  
cd frontend && npm run dev
```

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Accessibility

- Semantic HTML structure
- ARIA labels for interactive elements
- Keyboard navigation support
- Color contrast compliance
- Focus indicators

## Performance Metrics

- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3.5s
- **Lighthouse Score**: 90+

## Troubleshooting

### Images Not Loading
- Ensure backend API URL is correct
- Check CORS configuration
- Verify static assets are deployed

### Authentication Issues
- Clear cookies and try again
- Check if backend is running
- Verify `VITE_API_URL` is set

### Build Errors
- Clear `node_modules` and reinstall
- Check Node.js version (v18+)
- Ensure all dependencies are installed

## Contributing

1. Follow React best practices
2. Use functional components with hooks
3. Maintain responsive design
4. Add comments for complex logic
5. Update documentation

## License

MIT License

