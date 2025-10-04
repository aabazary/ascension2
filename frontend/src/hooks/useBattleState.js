import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TIER_THEMES } from '../constants';

export const useBattleState = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const character = location.state?.character;
  
  // Core battle states
  const [selectedTier, setSelectedTier] = useState(character?.currentTier || 0);
  const [battleConfig, setBattleConfig] = useState(null);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  
  // Health states
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [maxPlayerHealth, setMaxPlayerHealth] = useState(100);
  const [maxEnemyHealth, setMaxEnemyHealth] = useState(100);
  
  // Animation states
  const [playerHit, setPlayerHit] = useState(false);
  const [enemyHit, setEnemyHit] = useState(false);
  const [playerAttack, setPlayerAttack] = useState(false);
  const [enemyAttack, setEnemyAttack] = useState(false);
  const [damageText, setDamageText] = useState(null);
  
  // Combat log state
  const [combatLog, setCombatLog] = useState([]);
  const [logId, setLogId] = useState(0);
  
  // Projectile states
  const [playerProjectiles, setPlayerProjectiles] = useState([]);
  const [enemyProjectiles, setEnemyProjectiles] = useState([]);
  
  // Spells
  const [spells, setSpells] = useState([]);
  
  // User data for header
  const [userData, setUserData] = useState(null);

  // Helper function to add combat log entries
  const addCombatLog = (message, type) => {
    const newEntry = {
      id: `log-${Date.now()}-${Math.random()}`,
      message,
      timestamp: Date.now(),
      type
    };
    setCombatLog(prev => [...prev, newEntry]);
    setLogId(prev => prev + 1);
  };

  // Update enemy health when tier changes
  useEffect(() => {
    if (battleConfig && battleConfig.tiers[selectedTier]) {
      const tierConfig = battleConfig.tiers[selectedTier];
      setEnemyHealth(tierConfig.minionHealth);
      setMaxEnemyHealth(tierConfig.minionHealth);
    }
  }, [selectedTier, battleConfig]);

  // Determine current theme and tier config
  const currentTheme = TIER_THEMES[selectedTier];
  const tierConfig = battleConfig?.tiers[selectedTier];

  return {
    // Character and navigation
    character,
    navigate,
    
    // Core battle states
    selectedTier,
    setSelectedTier,
    battleConfig,
    setBattleConfig,
    isBattleStarted,
    setIsBattleStarted,
    isPlayerTurn,
    setIsPlayerTurn,
    gameEnded,
    setGameEnded,
    battleResult,
    setBattleResult,
    
    // Health states
    playerHealth,
    setPlayerHealth,
    enemyHealth,
    setEnemyHealth,
    maxPlayerHealth,
    setMaxPlayerHealth,
    maxEnemyHealth,
    setMaxEnemyHealth,
    
    // Animation states
    playerHit,
    setPlayerHit,
    enemyHit,
    setEnemyHit,
    playerAttack,
    setPlayerAttack,
    enemyAttack,
    setEnemyAttack,
    damageText,
    setDamageText,
    
    // Combat log
    combatLog,
    setCombatLog,
    logId,
    setLogId,
    addCombatLog,
    
    // Projectiles
    playerProjectiles,
    setPlayerProjectiles,
    enemyProjectiles,
    setEnemyProjectiles,
    
    // Spells
    spells,
    setSpells,
    
    // User data
    userData,
    setUserData,
    
    // Theme and config
    currentTheme,
    tierConfig
  };
};
