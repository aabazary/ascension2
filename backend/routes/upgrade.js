import express from 'express';
import auth from '../middleware/auth.js';
import upgradeController from '../controllers/upgradeController.js';

const router = express.Router();

router.get('/character/:characterId/equipment/:equipmentType', auth, upgradeController.getEquipmentUpgradeInfo);
router.post('/equipment', auth, upgradeController.upgradeEquipment);
router.get('/character/:characterId/status', auth, upgradeController.getCharacterUpgradeStatus);

export default router;
