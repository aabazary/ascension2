import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

export const useBattle = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const character = location.state?.character;
  
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
  
  // Projectile states - now arrays for multiple projectiles
  const [playerProjectiles, setPlayerProjectiles] = useState([]);
  const [enemyProjectiles, setEnemyProjectiles] = useState([]);
  
  // Spells
  const [spells, setSpells] = useState([]);
  
  // User data for header
  const [userData, setUserData] = useState(null);

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
    fetchUserData();
  }, [character, navigate]);

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
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
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
    setLogId(0);
    
    // Initialize spells
    const tierConfig = battleConfig?.tiers[selectedTier];
    if (tierConfig) {
      setSpells([
        {
          name: 'Blast',
          emoji: '💥',
          hitChance: 0.3,
          damage: 25,
          critChance: 1.0,
          description: 'A powerful energy blast'
        },
        {
          name: 'Nova',
          emoji: '🌟',
          hitChance: 0.5,
          damage: 35,
          critChance: 0.3,
          description: 'A devastating nova explosion'
        },
        {
          name: 'Bolt',
          emoji: '⚡',
          hitChance: 0.6,
          damage: 20,
          critChance: 0.0,
          description: 'A quick lightning bolt'
        }
      ]);
    }
    
    addCombatLog('Battle started!', 'turn');
  };

  // Cast spell
  const castSpell = async (spell) => {
    if (!isPlayerTurn || gameEnded) return;
    
    setPlayerAttack(true);
    setIsPlayerTurn(false);
    
    // Add to combat log
    addCombatLog(`${character.name} casts ${spell.name}!`, 'action');
    
    // Clear any existing projectiles before creating new ones
    setPlayerProjectiles([]);
    
    // Calculate hit/miss
    const hit = Math.random() < spell.hitChance;
    const crit = hit && Math.random() < spell.critChance;
    const damage = hit ? (crit ? spell.damage * 2 : spell.damage) : 0;
    
    // Create multiple projectiles and animate them
    const createMultipleProjectiles = () => {
      const projectileCount = 3; // Create 3 projectiles
      const newProjectiles = [];
      
      for (let i = 0; i < projectileCount; i++) {
        newProjectiles.push({
          id: i,
          active: true,
          element: character.avatar?.replace('_mage', '') || 'fire',
          position: -10 + (i * 2) // Start off-screen left, stagger starting positions
        });
      }
      
      setPlayerProjectiles(newProjectiles);
      
      // Animate all projectiles
      const animateProjectiles = () => {
        const interval = setInterval(() => {
          setPlayerProjectiles(prev => {
            const updated = prev.map(projectile => ({
              ...projectile,
              position: projectile.position + 2.5 // Much faster movement
            }));
            
            return updated;
          });
        }, 40); // Faster animation
        
        // Stop animation after 1000ms (let the damage timeout handle deactivation)
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      };
      
      animateProjectiles();
      
      // Apply damage when projectiles reach target
      setTimeout(() => {
        if (hit) {
          setEnemyHealth(prev => {
            const newHealth = Math.max(0, prev - damage);
            if (newHealth <= 0) {
              endBattle(true);
            }
            return newHealth;
          });
          setEnemyHit(true);
          setDamageText({ text: damage.toString(), isPlayer: false, isCrit: crit });
          
          // Add to combat log
          if (crit) {
            addCombatLog(`CRITICAL HIT! ${character.name} deals ${damage} damage!`, 'crit');
          } else {
            addCombatLog(`${character.name} deals ${damage} damage!`, 'damage');
          }
        } else {
          setDamageText({ text: 'MISS', isPlayer: false, isCrit: false });
          addCombatLog(`${character.name}'s ${spell.name} misses!`, 'miss');
        }
        
        // Deactivate projectiles after damage is applied
        setPlayerProjectiles([]);
      }, 1000); // Wait for projectiles to travel and animation to complete
    };
    
    createMultipleProjectiles();
    
    // Reset animations
    setTimeout(() => {
      setPlayerAttack(false);
      setEnemyHit(false);
      
      if (enemyHealth - damage > 0) {
        // Enemy's turn
        setTimeout(() => enemyTurn(), 1000);
      }
    }, 2000);
    
    // Clear damage text after a longer delay
    setTimeout(() => {
      setDamageText(null);
    }, 3000);
  };

  // Enemy turn
  const enemyTurn = async () => {
    if (gameEnded) return;
    
    setEnemyAttack(true);
    addCombatLog('Enemy attacks!', 'action');
    
    // Clear any existing projectiles before creating new ones
    setEnemyProjectiles([]);
    
    // Create multiple enemy projectiles and animate them
    const createEnemyProjectiles = () => {
      const projectileCount = 3; // Create 3 projectiles
      const newProjectiles = [];
      
      // Get enemy element based on tier
      const tierNames = ['earth', 'fire', 'water', 'lightning', 'ice', 'shadow'];
      const enemyElement = tierNames[selectedTier] || 'fire';
      
      for (let i = 0; i < projectileCount; i++) {
        newProjectiles.push({
          id: i,
          active: true,
          element: enemyElement,
          position: 110 - (i * 2) // Start off-screen right, stagger starting positions
        });
      }
      
      setEnemyProjectiles(newProjectiles);
      
      // Animate all projectiles
      const animateProjectiles = () => {
        const interval = setInterval(() => {
          setEnemyProjectiles(prev => {
            const updated = prev.map(projectile => ({
              ...projectile,
              position: projectile.position - 2.5 // Much faster movement
            }));
            
            return updated;
          });
        }, 40); // Faster animation
        
        // Stop animation after 1000ms
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      };
      
      animateProjectiles();
      
      // Apply damage when projectiles reach target
      setTimeout(() => {
        const tierConfig = battleConfig?.tiers[selectedTier];
        if (tierConfig) {
          const damage = tierConfig.minionDamage;
          setPlayerHealth(prev => {
            const newHealth = Math.max(0, prev - damage);
            if (newHealth <= 0) {
              endBattle(false);
            }
            return newHealth;
          });
          
          setDamageText({ text: damage.toString(), isPlayer: true, isCrit: false });
          addCombatLog(`Enemy deals ${damage} damage!`, 'damage');
        }
        
        // Deactivate projectiles after damage is applied
        setEnemyProjectiles([]);
      }, 1000);
    };
    
    createEnemyProjectiles();
    
    // Reset animations and turn
    setTimeout(() => {
      setEnemyAttack(false);
      setIsPlayerTurn(true);
      addCombatLog('Your turn!', 'turn');
    }, 2000);
  };

  // End battle
  const endBattle = async (won) => {
    setGameEnded(true);
    setPlayerAttack(false);
    setEnemyAttack(false);
    setPlayerProjectiles([]);
    setEnemyProjectiles([]);
    
    try {
      const response = await api.post('/battle/minion/start', {
        characterId: character._id,
        tier: selectedTier,
        battleResult: {
          won,
          playerHealth,
          enemyHealth
        }
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
    setCombatLog([]);
    setLogId(0);
    setDamageText(null);
    setPlayerHit(false);
    setEnemyHit(false);
    setPlayerAttack(false);
    setEnemyAttack(false);
    setPlayerProjectiles([]);
    setEnemyProjectiles([]);
  };

  return {
    // State
    character,
    selectedTier,
    battleConfig,
    isBattleStarted,
    isPlayerTurn,
    gameEnded,
    battleResult,
    playerHealth,
    enemyHealth,
    maxPlayerHealth,
    maxEnemyHealth,
    playerHit,
    enemyHit,
    playerAttack,
    enemyAttack,
    damageText,
    combatLog,
    playerProjectiles,
    enemyProjectiles,
    spells,
    userData,
    
    // Actions
    setSelectedTier,
    startBattle,
    castSpell,
    resetBattle,
    handleLogout,
    handleProfileUpdated
  };
};
