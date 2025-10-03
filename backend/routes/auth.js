import express from 'express';
import passport from 'passport';
import auth from '../middleware/auth.js';
import authController from '../controllers/authController.js';

const router = express.Router();

// Auth routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', auth, authController.logout);
router.get('/me', auth, authController.getCurrentUser);
router.put('/profile', auth, authController.updateProfile);

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', { session: false }), authController.googleCallback);

export default router;
