const GatheringField = ({
  currentTheme,
  isPlaying,
  gameEnded,
  gameResult,
  shaking,
  clickable,
  feedback,
  successCount,
  missCount,
  currentRound,
  totalButtons,
  onEggClick,
  onStartGame,
  onResetGame,
}) => {
  return (
    <div className="arcade-panel">
      <div className="text-center mb-6">
        <h3 className="font-arcade text-xl text-neon-green mb-2">
          {currentTheme.name.toUpperCase()} GATHERING}
        </h3>
        <p className="text-gray-400 text-sm">
          Click the egg when it glows to gather essence!
        </p>
      </div>

      {/* Game Area */}
      <div className="relative bg-dark-bg rounded-lg border-2 border-dark-border p-4 sm:p-8">
        {!isPlaying && !gameEnded ? (
          // Start Screen
          <div className="text-center py-8">
            <div className={`text-8xl mb-6 ${currentTheme.glow}`}>
              {currentTheme.egg}
            </div>
            <p className="text-gray-400 mb-6">
              Ready to gather {currentTheme.name.toLowerCase()} essence?
            </p>
            <button
              onClick={onStartGame}
              className="arcade-button text-lg px-8 py-4"
            >
              START GATHERING
            </button>
          </div>
        ) : gameEnded ? (
          // Game Over Screen
          <div className="text-center py-8">
            <div className="text-6xl mb-4">
              {gameResult?.success ? '🎉' : '💀'}
            </div>
            <h3 className={`font-arcade text-2xl mb-4 ${
              gameResult?.success ? 'text-neon-green' : 'text-red-500'
            }`}>
              {gameResult?.success ? 'SUCCESS!' : 'FAILED!'}
            </h3>
            <div className="space-y-2 mb-6">
              <p className="text-gray-400">
                Success: {successCount} / Miss: {missCount}
              </p>
              {gameResult?.resourcesGained && (
                <p className="text-neon-yellow font-arcade text-xl">
                  +{gameResult.resourcesGained} {currentTheme.name.toLowerCase()} essence
                </p>
              )}
            </div>
            <button
              onClick={onResetGame}
              className="arcade-button text-lg px-8 py-4"
            >
              GATHER AGAIN
            </button>
          </div>
        ) : (
          // Game Screen
          <div className="text-center py-8">
            <div className="mb-6">
              <div className={`text-8xl mb-4 transition-all duration-200 ${
                shaking ? 'animate-shake' : ''
              } ${currentTheme.glow}`}>
                {currentTheme.egg}
              </div>
              {feedback && (
                <div className={`text-2xl font-arcade mb-4 ${
                  feedback === 'success' ? 'text-neon-green' : 'text-red-500'
                }`}>
                  {feedback === 'success' ? 'SUCCESS!' : 'MISS!'}
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <p className="text-gray-400 mb-2">
                Round {currentRound} of {totalButtons}
              </p>
              <div className="flex justify-center gap-4 text-sm">
                <span className="text-neon-green">Success: {successCount}</span>
                <span className="text-red-500">Miss: {missCount}</span>
              </div>
            </div>

            <button
              onClick={onEggClick}
              disabled={!clickable}
              className={`arcade-button text-lg px-8 py-4 transition-all ${
                clickable 
                  ? 'hover:scale-105 cursor-pointer' 
                  : 'opacity-50 cursor-not-allowed'
              }`}
            >
              {clickable ? 'CLICK NOW!' : 'WAIT...'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GatheringField;
