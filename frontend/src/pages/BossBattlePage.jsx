import { useBossBattle } from '../hooks/useBossBattle';
import { useCharacterSync } from '../hooks/useCharacterSync';
import Header from '../components/shared/Header';
import TierSelection from '../components/battle/TierSelection';
import BattleField from '../components/battle/BattleField';
import SpellButtons from '../components/battle/SpellButtons';
import CombatLog from '../components/battle/CombatLog';

const BossBattlePage = () => {
  const {
    character: initialCharacter,
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
    setSelectedTier,
    startBattle,
    castSpell,
    resetBattle,
    handleLogout,
    handleProfileUpdated,
    currentTheme,
    tierConfig
  } = useBossBattle();

  // Keep character in sync with cache updates
  const character = useCharacterSync(initialCharacter);

  if (!character) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header 
        showDashboard={true}
        showLogout={true}
        onLogout={handleLogout}
        userData={userData}
        onProfileUpdated={handleProfileUpdated}
        selectedCharacter={character}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-arcade text-3xl neon-text mb-2">
              {currentTheme.name.toUpperCase()} BOSS BATTLE
            </h2>
            <p className="text-gray-400">Character: {character.name}</p>
            <div className={`h-1 w-32 mx-auto mt-4 bg-gradient-to-r ${currentTheme.color} rounded-full ${currentTheme.glow}`}></div>
          </div>

          {/* Tier Selection */}
          <TierSelection
            selectedTier={selectedTier}
            onTierSelect={setSelectedTier}
            character={character}
            battleConfig={battleConfig}
            isBattleStarted={isBattleStarted}
            battleResult={battleResult}
            isBossBattle={true}
          />

          {/* Game Content */}
          {!isBattleStarted && !battleResult ? (
            <div className="arcade-panel text-center p-4">
              <div className="mb-4">
                <img 
                  src={selectedTier === 6 ? 
                    `/mages/${character.avatar?.replace('_mage', '') || 'earth'}_mage.png` : 
                    (tierConfig?.bossImage || '/dragons/mountain_wyrm.png')}
                  alt="Boss Dragon"
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto object-contain ${
                    selectedTier === 6 ? 'brightness-50 contrast-150 sepia' : ''
                  }`}
                />
              </div>
              <p className="text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base px-2">Face the mighty {tierConfig?.bossName || 'Dragon'} in epic battle!</p>
              <button onClick={startBattle} className="arcade-button text-sm sm:text-base px-4 py-2">
                START BOSS BATTLE
              </button>
            </div>
          ) : battleResult ? (
            <>
              <div className="arcade-panel text-center p-4 mb-6">
                <div className={`text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 ${battleResult.won ? 'text-neon-green' : 'text-red-500'}`}>
                  {battleResult.won ? '🏆' : '💀'}
                </div>
                <h3 className={`font-arcade text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 ${battleResult.won ? 'text-neon-green' : 'text-red-500'}`}>
                  {battleResult.won ? 'BOSS DEFEATED!' : 'BOSS VICTORIOUS!'}
                </h3>
                {battleResult.won && (
                  <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                    <p className="text-gray-400 text-sm sm:text-base">Boss Resources Gained:</p>
                    <p className="font-arcade text-xl sm:text-2xl md:text-3xl text-neon-yellow">
                      {battleResult.resourcesGained || 0}
                    </p>
                  </div>
                )}
                <button onClick={resetBattle} className="arcade-button text-sm sm:text-base px-4 py-2">
                  BATTLE BOSS AGAIN
                </button>
              </div>

              {/* Combat Log - Show after battle result */}
              <CombatLog
                combatLog={combatLog}
                isBattleStarted={isBattleStarted}
                battleResult={battleResult}
              />
            </>
          ) : (
            <>
              {/* Battle Field */}
              <div className="arcade-panel mb-6 sm:mb-8">
                <div className={`relative aspect-video bg-dark-bg rounded-lg border-2 border-dark-border overflow-hidden`}>
                  {tierConfig && (
                    <BattleField
                      character={character}
                      playerHealth={playerHealth}
                      maxPlayerHealth={maxPlayerHealth}
                      enemyHealth={enemyHealth}
                      maxEnemyHealth={maxEnemyHealth}
                      playerHit={playerHit}
                      enemyHit={enemyHit}
                      playerAttack={playerAttack}
                      enemyAttack={enemyAttack}
                      damageText={damageText}
                      playerProjectiles={playerProjectiles}
                      enemyProjectiles={enemyProjectiles}
                      tierConfig={tierConfig}
                      selectedTier={selectedTier}
                      isBossBattle={true}
                    />
                  )}
                </div>
              </div>

              {/* Spell Buttons */}
              {isBattleStarted && !gameEnded && isPlayerTurn && (
                <SpellButtons
                  spells={spells}
                  onCastSpell={castSpell}
                />
              )}

              {/* Combat Log */}
              <CombatLog
                combatLog={combatLog}
                isBattleStarted={isBattleStarted}
                battleResult={battleResult}
              />

              {/* Instructions */}
              {!isBattleStarted && (
                <div className="arcade-panel">
                  <h3 className={`font-arcade text-sm mb-4 text-center bg-gradient-to-r ${currentTheme.color} bg-clip-text text-transparent`}>
                    HOW TO BATTLE {currentTheme.name.toUpperCase()} BOSSES
                  </h3>
                  <div className="text-sm text-gray-400 space-y-2">
                    <p>• Boss dragons are much stronger than minions - prepare for a challenge!</p>
                    <p>• Higher tiers = more powerful dragons with massive health and damage</p>
                    <p>• Boss battles reward rare boss resources for advanced crafting</p>
                    <p>• Critical hits are crucial - use them wisely!</p>
                    <p>• Defeat the boss to gain valuable boss resources and prestige</p>
                    <p className={`text-xs mt-3 pt-3 border-t ${currentTheme.borderColor} border-opacity-30`}>
                      Strategy: Bosses hit hard, so focus on consistent damage over risky plays!
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default BossBattlePage;
