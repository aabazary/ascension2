import express from 'express';
import auth from '../middleware/auth.js';
import battleController from '../controllers/battleController.js';

const router = express.Router();

// Get battle configuration
router.get('/config', battleController.getBattleConfig);

// Start minion battle
router.post('/minion/start', auth, battleController.startMinionBattle);

// Start boss battle (placeholder)
router.post('/boss/start', auth, battleController.startBossBattle);

// Perform battle turn (placeholder)
router.post('/turn', auth, battleController.performBattleTurn);

export default router;