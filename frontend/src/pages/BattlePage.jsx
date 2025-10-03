import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { TIER_THEMES } from '../constants';
import EnergyWave from '../components/EnergyWave';
import Header from '../components/shared/Header';

const BattlePage = () => {
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
        const tierConfig = response.data.config.tiers[selectedTier];
        if (tierConfig) {
          setMaxEnemyHealth(tierConfig.minionHealth);
          setEnemyHealth(tierConfig.minionHealth);
        }
      }
    } catch (error) {
      console.error('Failed to fetch battle config:', error);
    }
  };

  const startBattle = () => {
    setIsBattleStarted(true);
    setGameEnded(false);
    setBattleResult(null);
    setPlayerHealth(100);
    setMaxPlayerHealth(100);
    setEnemyHealth(maxEnemyHealth);
    setIsPlayerTurn(true);
    
    // Clear combat log and add battle start entry
    setCombatLog([]);
    setLogId(0);
    const tierConfig = battleConfig?.tiers[selectedTier];
    addCombatLog(`Battle begins! ${character.name} vs ${tierConfig?.minionName || 'Dragonling'}`, 'turn');
    
    // Initialize spells
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
  };

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

  const enemyTurn = () => {
    setEnemyAttack(true);
    
    // Add to combat log
    const tierConfig = battleConfig?.tiers[selectedTier];
    if (tierConfig) {
      addCombatLog(`${tierConfig.minionName} attacks!`, 'action');
    }
    
    // Get enemy element based on tier
    const getEnemyElement = (tier) => {
      const elementMap = {
        0: 'earth',
        1: 'fire', 
        2: 'water',
        3: 'lightning',
        4: 'ice',
        5: 'shadow'
      };
      return elementMap[tier] || 'fire';
    };
    
    // Create multiple enemy projectiles
    const createMultipleEnemyProjectiles = () => {
      const projectileCount = 2; // Create 2 enemy projectiles
      const newProjectiles = [];
      const enemyElement = getEnemyElement(selectedTier);
      
      for (let i = 0; i < projectileCount; i++) {
        newProjectiles.push({
          id: i,
          active: true,
          element: enemyElement, // Use correct element based on tier
          position: 110 - (i * 2) // Start off-screen right, stagger starting positions
        });
      }
      
      setEnemyProjectiles(newProjectiles);
      
      // Animate all enemy projectiles
      const animateEnemyProjectiles = () => {
        const interval = setInterval(() => {
          setEnemyProjectiles(prev => {
            const updated = prev.map(projectile => ({
              ...projectile,
              position: projectile.position - 2.5 // Move left much faster
            }));
            
            return updated;
          });
        }, 40); // Faster animation
        
        // Stop animation after 1000ms (let the damage timeout handle deactivation)
        setTimeout(() => {
          clearInterval(interval);
        }, 1000);
      };
      
      animateEnemyProjectiles();
    };
    if (tierConfig) {
      const damage = tierConfig.minionDamage;
      
      createMultipleEnemyProjectiles();
      
      // Apply damage when projectiles reach target
      setTimeout(() => {
        setPlayerHealth(prev => {
          const newHealth = Math.max(0, prev - damage);
          if (newHealth <= 0) {
            endBattle(false);
          }
          return newHealth;
        });
        setPlayerHit(true);
        setDamageText({ text: damage.toString(), isPlayer: true, isCrit: false });
        
        // Add to combat log
        addCombatLog(`${tierConfig.minionName} deals ${damage} damage!`, 'damage');
        
        // Deactivate projectiles after damage is applied
        setEnemyProjectiles([]);
      }, 1000); // Wait for projectiles to travel and animation to complete
    }
    
    // Reset animations
    setTimeout(() => {
      setEnemyAttack(false);
      setPlayerHit(false);
      setIsPlayerTurn(true);
    }, 2000);
    
    // Clear damage text after a longer delay
    setTimeout(() => {
      setDamageText(null);
    }, 3000);
  };

  const endBattle = async (playerWon) => {
    setGameEnded(true);
    setIsPlayerTurn(false);
    
    try {
      const response = await api.post('/battle/minion/start', {
        characterId: character._id,
        tier: selectedTier,
        battleResult: {
          won: playerWon,
          playerHealth: playerHealth,
          enemyHealth: enemyHealth
        }
      });
      
      setBattleResult(response.data);
    } catch (error) {
      console.error('Failed to complete battle:', error);
      setBattleResult({
        success: true,
        won: playerWon,
        message: playerWon ? 'Victory!' : 'Defeat!',
        resourcesGained: playerWon ? Math.floor(Math.random() * 10) + 5 : 0
      });
    }
  };

  const resetBattle = () => {
    setIsBattleStarted(false);
    setGameEnded(false);
    setBattleResult(null);
    setPlayerHealth(100);
    setEnemyHealth(maxEnemyHealth);
    setIsPlayerTurn(true);
    setSpells([]);
  };

  if (!character) {
    return null;
  }

  const currentTheme = TIER_THEMES[selectedTier];
  const tierConfig = battleConfig?.tiers[selectedTier];

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header 
        showDashboard={true}
        showLogout={true}
        onLogout={handleLogout}
        userData={userData}
        onProfileUpdated={handleProfileUpdated}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-arcade text-3xl neon-text mb-2">
              {currentTheme.name.toUpperCase()} MINION BATTLE
            </h2>
            <p className="text-gray-400">Character: {character.name}</p>
            <div className={`h-1 w-32 mx-auto mt-4 bg-gradient-to-r ${currentTheme.color} rounded-full ${currentTheme.glow}`}></div>
          </div>

          {/* Tier Selection */}
          <div className="arcade-panel mb-8">
            <h3 className="font-arcade text-sm text-neon-green mb-4 text-center">
              SELECT MINION TIER
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 justify-center">
              {[0, 1, 2, 3, 4, 5].map((tier) => {
                const theme = TIER_THEMES[tier];
                const tierConfig = battleConfig?.tiers[tier];
                return (
                  <button
                    key={tier}
                    onClick={() => (!isBattleStarted || battleResult) && tier <= character.currentTier && setSelectedTier(tier)}
                    disabled={tier > character.currentTier || (isBattleStarted && !battleResult)}
                    className={`relative px-3 py-3 font-arcade text-xs rounded-lg transition-all ${
                      selectedTier === tier
                        ? `bg-gradient-to-br ${theme.color} text-white ${theme.glow}`
                        : tier <= character.currentTier
                        ? 'bg-dark-bg border border-dark-border hover:border-opacity-50'
                        : 'bg-dark-bg border border-dark-border opacity-30 cursor-not-allowed'
                    }`}
                    title={tier > character.currentTier ? 'Locked' : `${theme.name} - ${tierConfig?.minionName}`}
                  >
                    <div className="mb-1">
                      <img 
                        src={tierConfig?.minionImage || '/earth__dragonling.png'} 
                        alt={tierConfig?.minionName || 'Dragonling'}
                        className="w-8 h-8 mx-auto object-contain"
                      />
                    </div>
                    <div className="text-xs">T{tier}</div>
                    <div className="text-[10px] opacity-70">{theme.name}</div>
                  </button>
                );
              })}
            </div>
            {tierConfig && (
              <div className="mt-4 text-center text-sm text-gray-400">
                <p>Minion: {tierConfig.minionName} | Health: {tierConfig.minionHealth} | Damage: {tierConfig.minionDamage}</p>
              </div>
            )}
          </div>

          {/* Battle Arena */}
          <div className="arcade-panel mb-8">
            <div className={`relative aspect-video bg-dark-bg rounded-lg border-2 ${currentTheme.borderColor} overflow-hidden`}>
              {!isBattleStarted ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className="mb-2 sm:mb-4">
                      <img 
                        src={tierConfig?.minionImage || '/earth__dragonling.png'} 
                        alt={tierConfig?.minionName || 'Dragonling'}
                        className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto object-contain"
                      />
                    </div>
                    <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-2">Face the {currentTheme.name} dragonling in battle!</p>
                    <button onClick={startBattle} className="arcade-button text-sm sm:text-base px-4 py-2">
                      START BATTLE
                    </button>
                  </div>
                </div>
              ) : gameEnded && battleResult ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  <div className="text-center">
                    <div className={`text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 ${battleResult.won ? 'text-neon-green' : 'text-red-500'}`}>
                      {battleResult.won ? '🏆' : '💀'}
                    </div>
                    <h3 className={`font-arcade text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 ${battleResult.won ? 'text-neon-green' : 'text-red-500'}`}>
                      {battleResult.won ? 'VICTORY!' : 'DEFEAT!'}
                    </h3>
                    {battleResult.won && (
                      <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                        <p className="text-gray-400 text-sm sm:text-base">Resources Gained:</p>
                        <p className="font-arcade text-xl sm:text-2xl md:text-3xl text-neon-yellow">
                          {battleResult.resourcesGained || 0}
                        </p>
                      </div>
                    )}
                    <button onClick={resetBattle} className="arcade-button text-sm sm:text-base px-4 py-2">
                      BATTLE AGAIN
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Battle Field */}
                  <div className="absolute inset-0 flex items-center justify-between px-2 sm:px-4 md:px-8">
                    {/* Player */}
                    <div className={`text-center transition-all duration-300 ${
                      playerHit ? 'animate-pulse' : ''
                    } ${playerAttack ? 'scale-110' : ''}`}>
                      <div className="mb-2 relative">
                        <img 
                          src={`/mages/${character.avatar?.replace('_mage', '') || 'earth'}_mage.png`} 
                          alt={`${character.avatar?.replace('_mage', '') || 'earth'} mage`}
                          className="w-24 h-24 xs:w-28 xs:h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto object-contain"
                        />
                        {damageText && damageText.isPlayer && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 sm:-translate-y-6 md:-translate-y-8 animate-bounce text-red-500 font-arcade text-lg sm:text-xl md:text-2xl">
                            {damageText.text}
                          </div>
                        )}
                      </div>
                      <div className="font-arcade text-xs sm:text-sm text-neon-blue mb-2 break-words">{character.name}</div>
                      <div className="w-12 xs:w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2 mb-1 mx-auto">
                        <div 
                          className="bg-neon-green h-1.5 sm:h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(playerHealth / maxPlayerHealth) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400">{playerHealth}/{maxPlayerHealth}</div>
                    </div>

                    {/* VS */}
                    <div className="text-center relative">
                      <div className="font-arcade text-lg sm:text-xl md:text-2xl text-neon-purple mb-2">VS</div>
                      
                      {/* Player Energy Waves */}
                      {playerProjectiles.map((projectile) => (
                        <EnergyWave
                          key={projectile.id}
                          element={projectile.element}
                          position={projectile.position}
                          direction="right"
                          isActive={projectile.active}
                          projectileId={projectile.id}
                        />
                      ))}
                      
                      {/* Enemy Energy Waves */}
                      {enemyProjectiles.map((projectile) => (
                        <EnergyWave
                          key={projectile.id}
                          element={projectile.element}
                          position={projectile.position}
                          direction="left"
                          isActive={projectile.active}
                          projectileId={projectile.id}
                        />
                      ))}
                    </div>

                    {/* Enemy */}
                    <div className={`text-center transition-all duration-300 ${
                      enemyHit ? 'animate-pulse' : ''
                    } ${enemyAttack ? 'scale-110' : ''}`}>
                      <div className="mb-2 relative">
                        <img 
                          src={tierConfig?.minionImage || '/dragonling/earth__dragonling.png'} 
                          alt={tierConfig?.minionName || 'Dragonling'}
                          className="w-24 h-24 xs:w-28 xs:h-28 sm:w-48 sm:h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 mx-auto object-contain"
                        />
                        {damageText && !damageText.isPlayer && (
                          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 sm:-translate-y-6 md:-translate-y-8 animate-bounce text-red-500 font-arcade text-lg sm:text-xl md:text-2xl">
                            {damageText.text}
                          </div>
                        )}
                      </div>
                      <div className="font-arcade text-xs sm:text-sm text-neon-red mb-2 break-words">{tierConfig?.minionName || 'Dragonling'}</div>
                      <div className="w-12 xs:w-16 sm:w-20 md:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2 mb-1 mx-auto">
                        <div 
                          className="bg-red-500 h-1.5 sm:h-2 rounded-full transition-all duration-500"
                          style={{ width: `${(enemyHealth / maxEnemyHealth) * 100}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-400">{enemyHealth}/{maxEnemyHealth}</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Spell Buttons */}
          {isBattleStarted && !gameEnded && isPlayerTurn && (
            <div className="arcade-panel mb-8">
              <h3 className="font-arcade text-sm text-neon-purple mb-4 text-center">
                CHOOSE YOUR SPELL
              </h3>
              <div className="grid grid-cols-3 gap-4">
                {spells.map((spell, index) => (
                  <button
                    key={index}
                    onClick={() => castSpell(spell)}
                    className="group relative p-4 bg-dark-bg border border-dark-border rounded-lg hover:border-neon-purple transition-all"
                    title={`${spell.description}\nHit: ${(spell.hitChance * 100).toFixed(0)}% | Damage: ${spell.damage} | Crit: ${(spell.critChance * 100).toFixed(0)}%`}
                  >
                    <div className="text-3xl mb-2">{spell.emoji}</div>
                    <div className="font-arcade text-sm text-white mb-1">{spell.name}</div>
                    <div className="text-xs text-gray-400">
                      <div>Hit: {(spell.hitChance * 100).toFixed(0)}%</div>
                      <div>Dmg: {spell.damage}</div>
                      <div>Crit: {(spell.critChance * 100).toFixed(0)}%</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Combat Log */}
          {isBattleStarted && (
            <div className="arcade-panel mb-6">
              <h3 className="font-arcade text-sm text-neon-purple mb-3 text-center">
                COMBAT LOG
              </h3>
              <div className="bg-black/50 rounded-lg p-3 max-h-32 overflow-y-auto">
                {combatLog.length === 0 ? (
                  <div className="text-gray-500 text-sm text-center">Battle log will appear here...</div>
                ) : (
                  <div className="space-y-1">
                    {combatLog.map((entry) => (
                      <div 
                        key={entry.id} 
                        className={`text-xs ${
                          entry.type === 'crit' ? 'text-yellow-400 font-bold' :
                          entry.type === 'damage' ? 'text-red-400' :
                          entry.type === 'miss' ? 'text-gray-400' :
                          entry.type === 'action' ? 'text-blue-400' :
                          'text-neon-purple'
                        }`}
                      >
                        {entry.message}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Instructions */}
          <div className="arcade-panel">
            <h3 className={`font-arcade text-sm mb-4 text-center bg-gradient-to-r ${currentTheme.color} bg-clip-text text-transparent`}>
              HOW TO BATTLE {currentTheme.name.toUpperCase()} MINIONS
            </h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>• Choose your spell carefully - each has different hit chance and damage</p>
              <p>• Higher tiers = stronger minions with more health and damage</p>
              <p>• Critical hits deal double damage!</p>
              <p>• Defeat the minion to gain resources and experience</p>
              <p className={`text-xs mt-3 pt-3 border-t ${currentTheme.borderColor} border-opacity-30`}>
                Strategy: Use Blast for reliability, Nova for damage, Bolt for speed!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BattlePage;