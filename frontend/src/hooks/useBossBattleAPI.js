import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';

// Cache for battle config
const battleConfigCache = {
  data: null,
  timestamp: 0,
  ttl: 10 * 60 * 1000 // 10 minutes cache
};

export const useBossBattleAPI = (character, navigate, setBattleConfig, setUserData) => {
  const [userData, setUserDataLocal] = useState(null);
  const location = useLocation();

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    return battleConfigCache.data && 
           (Date.now() - battleConfigCache.timestamp) < battleConfigCache.ttl;
  }, []);

  // Fetch battle config and user data
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
    
    if (location.state?.userData) {
      setUserDataLocal(location.state.userData);
      setUserData(location.state.userData);
    }
  }, [character, navigate, isCacheValid, location.state, setUserData, setBattleConfig]);

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
    setUserDataLocal(updatedUserData);
    setUserData(updatedUserData);
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
    fetchUserData,
    handleLogout,
    handleProfileUpdated,
    fetchBattleConfig,
    initBattle,
    submitBattleResult,
    userData
  };
};
