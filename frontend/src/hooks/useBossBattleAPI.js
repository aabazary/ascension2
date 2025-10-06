import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { battleConfigCache, isCacheValid } from '../utils/cacheUtils';
import { handleLogout, handleProfileUpdated, fetchUserData } from '../utils/authUtils';

export const useBossBattleAPI = (character, navigate, setBattleConfig, setUserData, isLoading) => {
  const [userData, setUserDataLocal] = useState(null);
  const location = useLocation();

  // Check if cache is valid
  const cacheValid = useMemo(() => isCacheValid(battleConfigCache), []);

  // Fetch battle config and user data
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
    
    if (location.state?.userData) {
      setUserDataLocal(location.state.userData);
      setUserData(location.state.userData);
    }
  }, [character, isLoading, navigate, cacheValid, location.state, setUserData, setBattleConfig]);

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

  const logoutHandler = () => handleLogout(navigate, () => {
    battleConfigCache.data = null;
    battleConfigCache.timestamp = 0;
  });

  const profileUpdatedHandler = (updatedUserData) => {
    setUserDataLocal(updatedUserData);
    handleProfileUpdated(updatedUserData, setUserData);
  };

  const initBattle = async (character, selectedTier, isBossBattle = true) => {
    try {
      const response = await api.post('/battle/init', {
        characterId: character._id,
        tier: selectedTier,
        isBossBattle
      });
      return response.data;
    } catch (error) {
      console.error('Failed to initialize boss battle:', error);
      throw error;
    }
  };

  const submitBattleResult = async (characterId, tier, battleResult) => {
    try {
      const response = await api.post('/battle/boss/start', {
        characterId,
        tier,
        battleResult
      });
      
      if (response.data.success) {
        return response.data;
      } else {
        throw new Error(response.data.message || 'Battle submission failed');
      }
    } catch (error) {
      console.error('Boss battle submission error:', error);
      throw error;
    }
  };

  return {
    fetchBattleConfig,
    handleLogout: logoutHandler,
    handleProfileUpdated: profileUpdatedHandler,
    initBattle,
    submitBattleResult,
    userData
  };
};
