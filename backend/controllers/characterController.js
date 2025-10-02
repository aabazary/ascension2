import Character from '../models/Character.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Get all characters for user
const getCharacters = asyncHandler(async (req, res) => {
  const characters = await Character.find({ userId: req.user.userId });
  
  res.json({
    success: true,
    count: characters.length,
    characters
  });
});

// Get single character
const getCharacter = asyncHandler(async (req, res) => {
  const character = await Character.findOne({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found'
    });
  }

  res.json({
    success: true,
    character
  });
});

// Create new character
const createCharacter = asyncHandler(async (req, res) => {
  const { name, avatar } = req.body;

  // Validation
  if (!name || name.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Character name is required'
    });
  }

  if (name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Character name must be at least 2 characters long'
    });
  }

  if (name.trim().length > 20) {
    return res.status(400).json({
      success: false,
      message: 'Character name must be 20 characters or less'
    });
  }

  // Validate avatar
  const validAvatars = ['earth', 'fire', 'water', 'lightning', 'ice', 'shadow'];
  if (!avatar || !validAvatars.includes(avatar)) {
    return res.status(400).json({
      success: false,
      message: 'Valid avatar is required'
    });
  }

  // Check character limit (max 3)
  const existingCharacters = await Character.countDocuments({ userId: req.user.userId });
  if (existingCharacters >= 3) {
    return res.status(400).json({
      success: false,
      message: 'Maximum of 3 characters allowed'
    });
  }

  // Check if name is already taken by this user
  const existingCharacter = await Character.findOne({
    userId: req.user.userId,
    name: name.trim()
  });

  if (existingCharacter) {
    return res.status(400).json({
      success: false,
      message: 'Character name already taken'
    });
  }

  const character = new Character({
    userId: req.user.userId,
    name: name.trim(),
    avatar: avatar
  });

  await character.save();

  // Add character to user's characters array
  await User.findByIdAndUpdate(
    req.user.userId,
    { $push: { characters: character._id } }
  );

  res.status(201).json({
    success: true,
    message: 'Character created successfully',
    character
  });
});

// Update character
const updateCharacter = asyncHandler(async (req, res) => {
  const { name } = req.body;

  const character = await Character.findOne({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found'
    });
  }

  if (name && name.trim().length > 0) {
    // Validation
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Character name must be at least 2 characters long'
      });
    }

    if (name.trim().length > 20) {
      return res.status(400).json({
        success: false,
        message: 'Character name must be 20 characters or less'
      });
    }

    // Check if new name is already taken
    const existingCharacter = await Character.findOne({
      userId: req.user.userId,
      name: name.trim(),
      _id: { $ne: req.params.id }
    });

    if (existingCharacter) {
      return res.status(400).json({
        success: false,
        message: 'Character name already taken'
      });
    }

    character.name = name.trim();
  }

  await character.save();

  res.json({
    success: true,
    message: 'Character updated successfully',
    character
  });
});

// Delete character
const deleteCharacter = asyncHandler(async (req, res) => {
  const character = await Character.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!character) {
    return res.status(404).json({
      success: false,
      message: 'Character not found'
    });
  }

  // Remove character from user's characters array
  await User.findByIdAndUpdate(
    req.user.userId,
    { $pull: { characters: req.params.id } }
  );

  res.json({
    success: true,
    message: 'Character deleted successfully'
  });
});

export default {
  getCharacters,
  getCharacter,
  createCharacter,
  updateCharacter,
  deleteCharacter
};
