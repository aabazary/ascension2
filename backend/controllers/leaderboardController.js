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

// Get top gatherers (most gathering sessions)
const getTopGatherers = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const characters = await Character.find({})
    .populate('userId', 'username')
    .sort({ 'stats.totalGathers': -1 })
    .limit(parseInt(limit))
    .select('name currentTier stats.totalGathers userId');

  const leaderboard = characters.map(char => ({
    username: char.userId?.username || 'Unknown',
    characterName: char.name,
    totalGathers: char.stats?.totalGathers || 0,
    currentTier: char.currentTier
  }));

  res.json({
    success: true,
    leaderboard,
    count: leaderboard.length
  });
});

// Get top boss killers (most boss battles)
const getTopBossKillers = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const characters = await Character.find({})
    .populate('userId', 'username')
    .sort({ 'stats.totalBosses': -1 })
    .limit(parseInt(limit))
    .select('name currentTier stats.totalBosses userId');

  const leaderboard = characters.map(char => ({
    username: char.userId?.username || 'Unknown',
    characterName: char.name,
    totalBosses: char.stats?.totalBosses || 0,
    currentTier: char.currentTier
  }));

  res.json({
    success: true,
    leaderboard,
    count: leaderboard.length
  });
});

// Get top minion destroyers (most minion battles)
const getTopMinionDestroyers = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  
  const characters = await Character.find({})
    .populate('userId', 'username')
    .sort({ 'stats.totalBattles': -1 })
    .limit(parseInt(limit))
    .select('name currentTier stats.totalBattles stats.totalBosses userId');

  // Calculate minion battles (total battles - boss battles)
  const leaderboard = characters.map(char => {
    const totalBattles = char.stats?.totalBattles || 0;
    const totalBosses = char.stats?.totalBosses || 0;
    const minionBattles = Math.max(0, totalBattles - totalBosses);
    
    return {
      username: char.userId?.username || 'Unknown',
      characterName: char.name,
      totalMinionBattles: minionBattles,
      currentTier: char.currentTier
    };
  }).sort((a, b) => b.totalMinionBattles - a.totalMinionBattles);

  res.json({
    success: true,
    leaderboard: leaderboard.slice(0, parseInt(limit)),
    count: leaderboard.length
  });
});

// Get top Master duelists (Tier 6 Master boss kills)
const getTopMasterDuelists = asyncHandler(async (req, res) => {
  const { limit = 5 } = req.query;
  
  // Get all characters with Master kills, sorted by masterKills
  const characters = await Character.find({ 'stats.masterKills': { $gt: 0 } })
    .populate('userId', 'username')
    .sort({ 'stats.masterKills': -1 })
    .limit(parseInt(limit))
    .select('name currentTier stats.masterKills userId');

  const leaderboard = characters.map(char => ({
    username: char.userId?.username || 'Unknown',
    characterName: char.name,
    masterKills: char.stats?.masterKills || 0,
    currentTier: char.currentTier
  }));

  res.json({
    success: true,
    leaderboard,
    count: leaderboard.length
  });
});

export default {
  getLeaderboard,
  getTierLeaderboard,
  getTopGatherers,
  getTopBossKillers,
  getTopMinionDestroyers,
  getTopMasterDuelists
};
