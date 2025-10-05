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
  setMaxPlayerHealth,
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
  initBattle,
  combatLog,
  updateCharacter,
  isBossBattle = false
) => {
  // Start battle
  const startBattle = async () => {
    if (!battleConfig) return;
    
    setIsBattleStarted(true);
    setGameEnded(false);
    setBattleResult(null);
    
    // Get calculated health and power from battle init API
    let characterPower = 20; // Default base power
    try {
      const initResult = await initBattle(character, selectedTier, isBossBattle);
      
      if (initResult.success && initResult.battleStats) {
        setPlayerHealth(initResult.battleStats.characterMaxHealth);
        setMaxPlayerHealth(initResult.battleStats.characterMaxHealth);
        characterPower = initResult.battleStats.characterPower;
      } else {
        setPlayerHealth(100); // Fallback
      }
    } catch (error) {
      console.error('Failed to initialize battle:', error);
      setPlayerHealth(100); // Fallback
    }
    
    setEnemyHealth(isBossBattle ? (battleConfig?.tiers[selectedTier]?.bossHealth || 150) : maxEnemyHealth);
    setCombatLog([]);
    setLogId(0);
    
    // Initialize spells with calculated power
    const tierConfig = battleConfig?.tiers[selectedTier];
    if (tierConfig && battleConfig.spells) {
      // Get spell configs from battleConfig
      const blastConfig = battleConfig.spells.blast;
      const novaConfig = battleConfig.spells.nova;
      const boltConfig = battleConfig.spells.bolt;
      
      // Calculate total damages (base damage + compensated power bonus)
      const totalBlastDamage = Math.round(blastConfig.baseDamage + (characterPower * blastConfig.compensationFactor));
      const totalNovaDamage = Math.round(novaConfig.baseDamage + (characterPower * novaConfig.compensationFactor));
      const totalBoltDamage = Math.round(boltConfig.baseDamage + (characterPower * boltConfig.compensationFactor));
      
      const newSpells = [
        {
          name: blastConfig.name,
          emoji: blastConfig.emoji,
          hitChance: blastConfig.hitChance,
          damage: totalBlastDamage,
          baseDamage: blastConfig.baseDamage,
          powerBonus: Math.round(characterPower * blastConfig.compensationFactor),
          critChance: blastConfig.critChance,
          description: blastConfig.description
        },
        {
          name: novaConfig.name,
          emoji: novaConfig.emoji,
          hitChance: novaConfig.hitChance,
          damage: totalNovaDamage,
          baseDamage: novaConfig.baseDamage,
          powerBonus: Math.round(characterPower * novaConfig.compensationFactor),
          critChance: novaConfig.critChance,
          description: novaConfig.description
        },
        {
          name: boltConfig.name,
          emoji: boltConfig.emoji,
          hitChance: boltConfig.hitChance,
          damage: totalBoltDamage,
          baseDamage: boltConfig.baseDamage,
          powerBonus: Math.round(characterPower * boltConfig.compensationFactor),
          critChance: boltConfig.critChance,
          description: boltConfig.description
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

  // Helper function to check if player is undergeared for vulnerable strikes
  const getUndergearedLevel = () => {
    if (!character?.equipment) return 2; // Missing all equipment
    
    const battleTier = selectedTier;
    
    // Master boss (Tier 6) never has vulnerable attacks
    if (battleTier === 6) {
      return 0; // Not vulnerable
    }
    
    const requiredTier = battleTier + 1; // Need pieces one tier higher
    
    let higherTierItems = 0;
    
    // Count how many pieces are one tier higher
    Object.values(character.equipment).forEach(equip => {
      if (equip.infused && equip.tier >= requiredTier) {
        higherTierItems++;
      }
    });
    
    // For minions: need at least 1 higher tier piece
    // For bosses: need at least 2 higher tier pieces
    const requiredHigherTierPieces = isBossBattle ? 2 : 1;
    
    console.log('Vulnerable strike check:', {
      battleTier,
      requiredTier,
      higherTierItems,
      requiredHigherTierPieces,
      isBossBattle,
      equipment: character.equipment
    });
    
    if (higherTierItems >= requiredHigherTierPieces) {
      console.log('Not vulnerable - has enough higher tier pieces');
      return 0; // Not vulnerable
    }
    
    console.log('Vulnerable - insufficient higher tier pieces');
    return 1; // Vulnerable to strikes
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
          const baseDamage = isBossBattle ? tierConfig.bossDamage : tierConfig.minionDamage;
          const missingTierItems = getUndergearedLevel();
          const isVulnerable = missingTierItems > 0;
          
          // Calculate hit/miss (20% base miss chance, but 0% if player is vulnerable)
          const missRoll = Math.random();
          const hit = isVulnerable ? true : (missRoll >= 0.2);
          
          if (hit) {
            // Calculate crit (20% of hits are crits)
            const critRoll = Math.random();
            const isCrit = critRoll < 0.2;
            
            // Calculate vulnerable strike chance (50% if undergeared)
            const vulnerableRoll = Math.random();
            const isVulnerableStrike = isVulnerable && vulnerableRoll < 0.5;
            
            console.log('Vulnerable strike calculation:', {
              missingTierItems,
              vulnerableRoll,
              isVulnerable,
              isVulnerableStrike,
              vulnerableChance: missingTierItems > 0 ? 0.5 : 0
            });
            
            let finalDamage = baseDamage;
            let damageMultiplier = 1;
            
            if (isCrit) {
              damageMultiplier *= 2;
            }
            
            if (isVulnerableStrike) {
              // Minions: 3x damage, Bosses: 4x damage
              damageMultiplier *= (isBossBattle ? 4 : 3);
            }
            
            finalDamage = Math.floor(baseDamage * damageMultiplier);
            
            setPlayerHealth(prev => {
              const newHealth = Math.max(0, prev - finalDamage);
              return newHealth;
            });
            
            // Set damage text and combat log
            let damageText = finalDamage.toString();
            let logMessage = `Enemy deals ${finalDamage} damage!`;
            
            if (isVulnerableStrike) {
              damageText = `VULNERABLE STRIKE! ${finalDamage}`;
              logMessage = `VULNERABLE STRIKE! Enemy deals ${finalDamage} damage!`;
            } else if (isCrit) {
              damageText = `CRITICAL! ${finalDamage}`;
              logMessage = `CRITICAL HIT! Enemy deals ${finalDamage} damage!`;
            }
            
            setDamageText({ 
              text: damageText, 
              isPlayer: true, 
              isCrit: isCrit || isVulnerableStrike,
              isVulnerable: isVulnerableStrike
            });
            addCombatLog(logMessage, isVulnerableStrike ? 'vulnerable' : (isCrit ? 'crit' : 'damage'));
            
            // Check if player is defeated after damage
            if (playerHealth - finalDamage <= 0) {
              setTimeout(() => endBattle(false), 100);
            }
          } else {
            // Miss
            setDamageText({ text: 'MISS', isPlayer: true, isCrit: false });
            addCombatLog('Enemy attack misses!', 'miss');
          }
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
    
    const result = await submitBattleResult(
      isBossBattle ? character._id : character, 
      selectedTier, 
      {
        won,
        playerHealth,
        enemyHealth,
        battleLog: combatLog // Include the combat log in the battle result
      }
    );
    
    setBattleResult(result);
    
    // Update character context with updated character data if available
    if (result.character && updateCharacter) {
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
        stats: result.character.stats,
        resources: transformResources(result.character.resources)
      };
      
      updateCharacter(updatedCharacter);
    }
    
    // Update health values from battle stats if available
    if (result.battleStats) {
      setPlayerHealth(result.battleStats.characterCurrentHealth);
      setMaxPlayerHealth(result.battleStats.characterMaxHealth);
    }
  };

  // Reset battle
  const resetBattle = () => {
    setIsBattleStarted(false);
    setGameEnded(false);
    setBattleResult(null);
    setPlayerHealth(100);
    setMaxPlayerHealth(100);
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
