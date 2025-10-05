import { useEffect, useMemo } from 'react';
import api from '../utils/api';

// Cache for battle config
const battleConfigCache = {
  data: null,
  timestamp: 0,
  ttl: 10 * 60 * 1000 // 10 minutes cache
};

export const useBattleAPI = (character, navigate, setBattleConfig, setUserData) => {
  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    return battleConfigCache.data && 
           (Date.now() - battleConfigCache.timestamp) < battleConfigCache.ttl;
  }, []);

  // Fetch battle config
  useEffect(() => {
    if (!character) {
      navigate('/dashboard');
      return;
    }
    
    // Use cached data if available and valid
    if (isCacheValid) {
      setBattleConfig(battleConfigCache.data);
    } else {
      fetchBattleConfig();
    }
    
    fetchUserData();
  }, [character, navigate, isCacheValid]);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      navigate('/');
    }
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('user');
      // Clear battle config cache
      battleConfigCache.data = null;
      battleConfigCache.timestamp = 0;
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('user');
      // Clear battle config cache
      battleConfigCache.data = null;
      battleConfigCache.timestamp = 0;
      navigate('/');
    }
  };

  const handleProfileUpdated = (updatedUserData) => {
    setUserData(updatedUserData);
  };

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
    fetchUserData,
    handleLogout,
    handleProfileUpdated,
    fetchBattleConfig,
    initBattle,
    submitBattleResult
  };
};
