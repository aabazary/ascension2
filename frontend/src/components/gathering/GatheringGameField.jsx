import React from 'react';

const GatheringGameField = ({
  isPlaying,
  gameEnded,
  gameResult,
  shaking,
  clickable,
  feedback,
  successCount,
  missCount,
  currentTheme,
  config,
  onEggClick,
  onStartGame,
  onResetGame
}) => {
  return (
    <div className="arcade-panel mb-8">
      <div className={`relative aspect-video bg-dark-bg rounded-lg border-2 ${currentTheme.borderColor} overflow-hidden ${shaking && isPlaying ? currentTheme.glow : ''}`}>
        {/* Game Area */}
        <div className="absolute inset-0 flex items-center justify-center">
          {!isPlaying && !gameEnded ? (
            <div className="text-center p-4">
              <div 
                className={`text-4xl sm:text-6xl md:text-8xl mb-4 inline-block leading-[0] ${currentTheme.glow} filter drop-shadow-2xl`}
                style={{ 
                  background: 'transparent',
                  padding: 0,
                  margin: '0 0 1rem 0',
                  border: 'none'
                }}
              >
                {currentTheme.egg}
              </div>
              <p className="text-gray-400 mb-2 mt-4 text-sm sm:text-base">Click the {currentTheme.name} essence when it shakes!</p>
              <p className="text-xs text-gray-500 mb-4 sm:mb-6 px-2">Don't click at the wrong time or you'll disturb the dragon!</p>
              <button onClick={onStartGame} className="arcade-button text-sm sm:text-base px-4 py-2">
                START GATHERING
              </button>
            </div>
          ) : gameEnded && gameResult ? (
            <div className="text-center p-4">
              <div className={`text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 ${gameResult.success ? 'text-neon-green' : 'text-red-500'}`}>
                {gameResult.success ? '✓' : '✗'}
              </div>
              <h3 className={`font-arcade text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 ${gameResult.success ? 'text-neon-green' : 'text-red-500'}`}>
                {gameResult.success ? 'SUCCESS!' : 'FAILED'}
              </h3>
              {gameResult.success ? (
                <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                  <p className="text-gray-400 text-sm sm:text-base">Resources Gained:</p>
                  <p className="font-arcade text-xl sm:text-2xl md:text-3xl text-neon-yellow">
                    {gameResult.resourcesGained || 0}
                  </p>
                </div>
              ) : (
                <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                  <p className="text-gray-400 text-sm sm:text-base">
                    Successful Clicks: {successCount} | Misses: {missCount}
                  </p>
                  <p className="text-xs sm:text-sm text-red-400 px-2">
                    {gameResult.message || 'Not enough successful clicks'}
                  </p>
                </div>
              )}
              <button onClick={onResetGame} className="arcade-button text-sm sm:text-base px-4 py-2">
                TRY AGAIN
              </button>
            </div>
          ) : (
            <>
              {/* Dragon Egg */}
              <div
                onClick={onEggClick}
                className={`cursor-pointer select-none text-[6rem] sm:text-[8rem] md:text-[10rem] leading-[0] inline-block ${
                  shaking ? 'animate-shake' : ''
                } ${
                  clickable ? `${currentTheme.glow} scale-110 filter drop-shadow-2xl` : 'opacity-50 scale-100'
                } transition-all duration-200`}
                style={{ 
                  background: 'transparent',
                  padding: 0,
                  margin: 0,
                  border: 'none',
                  outline: 'none'
                }}
              >
                {currentTheme.egg}
              </div>

              {/* Feedback */}
              {feedback && (
                <div className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 font-arcade text-2xl sm:text-3xl md:text-4xl animate-bounce ${
                  feedback === 'success' ? 'text-neon-green' : 'text-red-500'
                }`}>
                  {feedback === 'success' ? '+1' : 'MISS'}
                </div>
              )}

              {/* Score */}
              <div className="absolute bottom-4 left-4 text-sm sm:text-base">
                <div className="text-neon-green">Success: {successCount}</div>
                <div className="text-red-500">Misses: {missCount}</div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GatheringGameField;
