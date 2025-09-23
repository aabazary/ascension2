import express from 'express';
import auth from '../middleware/auth.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getCurrentUser);

export default router;
