import { useState, useEffect, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCharacter } from '../contexts/CharacterContext';

// Cache for gathering config
const gatheringConfigCache = {
  data: null,
  timestamp: 0,
  ttl: 10 * 60 * 1000 // 10 minutes cache
};

export const useGathering = () => {
  const navigate = useNavigate();
  const { selectedCharacter, updateCharacter, isLoading } = useCharacter();
  
  const character = selectedCharacter;
  
  const [userData, setUserData] = useState(null);
  const [selectedTier, setSelectedTier] = useState(Math.min(character?.currentTier || 0, 5));
  const [isPlaying, setIsPlaying] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [gatheringConfig, setGatheringConfig] = useState(null);
  
  const buttonClicks = useRef([]);
  const startTime = useRef(0);
  const currentRound = useRef(0);
  const windowTimeout = useRef(null);
  const currentButtonClicked = useRef(false);
  const successCountRef = useRef(0);
  const missCountRef = useRef(0);

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    return gatheringConfigCache.data && 
           (Date.now() - gatheringConfigCache.timestamp) < gatheringConfigCache.ttl;
  }, []);

  useEffect(() => {
    if (!isLoading && !character) {
      navigate('/dashboard');
      return;
    }
    
    if (!character) return; // Wait for character to load
    
    // Use cached data if available and valid
    if (isCacheValid) {
      setGatheringConfig(gatheringConfigCache.data);
    } else {
      fetchGatheringConfig();
    }
    
    fetchUserData();
  }, [character, isLoading, navigate, isCacheValid]);
  

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
      // Clear gathering config cache
      gatheringConfigCache.data = null;
      gatheringConfigCache.timestamp = 0;
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('user');
      // Clear gathering config cache
      gatheringConfigCache.data = null;
      gatheringConfigCache.timestamp = 0;
      navigate('/');
    }
  };

  const handleProfileUpdated = (updatedUserData) => {
    setUserData(updatedUserData);
  };

  const fetchGatheringConfig = async () => {
    try {
      const response = await api.get('/gathering/config');
      if (response.data.success) {
        const configData = response.data.config;
        setGatheringConfig(configData);
        
        // Update cache
        gatheringConfigCache.data = configData;
        gatheringConfigCache.timestamp = Date.now();
      }
    } catch (error) {
      console.error('Failed to fetch gathering config:', error);
      // Use cached data if available, even if expired
      if (gatheringConfigCache.data) {
        setGatheringConfig(gatheringConfigCache.data);
      }
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameEnded(false);
    setSuccessCount(0);
    setMissCount(0);
    setFeedback(null);
    buttonClicks.current = [];
    startTime.current = Date.now();
    currentRound.current = 0;
    successCountRef.current = 0;
    missCountRef.current = 0;
    
    // Start first round
    setTimeout(() => showNextButton(), 1000);
  };

  const showNextButton = () => {
    if (!gatheringConfig) return;
    
    const config = gatheringConfig.tiers[selectedTier];
    const totalButtons = config.totalButtons;
    const requiredSuccess = Math.ceil(totalButtons * config.successThreshold);
    
    // Check if all rounds are complete
    if (currentRound.current >= totalButtons) {
      endGame();
      return;
    }
    
    // Check if player has succeeded (reached required success count) - end immediately
    if (successCountRef.current >= requiredSuccess) {
      // Fill remaining rounds with placeholder (not clicked) to meet expected button count
      while (buttonClicks.current.length < totalButtons) {
        buttonClicks.current.push({ clicked: false });
      }
      endGame();
      return;
    }
    
    // Check if player has failed (3 misses) - end immediately
    if (missCountRef.current >= 3) {
      // Fill remaining rounds with misses to meet expected button count
      while (buttonClicks.current.length < totalButtons) {
        buttonClicks.current.push({ clicked: false });
      }
      endGame();
      return;
    }
    
    // Show the clickable window
    setShaking(true);
    setClickable(true);
    currentButtonClicked.current = false; // Reset for this round
    
    // Close window after duration
    windowTimeout.current = setTimeout(() => {
      if (!currentButtonClicked.current) {
        // Window closed without click = miss
        handleMiss();
      }
      setClickable(false);
      setShaking(false);
      currentRound.current++;
      
      // Show next button after delay
      setTimeout(() => showNextButton(), 1000);
    }, config.buttonWindow);
  };

  const handleEggClick = () => {
    if (!isPlaying) {
      return;
    }
    
    if (!clickable) {
      // Clicking outside the active window = penalty miss (but doesn't count as a round)
      const newMissCount = missCountRef.current + 1;
      missCountRef.current = newMissCount;
      setMissCount(newMissCount);
      setFeedback('miss');
      setTimeout(() => setFeedback(null), 500);
      
      // Check if player failed due to spam clicking
      if (newMissCount >= 3) {
        const config = gatheringConfig.tiers[selectedTier];
        // Fill remaining rounds to meet expected button count
        while (buttonClicks.current.length < config.totalButtons) {
          buttonClicks.current.push({ clicked: false });
        }
        // End game after showing feedback
        setTimeout(() => endGame(), 600);
      }
      return;
    }

    // Success!
    currentButtonClicked.current = true; // Mark as clicked
    const clickTime = Date.now() - startTime.current;
    buttonClicks.current.push({ clicked: true, clickTime });
    
    const newSuccessCount = successCountRef.current + 1;
    successCountRef.current = newSuccessCount;
    setSuccessCount(newSuccessCount);
    setClickable(false);
    setShaking(false);
    setFeedback('success');
    setTimeout(() => setFeedback(null), 500);
    
    // Clear the window timeout since they clicked
    if (windowTimeout.current) {
      clearTimeout(windowTimeout.current);
    }
    
    currentRound.current++;
    
    // Check if we've reached required success immediately (don't wait for state update)
    const config = gatheringConfig.tiers[selectedTier];
    const requiredSuccess = Math.ceil(config.totalButtons * config.successThreshold);
    
    if (newSuccessCount >= requiredSuccess) {
      // Fill remaining rounds to meet expected button count
      while (buttonClicks.current.length < config.totalButtons) {
        buttonClicks.current.push({ clicked: false });
      }
      // End game after showing feedback
      setTimeout(() => endGame(), 600);
    } else {
      // Show next button after delay
      setTimeout(() => showNextButton(), 1000);
    }
  };

  const handleMiss = () => {
    const newMissCount = missCountRef.current + 1;
    missCountRef.current = newMissCount;
    setMissCount(newMissCount);
    setFeedback('miss');
    setTimeout(() => setFeedback(null), 500);
    
    // Check if player failed
    if (newMissCount >= 3) {
      const config = gatheringConfig.tiers[selectedTier];
      // Fill remaining rounds to meet expected button count
      while (buttonClicks.current.length < config.totalButtons) {
        buttonClicks.current.push({ clicked: false });
      }
      // End game after showing feedback
      setTimeout(() => endGame(), 600);
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    setGameEnded(true);
    setClickable(false);
    setShaking(false);
    
    // Clear any pending timeouts
    if (windowTimeout.current) {
      clearTimeout(windowTimeout.current);
    }
    
    const config = gatheringConfig.tiers[selectedTier];
    const requiredSuccess = Math.ceil(config.totalButtons * config.successThreshold);
    const success = successCountRef.current >= requiredSuccess;
    const timeSpent = Date.now() - startTime.current;
    
    try {
      const response = await api.post('/gathering/perform', {
        characterId: character._id,
        tier: selectedTier,
        gatheringAttempt: {
          success,
          buttonClicks: buttonClicks.current,
          successCount: successCountRef.current,
          missCount: missCountRef.current,
          totalButtons: config.totalButtons,
          requiredSuccess,
          timeSpent
        }
      });
      
      setGameResult(response.data);
      
      // Update character context with new resources if successful
      if (response.data.success && response.data.character) {
        // Transform resources from array format to object format (like the Character model's toJSON method)
        const transformResources = (resourcesArray) => {
          const resourcesObj = {
            gathering: {},
            minion: {},
            boss: {}
          };
          
          if (resourcesArray && Array.isArray(resourcesArray)) {
            resourcesArray.forEach(resource => {
              if (resourcesObj[resource.type]) {
                resourcesObj[resource.type][resource.tier] = resource.count;
              }
            });
          }
          
          return resourcesObj;
        };
        
        // The backend returns partial character data (stats and resources in array format)
        // We need to merge it with the existing character data and transform resources
        const updatedCharacter = {
          ...character,
          stats: response.data.character.stats,
          resources: transformResources(response.data.character.resources)
        };
        
        updateCharacter(updatedCharacter);
      }
    } catch (error) {
      console.error('Failed to submit gathering result:', error);
      setGameResult({
        success,
        resourcesGained: 0,
        message: success ? 'Gathering successful but failed to save!' : 'Not enough successful clicks'
      });
    }
  };

  const resetGame = () => {
    setIsPlaying(false);
    setGameEnded(false);
    setGameResult(null);
    setSuccessCount(0);
    setMissCount(0);
    setFeedback(null);
    setClickable(false);
    setShaking(false);
    buttonClicks.current = [];
    currentRound.current = 0;
    successCountRef.current = 0;
    missCountRef.current = 0;
    
    // Clear any pending timeouts
    if (windowTimeout.current) {
      clearTimeout(windowTimeout.current);
    }
  };

  return {
    // State
    character,
    isLoading,
    userData,
    selectedTier,
    isPlaying,
    shaking,
    clickable,
    successCount,
    missCount,
    feedback,
    gameEnded,
    gameResult,
    gatheringConfig,
    
    // Actions
    setSelectedTier,
    startGame,
    handleEggClick,
    resetGame,
    handleLogout,
    handleProfileUpdated
  };
};
