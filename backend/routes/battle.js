import express from 'express';
import auth from '../middleware/auth.js';
import battleController from '../controllers/battleController.js';

const router = express.Router();

router.post('/minion/start', auth, battleController.startMinionBattle);
router.post('/boss/start', auth, battleController.startBossBattle);
router.post('/turn', auth, battleController.performBattleTurn);
router.get('/config', battleController.getBattleConfig);

export default router;
