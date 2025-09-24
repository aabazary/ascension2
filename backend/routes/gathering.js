import express from 'express';
import auth from '../middleware/auth.js';
import gatheringController from '../controllers/gatheringController.js';

const router = express.Router();

// Gathering routes
router.post('/perform', auth, gatheringController.performGathering);
router.get('/config', gatheringController.getGatheringConfig);

export default router;
