import { useBattle } from '../hooks/useBattle';
import { TIER_THEMES } from '../constants';
import GameLayout from '../components/shared/GameLayout';
import BattleField from '../components/battle/BattleField';
import SpellButtons from '../components/battle/SpellButtons';
import CombatLog from '../components/battle/CombatLog';

const BattlePage = () => {
  const {
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
    setSelectedTier,
    startBattle,
    castSpell,
    resetBattle
  } = useBattle();

  if (!character) {
    return null;
  }

  const currentTheme = TIER_THEMES[selectedTier];
  const tierConfig = battleConfig?.tiers[selectedTier];

  return (
    <GameLayout>
      <div className="max-w-6xl mx-auto">
        {/* Title */}
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="font-arcade text-xl sm:text-2xl md:text-3xl neon-text mb-2">
            {currentTheme.name.toUpperCase()} MINION BATTLE
          </h2>
          <p className="text-gray-400 text-sm sm:text-base">Character: {character.name}</p>
          <div className={`h-1 w-24 sm:w-32 mx-auto mt-3 sm:mt-4 bg-gradient-to-r ${currentTheme.color} rounded-full ${currentTheme.glow}`}></div>
        </div>

        {/* Tier Selection */}
        <div className="arcade-panel mb-6 sm:mb-8">
          <h3 className="font-arcade text-sm text-neon-green mb-4 text-center">
            SELECT MINION TIER
          </h3>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3 justify-center">
            {[0, 1, 2, 3, 4, 5].map((tier) => {
              const theme = TIER_THEMES[tier];
              return (
                <button
                  key={tier}
                  onClick={() => (!isBattleStarted || battleResult) && setSelectedTier(tier)}
                  disabled={tier > character.currentTier || (isBattleStarted && !battleResult)}
                  className={`relative px-3 py-3 font-arcade text-xs rounded-lg transition-all ${
                    selectedTier === tier
                      ? `bg-gradient-to-br ${theme.color} text-white ${theme.glow}`
                      : tier <= character.currentTier
                      ? 'bg-dark-bg border border-dark-border hover:border-opacity-50'
                      : 'bg-dark-bg border border-dark-border opacity-30 cursor-not-allowed'
                  }`}
                  title={tier > character.currentTier ? 'Locked' : theme.name}
                >
                  <div className="text-2xl mb-1">{theme.egg}</div>
                  <div className="text-xs">T{tier}</div>
                  <div className="text-[10px] opacity-70">{theme.name}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Game Content */}
        {!isBattleStarted && !battleResult ? (
          <div className="arcade-panel text-center p-4">
            <div className="mb-4">
              <img 
                src={tierConfig?.minionImage || '/dragonling/earth__dragonling.png'}
                alt="Minion"
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto object-contain"
              />
            </div>
            <p className="text-sm sm:text-base px-2 mb-2 sm:mb-4">
              Ready to battle a {currentTheme.name} minion? Choose your spells and fight!
            </p>
            <button onClick={startBattle} className="arcade-button text-sm sm:text-base px-4 py-2">
              START BATTLE
            </button>
          </div>
        ) : battleResult ? (
          <div className="arcade-panel text-center p-4">
            <div className={`text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 ${battleResult.won ? 'text-neon-green' : 'text-red-500'}`}>
              {battleResult.won ? '🎉' : '💀'}
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
            <div className="space-y-1 sm:space-y-2">
              <button onClick={resetBattle} className="arcade-button text-sm sm:text-base px-4 py-2 mr-2">
                BATTLE AGAIN
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Battle Field */}
            <div className="arcade-panel mb-6 sm:mb-8">
              {tierConfig && (
                <BattleField
                  character={character}
                  enemyHealth={enemyHealth}
                  maxEnemyHealth={tierConfig.minionHealth}
                  playerHealth={playerHealth}
                  isPlayerAttack={isPlayerAttack}
                  isEnemyAttack={isEnemyAttack}
                  damageText={damageText}
                  playerProjectiles={playerProjectiles}
                  enemyProjectiles={enemyProjectiles}
                  tierConfig={tierConfig}
                />
              )}
            </div>

            {/* Spell Buttons */}
            <SpellButtons
              spells={spells}
              isPlayerTurn={isPlayerTurn}
              gameEnded={gameEnded}
              onCastSpell={castSpell}
            />

            {/* Combat Log */}
            <CombatLog combatLog={combatLog} />
          </>
        )}
      </div>
    </GameLayout>
  );
};

export default BattlePage;
