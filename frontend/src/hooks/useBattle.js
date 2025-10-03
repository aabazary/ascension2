import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { SPELL_CONFIGS } from '../constants';

export const useBattle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const character = location.state?.character;
  
  // Game state
  const [selectedTier, setSelectedTier] = useState(character?.currentTier || 0);
  const [isBattleStarted, setIsBattleStarted] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameEnded, setGameEnded] = useState(false);
  const [battleResult, setBattleResult] = useState(null);
  
  // Health states
  const [playerHealth, setPlayerHealth] = useState(100);
  const [enemyHealth, setEnemyHealth] = useState(100);
  const [maxEnemyHealth, setMaxEnemyHealth] = useState(100);
  
  // Battle states
  const [isPlayerAttack, setIsPlayerAttack] = useState(false);
  const [isEnemyAttack, setIsEnemyAttack] = useState(false);
  const [damageText, setDamageText] = useState(null);
  const [spells, setSpells] = useState([]);
  
  // Projectile states
  const [playerProjectiles, setPlayerProjectiles] = useState([]);
  const [enemyProjectiles, setEnemyProjectiles] = useState([]);
  
  // Combat log
  const [combatLog, setCombatLog] = useState([]);
  const [logId, setLogId] = useState(1);
  
  // Config
  const [battleConfig, setBattleConfig] = useState(null);
  
  // Helper function to add combat log entries
  const addCombatLog = (message, type) => {
    const newEntry = {
      id: logId,
      message,
      timestamp: Date.now(),
      type
    };
    setCombatLog(prev => [...prev, newEntry]);
    setLogId(prev => prev + 1);
  };

  // Fetch battle config
  useEffect(() => {
    if (!character) {
      navigate('/dashboard');
      return;
    }
    fetchBattleConfig();
  }, [character, navigate]);

  const fetchBattleConfig = async () => {
    try {
      const response = await api.get('/battle/config');
      if (response.data.success) {
        setBattleConfig(response.data.config);
        const config = response.data.config;
        const tierConfig = config.tiers[selectedTier];
        setEnemyHealth(tierConfig.minionHealth);
        setMaxEnemyHealth(tierConfig.minionHealth);
      }
    } catch (error) {
      console.error('Failed to fetch battle config:', error);
    }
  };

  // Start battle
  const startBattle = async () => {
    if (!battleConfig) return;
    
    setIsBattleStarted(true);
    setGameEnded(false);
    setBattleResult(null);
    setPlayerHealth(100);
    setEnemyHealth(maxEnemyHealth);
    setIsPlayerTurn(true);
    setSpells([]);
    setCombatLog([]);
    setLogId(1);
    
    // Initialize spells
    const initialSpells = Object.values(SPELL_CONFIGS);
    setSpells(initialSpells);
    
    addCombatLog('Battle started!', 'turn');
  };

  // Cast spell
  const castSpell = async (spell) => {
    if (!isPlayerTurn || gameEnded) return;
    
    setIsPlayerAttack(true);
    setIsPlayerTurn(false);
    
    addCombatLog(`${character?.name} casts ${spell.name}!`, 'action');
    
    // Create projectiles
    const createMultipleProjectiles = (count) => {
      const newProjectiles = [];
      for (let i = 0; i < count; i++) {
        newProjectiles.push({
          id: Date.now() + i,
          active: true,
          element: character?.avatar?.replace('_mage', '') || 'fire',
          position: -10 + (i * 2)
        });
      }
      return newProjectiles;
    };
    
    setPlayerProjectiles(createMultipleProjectiles(3));
    
    // Animate projectiles
    const animateProjectiles = () => {
      setPlayerProjectiles(prev => 
        prev.map(proj => ({
          ...proj,
          position: proj.position + 2.5
        }))
      );
    };
    
    const projectileInterval = setInterval(animateProjectiles, 50);
    
    // Apply damage after animation
    setTimeout(() => {
      clearInterval(projectileInterval);
      setPlayerProjectiles([]);
      
      const hit = Math.random() < spell.hitChance;
      const crit = hit && Math.random() < spell.critChance;
      
      if (hit) {
        const damage = crit ? spell.damage * 2 : spell.damage;
        const newEnemyHealth = Math.max(0, enemyHealth - damage);
        setEnemyHealth(newEnemyHealth);
        
        setDamageText(crit ? `CRIT! ${damage}` : `${damage}`);
        addCombatLog(`${character?.name} hits for ${damage} damage${crit ? ' (CRITICAL!)' : ''}!`, 'damage');
        
        if (newEnemyHealth <= 0) {
          endBattle(true);
          return;
        }
      } else {
        setDamageText('MISS');
        addCombatLog(`${character?.name} misses!`, 'miss');
      }
      
      setTimeout(() => setDamageText(null), 3000);
      
      // Enemy turn
      setTimeout(() => {
        enemyTurn();
      }, 1000);
    }, 1000);
  };

  // Enemy turn
  const enemyTurn = async () => {
    if (gameEnded) return;
    
    setIsEnemyAttack(true);
    addCombatLog('Enemy attacks!', 'action');
    
    // Create enemy projectiles
    const createEnemyProjectiles = (count) => {
      const newProjectiles = [];
      for (let i = 0; i < count; i++) {
        newProjectiles.push({
          id: Date.now() + i,
          active: true,
          element: 'fire', // Default enemy element
          position: 110 - (i * 2)
        });
      }
      return newProjectiles;
    };
    
    setEnemyProjectiles(createEnemyProjectiles(3));
    
    // Animate enemy projectiles
    const animateEnemyProjectiles = () => {
      setEnemyProjectiles(prev => 
        prev.map(proj => ({
          ...proj,
          position: proj.position - 2.5
        }))
      );
    };
    
    const enemyProjectileInterval = setInterval(animateEnemyProjectiles, 50);
    
    // Apply enemy damage
    setTimeout(() => {
      clearInterval(enemyProjectileInterval);
      setEnemyProjectiles([]);
      
      const tierConfig = battleConfig?.tiers[selectedTier];
      if (tierConfig) {
        const damage = tierConfig.minionDamage;
        const newPlayerHealth = Math.max(0, playerHealth - damage);
        setPlayerHealth(newPlayerHealth);
        
        setDamageText(`${damage}`);
        addCombatLog(`Enemy hits for ${damage} damage!`, 'damage');
        
        setTimeout(() => setDamageText(null), 3000);
        
        if (newPlayerHealth <= 0) {
          endBattle(false);
          return;
        }
      }
      
      setIsEnemyAttack(false);
      setIsPlayerTurn(true);
      addCombatLog('Your turn!', 'turn');
    }, 1000);
  };

  // End battle
  const endBattle = async (won) => {
    setGameEnded(true);
    setIsPlayerAttack(false);
    setIsEnemyAttack(false);
    setPlayerProjectiles([]);
    setEnemyProjectiles([]);
    
    try {
      const response = await api.post('/battle/result', {
        characterId: character?._id,
        tier: selectedTier,
        won,
        playerHealth,
        enemyHealth
      });
      
      setBattleResult(response.data);
    } catch (error) {
      console.error('Failed to submit battle result:', error);
      setBattleResult({
        success: true,
        won,
        resourcesGained: won ? 10 : 0
      });
    }
  };

  // Reset battle
  const resetBattle = () => {
    setIsBattleStarted(false);
    setGameEnded(false);
    setBattleResult(null);
    setPlayerHealth(100);
    setEnemyHealth(maxEnemyHealth);
    setIsPlayerTurn(true);
    setSpells([]);
  };

  return {
    // State
    character,
    selectedTier,
    isBattleStarted,
    isPlayerTurn,
    gameEnded,
    battleResult,
    playerHealth,
    enemyHealth,
    isPlayerAttack,
    isEnemyAttack,
    damageText,
    spells,
    playerProjectiles,
    enemyProjectiles,
    combatLog,
    battleConfig,
    
    // Actions
    setSelectedTier,
    startBattle,
    castSpell,
    resetBattle,
    addCombatLog
  };
};
