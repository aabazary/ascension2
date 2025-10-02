import express from 'express';
import leaderboardController from '../controllers/leaderboardController.js';

const router = express.Router();

// Leaderboard routes
router.get('/', leaderboardController.getLeaderboard);
router.get('/tier/:tier', leaderboardController.getTierLeaderboard);

export default router;
