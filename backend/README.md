# Ascension Backend API

Backend API server for Ascension - The Elemental Trial game.

## Tech Stack

- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with httpOnly cookies
- **OAuth**: Passport.js with Google OAuth 2.0
- **Email**: Nodemailer for password reset
- **Testing**: Jest with Supertest
- **Deployment**: Vercel Serverless Functions

## Project Structure

```
backend/
├── config/
│   └── passport.js          # Passport OAuth configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── battleController.js  # Battle mechanics
│   ├── characterController.js
│   ├── gatheringController.js
│   ├── leaderboardController.js
│   ├── passwordResetController.js
│   └── upgradeController.js
├── middleware/
│   ├── auth.js             # JWT authentication middleware
│   └── errorHandler.js     # Global error handling
├── models/
│   ├── ActivityLog.js      # User activity tracking
│   ├── Character.js        # Character schema
│   ├── PasswordReset.js    # Password reset tokens
│   └── User.js            # User schema
├── routes/
│   ├── auth.js            # Authentication routes
│   ├── battle.js          # Battle routes
│   ├── characters.js      # Character CRUD routes
│   ├── gathering.js       # Gathering routes
│   ├── leaderboard.js     # Leaderboard routes
│   ├── passwordReset.js   # Password reset routes
│   └── upgrade.js         # Equipment upgrade routes
├── services/
│   ├── gatheringService.js
│   └── upgradeService.js
├── tests/
│   └── *.test.js          # Test files
├── utils/
│   ├── battleCalculations.js
│   ├── battleConfig.js
│   ├── emailService.js
│   ├── gatheringCalculations.js
│   ├── gatheringConfig.js
│   ├── gatheringValidation.js
│   └── upgradeConfig.js
├── server.js              # Main server file
└── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Google Cloud Console project (for OAuth)

### Installation

1. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the backend directory:
   ```env
   # Server
   NODE_ENV=development
   PORT=5000
   
   # Database
   MONGODB_URI=mongodb://localhost:27017/ascension2
   
   # JWT Secrets (generate strong random strings)
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_REFRESH_SECRET=your_super_secret_refresh_key_here
   SESSION_SECRET=your_session_secret_here
   
   # Frontend URL (for CORS and OAuth redirects)
   FRONTEND_URL=http://localhost:5173
   BACKEND_URL=http://localhost:5000
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # Email Service (optional - for password reset)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_SECURE=false
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   EMAIL_FROM=noreply@ascension.game
   ```

3. **Start the server**
   ```bash
   npm run dev      # Development with nodemon
   npm start        # Production
   ```

4. **Seed the database** (optional)
   ```bash
   npm run seed
   ```

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| POST | `/api/auth/refresh` | Refresh access token | No (uses refresh token) |
| GET | `/api/auth/me` | Get current user | Yes |
| GET | `/api/auth/google` | Google OAuth login | No |
| GET | `/api/auth/google/callback` | Google OAuth callback | No |

### Characters

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/characters` | Get user's characters | Yes |
| GET | `/api/characters/:id` | Get specific character | Yes |
| POST | `/api/characters` | Create new character | Yes |
| PUT | `/api/characters/:id` | Update character | Yes |
| DELETE | `/api/characters/:id` | Delete character | Yes |

### Gathering

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/gathering` | Perform gathering action | Yes |
| GET | `/api/gathering/config` | Get gathering configuration | Yes |

### Battle

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/battle/config` | Get battle configuration | Yes |
| POST | `/api/battle/init` | Initialize battle | Yes |
| POST | `/api/battle/minion` | Fight minion battle | Yes |
| POST | `/api/battle/boss` | Fight boss battle | Yes |

### Upgrades

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/upgrade/:characterId` | Upgrade equipment | Yes |
| GET | `/api/upgrade/:characterId/status` | Get upgrade status | Yes |

### Leaderboard

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/leaderboard` | Get top players by wins | No |
| GET | `/api/leaderboard/tier` | Get players by tier | No |
| GET | `/api/leaderboard/gatherers` | Get top gatherers | No |

### Password Reset

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/password-reset/request` | Request password reset | No |
| POST | `/api/password-reset/reset` | Reset password | No |

## Database Models

### User
```javascript
{
  username: String (unique),
  email: String (unique),
  password: String (hashed),
  googleId: String,
  profilePicture: String,
  refreshTokens: [{ token, expiresAt }],
  lastLogin: Date,
  createdAt: Date
}
```

### Character
```javascript
{
  userId: ObjectId (ref: User),
  name: String,
  avatar: String,
  currentTier: Number (0-6),
  stats: {
    wins: Number,
    losses: Number,
    totalGathering: Number
  },
  equipment: {
    ring: { tier: Number },
    cloak: { tier: Number },
    belt: { tier: Number }
  },
  resources: {
    gathering: { [tier]: Number },
    minion: { [tier]: Number },
    boss: { [tier]: Number }
  },
  defeatedBosses: [Number],
  createdAt: Date,
  lastActive: Date
}
```

## Game Mechanics

### Equipment Upgrade Requirements

Each equipment piece requires specific resources to upgrade:

**Ring** (Improves all activities):
- Tier 0→1: 50 gathering + 25 minion + 10 boss
- Tier 1→2: 100 gathering + 50 minion + 20 boss
- Tier 2→3: 150 gathering + 75 minion + 30 boss
- Tier 3→4: 200 gathering + 100 minion + 40 boss
- Tier 4→5: 250 gathering + 125 minion + 50 boss
- Tier 5→6: 300 gathering + 150 minion + 60 boss

**Cloak** (Improves gathering):
- Similar progression focused on gathering resources

**Belt** (Improves battles):
- Similar progression focused on battle resources

### Battle Calculations

#### Player Stats
- **Health**: 100 + (ring tier × 20) + (belt tier × 15)
- **Power**: 50 + (ring tier × 10) + (belt tier × 20)

#### Enemy Stats (per tier)
- **Minion Health**: 50 + (tier × 30)
- **Boss Health**: 100 + (tier × 100)
- **Damage**: Based on tier and type

#### Spell Mechanics
- **Blast**: 20 damage, 10% crit (2x), 20% miss
- **Nova**: 35 damage, 5% crit (2x), 30% miss
- **Bolt**: 15 damage, 15% crit (2x), 15% miss

### Success Rates

#### Gathering
- Base rate modified by cloak tier
- Tier 0: 50% → Tier 6: 99%

#### Minion Battles
- Base rate modified by belt and ring tier
- Tier 0: 20% → Tier 6: 98%

#### Boss Battles
- Base rate modified by ring tier
- Tier 0: 1% → Tier 6: 80%

## Testing

```bash
# Run all tests
npm test

# Run specific test suite
npm run test:auth
npm run test:characters
npm run test:gathering
npm run test:upgrade
npm run test:battle

# Run with coverage
npm run test:coverage
```

## Deployment

This backend is configured for deployment on Vercel.

### Required Environment Variables on Vercel:
- `MONGODB_URI`
- `JWT_SECRET`
- `JWT_REFRESH_SECRET`
- `SESSION_SECRET`
- `FRONTEND_URL`
- `BACKEND_URL`
- `GOOGLE_CLIENT_ID` (optional)
- `GOOGLE_CLIENT_SECRET` (optional)

### Vercel Configuration
The `vercel.json` file configures the serverless function deployment.

## Security

- **JWT Tokens**: Short-lived access tokens (15 min) with long-lived refresh tokens (7 days)
- **httpOnly Cookies**: Prevents XSS attacks
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: 1000 requests per 15 minutes per IP
- **CORS**: Configured for specific frontend origins
- **Helmet**: Security headers middleware

## Contributing

1. Follow the existing code structure
2. Write tests for new features
3. Update documentation
4. Follow JavaScript/Node.js best practices

## License

MIT License

