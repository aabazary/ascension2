import { updateCharacterCache } from '../utils/cacheUtils';

export const useBattleActions = (
  battleConfig,
  selectedTier,
  character,
  isPlayerTurn,
  gameEnded,
  playerHealth,
  enemyHealth,
  setIsBattleStarted,
  setGameEnded,
  setBattleResult,
  setPlayerHealth,
  setEnemyHealth,
  maxEnemyHealth,
  setSpells,
  setCombatLog,
  setLogId,
  setPlayerHit,
  setEnemyHit,
  setPlayerAttack,
  setEnemyAttack,
  setDamageText,
  setPlayerProjectiles,
  setEnemyProjectiles,
  setIsPlayerTurn,
  addCombatLog,
  submitBattleResult,
  isBossBattle = false
) => {
  // Start battle
  const startBattle = async () => {
    if (!battleConfig) return;
    
    setIsBattleStarted(true);
    setGameEnded(false);
    setBattleResult(null);
    setPlayerHealth(100);
    setEnemyHealth(isBossBattle ? (battleConfig?.tiers[selectedTier]?.bossHealth || 150) : maxEnemyHealth);
    setCombatLog([]);
    setLogId(0);
    
    // Initialize spells
    const tierConfig = battleConfig?.tiers[selectedTier];
    if (tierConfig) {
      const newSpells = [
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
      ];
      setSpells(newSpells);
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
        
        // Check if enemy is defeated after damage
        if (hit && enemyHealth - damage <= 0) {
          setTimeout(() => endBattle(true), 100);
        }
      }, 1000); // Wait for projectiles to travel and animation to complete
    };
    
    createMultipleProjectiles();
    
    // Reset animations
    setTimeout(() => {
      setPlayerAttack(false);
      setEnemyHit(false);
      
      // Check if enemy is still alive for enemy turn
      if (hit && enemyHealth - damage > 0) {
        // Enemy's turn
        setTimeout(() => enemyTurn(), 1000);
      } else if (!hit) {
        // Miss - enemy still alive, enemy's turn
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
          const damage = isBossBattle ? tierConfig.bossDamage : tierConfig.minionDamage;
          setPlayerHealth(prev => {
            const newHealth = Math.max(0, prev - damage);
            return newHealth;
          });
          
          setDamageText({ text: damage.toString(), isPlayer: true, isCrit: false });
          addCombatLog(`Enemy deals ${damage} damage!`, 'damage');
        }
        
        // Deactivate projectiles after damage is applied
        setEnemyProjectiles([]);
        
        // Check if player is defeated after damage
        if (tierConfig) {
          const damage = isBossBattle ? tierConfig.bossDamage : tierConfig.minionDamage;
          if (playerHealth - damage <= 0) {
            setTimeout(() => endBattle(false), 100);
          }
        }
      }, 1000);
    };
    
    createEnemyProjectiles();
    
    // Reset animations and turn
    setTimeout(() => {
      setEnemyAttack(false);
      setIsPlayerTurn(true);
      addCombatLog('Your turn!', 'turn');
    }, 2000);
    
    // Clear damage text after a longer delay
    setTimeout(() => {
      setDamageText(null);
    }, 3000);
  };

  // End battle
  const endBattle = async (won) => {
    setGameEnded(true);
    setPlayerAttack(false);
    setEnemyAttack(false);
    setPlayerProjectiles([]);
    setEnemyProjectiles([]);
    
    const result = await submitBattleResult(character._id, selectedTier, {
      won,
      playerHealth,
      enemyHealth
    });
    
    setBattleResult(result);
    
    // Update character cache with new resources if won
    if (result.won && result.resourcesGained > 0) {
      updateCharacterCache(character._id, isBossBattle ? 'boss' : 'minion', selectedTier, result.resourcesGained);
    }
  };

  // Reset battle
  const resetBattle = () => {
    setIsBattleStarted(false);
    setGameEnded(false);
    setBattleResult(null);
    setPlayerHealth(100);
    setEnemyHealth(isBossBattle ? (battleConfig?.tiers[selectedTier]?.bossHealth || 150) : maxEnemyHealth);
    setSpells([]); // Will be re-initialized by startBattle
    setCombatLog([]);
    setLogId(0);
    setDamageText(null);
    setPlayerHit(false);
    setEnemyHit(false);
    setPlayerAttack(false);
    setEnemyAttack(false);
    setPlayerProjectiles([]);
    setEnemyProjectiles([]);
    setIsPlayerTurn(true); // Reset turn to player
  };

  return {
    startBattle,
    castSpell,
    enemyTurn,
    endBattle,
    resetBattle
  };
};
