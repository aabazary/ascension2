import express from 'express';
import passwordResetController from '../controllers/passwordResetController.js';

const router = express.Router();

router.post('/request', passwordResetController.requestPasswordReset);
router.post('/reset', passwordResetController.resetPassword);
router.get('/validate/:token', passwordResetController.validateResetToken);

export default router;
