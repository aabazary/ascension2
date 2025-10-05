import { useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { updateCharacterCache, updateCharacterCacheFull } from '../utils/cacheUtils';
import { useCharacter } from '../contexts/CharacterContext';

export const useUpgrade = (character) => {
  const { updateCharacter } = useCharacter();
  const [upgradeStatus, setUpgradeStatus] = useState(null);
  const [selectedGear, setSelectedGear] = useState(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);

  const refreshUpgradeStatus = useCallback(async () => {
    if (!character?._id) return;

    // Debounce: prevent calls within 1 second of each other
    const now = Date.now();
    if (now - lastRefreshTime < 1000) {
      return;
    }
    setLastRefreshTime(now);

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.get(`/upgrade/character/${character._id}/status`);
      
      if (response.data.success) {
        setUpgradeStatus(response.data.upgradeStatus);
        
        // Update character cache with fresh data
        const updatedCharacter = response.data.character;
        updateCharacterCacheFull(updatedCharacter);
        
        // Update character context if available
        if (updateCharacter) {
          updateCharacter(updatedCharacter);
        }
      }
    } catch (err) {
      console.error('Failed to fetch upgrade status:', err);
      if (err.response?.status === 429) {
        setError('Too many requests. Please wait a moment and try again.');
      } else {
        setError(err.response?.data?.message || 'Failed to load upgrade information');
      }
    } finally {
      setLoading(false);
    }
  }, [character?._id, lastRefreshTime]);

  const getGearUpgradeInfo = async (equipmentType) => {
    if (!character?._id) return null;

    try {
      const response = await api.get(`/upgrade/character/${character._id}/equipment/${equipmentType}`);
      
      if (response.data.success) {
        return response.data.upgradeInfo;
      }
    } catch (err) {
      console.error(`Failed to fetch upgrade info for ${equipmentType}:`, err);
      setError(err.response?.data?.message || `Failed to load ${equipmentType} upgrade information`);
    }
    
    return null;
  };

  const selectGear = async (equipmentType) => {
    try {
      setLoading(true);
      setError(null);
      
      const upgradeInfo = await getGearUpgradeInfo(equipmentType);
      
      if (upgradeInfo) {
        setSelectedGear({
          type: equipmentType,
          ...upgradeInfo
        });
        setIsUpgradeModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to select gear:', err);
      setError(err.response?.data?.message || 'Failed to load gear information');
    } finally {
      setLoading(false);
    }
  };

  const performUpgrade = async (equipmentType) => {
    if (!character?._id) return;

    try {
      setLoading(true);
      setError(null);
      
      const response = await api.post('/upgrade/equipment', {
        characterId: character._id,
        equipmentType
      });
      
      if (response.data.success) {
        const { upgrade, tierUnlock, character } = response.data;
        
        // Update character cache with the updated character data
        if (character) {
          updateCharacterCacheFull(character);
          
          // Update character context if available
          if (updateCharacter) {
            updateCharacter(character);
          }
        }
        
        // Refresh upgrade status to get updated upgrade info
        await refreshUpgradeStatus();
        
        // Close modal
        setIsUpgradeModalOpen(false);
        setSelectedGear(null);
        
        // Show success message (you could add a toast notification here)
        console.log('Upgrade successful:', upgrade.message);
        
        if (tierUnlock?.tierUnlocked) {
          console.log('Tier unlocked:', tierUnlock.message);
        }
        
        return { success: true, upgrade, tierUnlock };
      }
    } catch (err) {
      console.error('Failed to perform upgrade:', err);
      setError(err.response?.data?.message || 'Failed to upgrade equipment');
      return { success: false, error: err.response?.data?.message || 'Upgrade failed' };
    } finally {
      setLoading(false);
    }
  };

  const closeUpgradeModal = () => {
    setIsUpgradeModalOpen(false);
    setSelectedGear(null);
    setError(null);
  };

  return {
    upgradeStatus,
    selectedGear,
    isUpgradeModalOpen,
    loading,
    error,
    selectGear,
    closeUpgradeModal,
    performUpgrade,
    refreshUpgradeStatus
  };
};
