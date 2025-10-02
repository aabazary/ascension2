import Character from '../models/Character.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get leaderboard by total wins
const getLeaderboard = asyncHandler(async (req, res) => {
  const { limit = 10 } = req.query;
  
  // Get characters with highest wins, populate user info
  const characters = await Character.find({})
    .populate('userId', 'username')
    .sort({ 'stats.wins': -1 })
    .limit(parseInt(limit))
    .select('name currentTier stats.wins userId');

  // Transform data for frontend
  const leaderboard = characters.map(char => ({
    username: char.userId?.username || 'Unknown',
    characterName: char.name,
    totalWins: char.stats?.wins || 0,
    currentTier: char.currentTier
  }));

  res.json({
    success: true,
    leaderboard,
    count: leaderboard.length
  });
});

// Get leaderboard by character tier
const getTierLeaderboard = asyncHandler(async (req, res) => {
  const { tier = 0, limit = 10 } = req.query;
  
  // Get characters at specific tier with highest wins
  const characters = await Character.find({ currentTier: parseInt(tier) })
    .populate('userId', 'username')
    .sort({ 'stats.wins': -1 })
    .limit(parseInt(limit))
    .select('name currentTier stats.wins userId');

  const leaderboard = characters.map(char => ({
    username: char.userId?.username || 'Unknown',
    characterName: char.name,
    totalWins: char.stats?.wins || 0,
    currentTier: char.currentTier
  }));

  res.json({
    success: true,
    leaderboard,
    tier: parseInt(tier),
    count: leaderboard.length
  });
});

export default {
  getLeaderboard,
  getTierLeaderboard
};
