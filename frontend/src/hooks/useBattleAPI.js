import { useEffect, useMemo } from 'react';
import api from '../utils/api';
import { battleConfigCache, isCacheValid } from '../utils/cacheUtils';
import { handleLogout, handleProfileUpdated, fetchUserData } from '../utils/authUtils';

export const useBattleAPI = (character, navigate, setBattleConfig, setUserData, isLoading) => {
  // Check if cache is valid
  const cacheValid = useMemo(() => isCacheValid(battleConfigCache), []);

  // Fetch battle config
  useEffect(() => {
    if (!isLoading && !character) {
      navigate('/dashboard');
      return;
    }
    
    if (!character) return; // Wait for character to load
    
    // Use cached data if available and valid
    if (cacheValid) {
      setBattleConfig(battleConfigCache.data);
    } else {
      fetchBattleConfig();
    }
    
    fetchUserData(setUserData, navigate);
  }, [character, isLoading, navigate, cacheValid]);

  const fetchBattleConfig = async () => {
    try {
      const response = await api.get('/battle/config');
      if (response.data.success) {
        const configData = response.data.config;
        setBattleConfig(configData);
        
        // Update cache
        battleConfigCache.data = configData;
        battleConfigCache.timestamp = Date.now();
      }
    } catch (error) {
      console.error('Failed to fetch battle config:', error);
      // Use cached data if available, even if expired
      if (battleConfigCache.data) {
        setBattleConfig(battleConfigCache.data);
      }
    }
  };

  const initBattle = async (character, selectedTier, isBossBattle = false) => {
    try {
      const response = await api.post('/battle/init', {
        characterId: character._id,
        tier: selectedTier,
        isBossBattle
      });
      return response.data;
    } catch (error) {
      console.error('Failed to initialize battle:', error);
      throw error;
    }
  };

  const submitBattleResult = async (character, selectedTier, battleResult) => {
    try {
      const response = await api.post('/battle/minion/start', {
        characterId: character._id,
        tier: selectedTier,
        battleResult
      });
      return response.data;
    } catch (error) {
      console.error('Failed to submit battle result:', error);
      return {
        success: true,
        won: battleResult.won,
        resourcesGained: battleResult.won ? 10 : 0
      };
    }
  };

  return {
    fetchBattleConfig,
    handleLogout: () => handleLogout(navigate, () => {
      battleConfigCache.data = null;
      battleConfigCache.timestamp = 0;
    }),
    handleProfileUpdated: (updatedUserData) => handleProfileUpdated(updatedUserData, setUserData),
    initBattle,
    submitBattleResult
  };
};
