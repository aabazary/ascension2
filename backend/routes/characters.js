import express from 'express';
import auth from '../middleware/auth.js';
import characterController from '../controllers/characterController.js';

const router = express.Router();

// Character routes
router.get('/', auth, characterController.getCharacters);
router.get('/:id', auth, characterController.getCharacter);
router.post('/', auth, characterController.createCharacter);
router.put('/:id', auth, characterController.updateCharacter);
router.delete('/:id', auth, characterController.deleteCharacter);

export default router;
