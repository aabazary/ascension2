import Character from '../models/Character.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { getUpgradeInfo, performUpgrade, checkTierUnlock } from '../services/upgradeService.js';
import { UPGRADE_CONFIG } from '../utils/upgradeConfig.js';

const validateEquipmentType = (equipmentType) => {
  return UPGRADE_CONFIG.validEquipmentTypes.includes(equipmentType);
};

const findCharacter = async (characterId, userId) => {
  const character = await Character.findOne({ 
    _id: characterId, 
    userId 
  });
  
  if (!character) {
    throw new Error('Character not found');
  }
  
  return character;
};

const getEquipmentUpgradeInfo = asyncHandler(async (req, res) => {
  const { characterId, equipmentType } = req.params;
  
  if (!characterId || !equipmentType) {
    return res.status(400).json({
      success: false,
      message: 'Character ID and equipment type are required'
    });
  }
  
  if (!validateEquipmentType(equipmentType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid equipment type. Must be ring, cloak, or belt'
    });
  }
  
  try {
    const character = await findCharacter(characterId, req.user.userId);
    const upgradeInfo = getUpgradeInfo(character, equipmentType);
    
    res.json({
      success: true,
      upgradeInfo
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

const upgradeEquipment = asyncHandler(async (req, res) => {
  const { characterId, equipmentType } = req.body;
  
  if (!characterId || !equipmentType) {
    return res.status(400).json({
      success: false,
      message: 'Character ID and equipment type are required'
    });
  }
  
  if (!validateEquipmentType(equipmentType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid equipment type. Must be ring, cloak, or belt'
    });
  }
  
  try {
    const character = await findCharacter(characterId, req.user.userId);
    const upgradeResult = await performUpgrade(character, equipmentType);
    const tierCheck = await checkTierUnlock(character);
    
    // Use the character's toJSON method to get properly formatted data
    const characterData = character.toJSON();

    res.json({
      success: true,
      upgrade: upgradeResult,
      tierUnlock: tierCheck,
      character: characterData
    });
  } catch (error) {
    const statusCode = error.message === 'Character not found' ? 404 : 400;
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
});

const getCharacterUpgradeStatus = asyncHandler(async (req, res) => {
  const { characterId } = req.params;
  
  if (!characterId) {
    return res.status(400).json({
      success: false,
      message: 'Character ID is required'
    });
  }
  
  try {
    const character = await findCharacter(characterId, req.user.userId);
    
    const upgradeStatus = {
      ring: getUpgradeInfo(character, 'ring'),
      cloak: getUpgradeInfo(character, 'cloak'),
      belt: getUpgradeInfo(character, 'belt')
    };
    
    const tierInfo = checkTierUnlock(character);
    
    // Use the character's toJSON method to get properly formatted data
    const characterData = character.toJSON();
    
    res.json({
      success: true,
      character: characterData,
      upgradeStatus,
      tierInfo
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: error.message
    });
  }
});

export default {
  getEquipmentUpgradeInfo,
  upgradeEquipment,
  getCharacterUpgradeStatus
};
