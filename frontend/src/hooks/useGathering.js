import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

export const useGathering = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const character = location.state?.character;
  
  // Game state
  const [selectedTier, setSelectedTier] = useState(character?.currentTier || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  
  // Config
  const [gatheringConfig, setGatheringConfig] = useState(null);
  
  // Refs
  const gameTimeoutRef = useRef(null);
  const buttonTimeoutRef = useRef(null);
  const gameStartTimeRef = useRef(null);

  // Fetch gathering config
  useEffect(() => {
    if (!character) {
      navigate('/dashboard');
      return;
    }
    fetchGatheringConfig();
  }, [character, navigate]);

  const fetchGatheringConfig = async () => {
    try {
      const response = await api.get('/gathering/config');
      if (response.data.success) {
        setGatheringConfig(response.data.config);
      }
    } catch (error) {
      console.error('Failed to fetch gathering config:', error);
    }
  };

  // Start game
  const startGame = () => {
    if (!gatheringConfig) return;
    
    const config = gatheringConfig.tiers[selectedTier];
    if (!config) return;
    
    setIsPlaying(true);
    setGameEnded(false);
    setGameResult(null);
    setSuccessCount(0);
    setMissCount(0);
    setCurrentRound(1);
    setFeedback(null);
    
    gameStartTimeRef.current = Date.now();
    
    // Start the first button
    setTimeout(() => {
      showButton();
    }, 1000);
  };

  // Show button
  const showButton = () => {
    if (!gatheringConfig) return;
    
    const config = gatheringConfig.tiers[selectedTier];
    if (!config) return;
    
    setShaking(true);
    setClickable(true);
    
    // Button disappears after window time
    buttonTimeoutRef.current = setTimeout(() => {
      if (clickable) {
        handleMiss();
      }
    }, config.buttonWindow);
  };

  // Handle button click
  const handleEggClick = () => {
    if (!clickable || !isPlaying) return;
    
    clearTimeout(buttonTimeoutRef.current);
    setClickable(false);
    setShaking(false);
    
    // Success!
    setSuccessCount(prev => prev + 1);
    setFeedback('success');
    
    setTimeout(() => {
      setFeedback(null);
      nextRound();
    }, 1000);
  };

  // Handle miss
  const handleMiss = () => {
    if (!isPlaying) return;
    
    setClickable(false);
    setShaking(false);
    setMissCount(prev => prev + 1);
    setFeedback('miss');
    
    setTimeout(() => {
      setFeedback(null);
      nextRound();
    }, 1000);
  };

  // Next round
  const nextRound = () => {
    if (!gatheringConfig) return;
    
    const config = gatheringConfig.tiers[selectedTier];
    if (!config) return;
    
    setCurrentRound(prev => {
      const next = prev + 1;
      
      if (next > config.totalButtons) {
        endGame();
        return prev;
      }
      
      // Show next button after delay
      setTimeout(() => {
        showButton();
      }, 500);
      
      return next;
    });
  };

  // End game
  const endGame = async () => {
    if (!gatheringConfig) return;
    
    const config = gatheringConfig.tiers[selectedTier];
    if (!config) return;
    
    setIsPlaying(false);
    setGameEnded(true);
    
    const success = successCount >= config.successThreshold;
    
    try {
      const response = await api.post('/gathering/result', {
        characterId: character._id,
        tier: selectedTier,
        success,
        successCount,
        missCount,
        totalButtons: config.totalButtons
      });
      
      setGameResult(response.data);
    } catch (error) {
      console.error('Failed to submit gathering result:', error);
      setGameResult({
        success,
        resourcesGained: success ? 10 : 0
      });
    }
  };

  // Reset game
  const resetGame = () => {
    setIsPlaying(false);
    setGameEnded(false);
    setGameResult(null);
    setSuccessCount(0);
    setMissCount(0);
    setCurrentRound(1);
    setFeedback(null);
    setShaking(false);
    setClickable(false);
    
    clearTimeout(gameTimeoutRef.current);
    clearTimeout(buttonTimeoutRef.current);
  };

  return {
    character,
    selectedTier,
    setSelectedTier,
    isPlaying,
    shaking,
    clickable,
    successCount,
    missCount,
    feedback,
    gameEnded,
    gameResult,
    currentRound,
    gatheringConfig,
    startGame,
    handleEggClick,
    resetGame,
  };
};
