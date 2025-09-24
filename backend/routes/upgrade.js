import express from 'express';
import auth from '../middleware/auth.js';
import upgradeController from '../controllers/upgradeController.js';

const router = express.Router();

router.get('/info/:characterId/:equipmentType', auth, upgradeController.getEquipmentUpgradeInfo);
router.post('/perform', auth, upgradeController.upgradeEquipment);
router.get('/status/:characterId', auth, upgradeController.getCharacterUpgradeStatus);

export default router;
