import { TIER_THEMES } from '../constants';
import { useCharacterSync } from '../hooks/useCharacterSync';
import Header from '../components/shared/Header';
import GatheringTierSelection from '../components/gathering/GatheringTierSelection';
import GatheringGameField from '../components/gathering/GatheringGameField';
import { useGathering } from '../hooks/useGathering';

const GatheringPage = () => {
  const {
    character: initialCharacter,
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
    setSelectedTier,
    startGame,
    handleEggClick,
    resetGame,
    handleLogout,
    handleProfileUpdated
  } = useGathering();

  // Keep character in sync with cache updates
  const character = useCharacterSync(initialCharacter);

  // Show loading state while character is loading
  if (isLoading || !character) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Loading character...</p>
        </div>
      </div>
    );
  }

  // Ensure selectedTier never exceeds 5 (no Master essence gathering)
  const safeSelectedTier = Math.min(selectedTier, 5);
  const currentTheme = TIER_THEMES[safeSelectedTier];
  const config = gatheringConfig?.tiers[safeSelectedTier];

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

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-arcade text-3xl neon-text mb-2">
              {currentTheme.name.toUpperCase()} ESSENCE GATHERING
            </h2>
            <p className="text-gray-400">Character: {character.name}</p>
            <div className={`h-1 w-32 mx-auto mt-4 bg-gradient-to-r ${currentTheme.color} rounded-full ${currentTheme.glow}`}></div>
          </div>

          {/* Tier Selection */}
          <GatheringTierSelection
            selectedTier={selectedTier}
            onTierSelect={setSelectedTier}
            character={character}
            gatheringConfig={gatheringConfig}
            isPlaying={isPlaying}
          />

          {/* Game Field */}
          <GatheringGameField
            isPlaying={isPlaying}
            gameEnded={gameEnded}
            gameResult={gameResult}
            shaking={shaking}
            clickable={clickable}
            feedback={feedback}
            successCount={successCount}
            missCount={missCount}
            currentTheme={currentTheme}
            config={config}
            onEggClick={handleEggClick}
            onStartGame={startGame}
            onResetGame={resetGame}
          />

          {/* Instructions */}
          {!isPlaying && (
            <div className="arcade-panel">
              <h3 className={`font-arcade text-sm mb-4 text-center bg-gradient-to-r ${currentTheme.color} bg-clip-text text-transparent`}>
                HOW TO GATHER {currentTheme.name.toUpperCase()} ESSENCE
              </h3>
              <div className="text-sm text-gray-400 space-y-2">
                <p>• Click the {currentTheme.name} essence when it starts shaking</p>
                <p>• You have a limited time window to click each essence</p>
                <p>• Get enough successful clicks to gather resources</p>
                <p>• Don't click too early or too late, or you'll miss!</p>
                <p>• Too many misses and the gathering will fail</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default GatheringPage;
