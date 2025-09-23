# Ascension - The Elemental Trial

A progression-based RPG game built with MERN stack, where you are a mage plunged into the depths of your own subconscious, undergoing the Trial of Ascension to become the master of all elements.

## Game Concept

You are a mage who has been plunged into the depths of your own subconscious, where you must undergo the **Trial of Ascension** to become the master of all elements. As you battle through your inner psyche, you'll encounter dragons of different elements, each representing a fundamental force of nature. Only after defeating all elemental dragons will you face your ultimate challenge: a shadowy version of your own avatar - your inner master.

**Can you Ascend?**

## Features

- **User Authentication**: JWT-based auth with refresh tokens
- **Character Management**: Up to 3 characters per user with elemental avatars
- **Equipment System**: Ring, cloak, and belt with tier-based upgrades
- **Elemental Dragons**: Battle 7 different elemental dragons (Fire, Water, Earth, Air, Lightning, Ice, Shadow)
- **Avatar System**: Unlock and choose from different elemental avatars
- **Progression**: Tier-based advancement with increasing difficulty
- **Battle System**: 3 spells (Blast, Nova, Bolt) with crit/miss mechanics
- **Final Boss**: Face your shadowy avatar after defeating all elemental dragons

## Tech Stack

- **Backend**: Node.js, Express.js, MongoDB, JWT
- **Frontend**: React.js
- **Mobile**: React Native (planned)
- **Database**: MongoDB with Mongoose

## Project Structure

```
ascension2/
├── backend/          # Express.js API
├── frontend/         # React web app
├── mobile/           # React Native app (planned)
└── shared/           # Shared utilities (planned)
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ascension2
   ```

2. **Install all dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   ```bash
   cd backend
   cp env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/ascension2
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend API on http://localhost:5000
   - Frontend React app on http://localhost:3000

### Manual Setup (Alternative)

If you prefer to set up each part manually:

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Characters
- `GET /api/characters` - Get user's characters
- `GET /api/characters/:id` - Get specific character
- `POST /api/characters` - Create new character
- `PUT /api/characters/:id` - Update character
- `DELETE /api/characters/:id` - Delete character

### Game
- `POST /api/game/battle` - Perform battle (minion/boss)
- `POST /api/game/gather` - Perform gathering
- `POST /api/game/elemental-battle` - Battle elemental dragons
- `PUT /api/game/avatar` - Update character avatar
- `GET /api/game/config` - Get game configuration

## Game Mechanics

### Elemental Dragons
1. **Fire Dragon (Inferno Drake)**: Weak to water, resistant to fire
2. **Water Dragon (Tsunami Serpent)**: Weak to earth, resistant to water
3. **Earth Dragon (Mountain Wyrm)**: Weak to air, resistant to earth
4. **Air Dragon (Storm Phoenix)**: Weak to lightning, resistant to air
5. **Lightning Dragon (Thunder Dragon)**: Weak to ice, resistant to lightning
6. **Ice Dragon (Frost Wyvern)**: Weak to fire, resistant to ice
7. **Shadow Dragon (Void Master)**: Weak to light, resistant to shadow

### Avatar System
- **Default**: Novice Mage - A young mage beginning their journey
- **Fire**: Flame Warden - Master of fire and passion
- **Water**: Tide Caller - Guardian of the deep waters
- **Earth**: Stone Guardian - Protector of the earth's core
- **Air**: Wind Walker - Rider of the eternal winds
- **Lightning**: Storm Lord - Commander of thunder and lightning
- **Ice**: Frost Sage - Keeper of eternal winter
- **Shadow**: Void Master - The ultimate shadow mage

### Equipment Progression
1. **Ring**: Improves all activities
2. **Cloak**: Improves gathering success
3. **Belt**: Improves minion battle success

### Success Rates (Base)
- **Gathering**: 50% → 75% → 90% → 95% → 98% → 99%
- **Minion**: 20% → 50% → 80% → 90% → 95% → 98%
- **Boss**: 1% → 10% → 25% → 40% → 60% → 80%

### Spells
- **Blast**: 20 damage, 10% crit, 20% miss
- **Nova**: 35 damage, 5% crit, 30% miss
- **Bolt**: 15 damage, 15% crit, 15% miss

## Development Roadmap

### Phase 1: Core MVP ✅
- [x] User authentication
- [x] Character management
- [x] Basic battle system
- [x] Equipment system
- [x] Resource management

### Phase 2: Enhanced Features
- [ ] Equipment upgrade system
- [ ] Tier progression
- [ ] Activity logging
- [ ] Success rate calculations

### Phase 3: Mobile Support
- [ ] React Native setup
- [ ] Mobile-optimized UI
- [ ] Offline gameplay support

### Phase 4: Advanced Features
- [ ] Google OAuth
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Testing suite

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

MIT License - see LICENSE file for details