import express from 'express';
import leaderboardController from '../controllers/leaderboardController.js';

const router = express.Router();

// Leaderboard routes
router.get('/', leaderboardController.getLeaderboard);
router.get('/tier/:tier', leaderboardController.getTierLeaderboard);
router.get('/gatherers', leaderboardController.getTopGatherers);
router.get('/boss-killers', leaderboardController.getTopBossKillers);
router.get('/minion-destroyers', leaderboardController.getTopMinionDestroyers);
router.get('/master-duelists', leaderboardController.getTopMasterDuelists);

export default router;
