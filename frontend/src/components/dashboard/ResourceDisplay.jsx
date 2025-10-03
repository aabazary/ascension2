const ResourceDisplay = ({ character }) => {
  return (
    <div className="mb-12 arcade-panel">
      <h3 className="font-arcade text-lg text-neon-green mb-6 text-center">
        CURRENT TIER RESOURCES
      </h3>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {/* Gathering Resources */}
        <div className="text-center p-2 sm:p-4 bg-dark-bg rounded-lg border border-dark-border">
          <div className="text-2xl sm:text-3xl mb-2">✨</div>
          <div className="font-arcade text-xs sm:text-sm text-neon-green mb-2 break-words">GATHERING</div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {character.resources?.gathering?.[character.currentTier] || 0}
          </div>
        </div>

        {/* Minion Resources */}
        <div className="text-center p-2 sm:p-4 bg-dark-bg rounded-lg border border-dark-border">
          <div className="text-2xl sm:text-3xl mb-2">⚔️</div>
          <div className="font-arcade text-xs sm:text-sm text-neon-pink mb-2 break-words">MINION</div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {character.resources?.minion?.[character.currentTier] || 0}
          </div>
        </div>

        {/* Boss Resources */}
        <div className="text-center p-2 sm:p-4 bg-dark-bg rounded-lg border border-dark-border">
          <div className="text-2xl sm:text-3xl mb-2">👑</div>
          <div className="font-arcade text-xs sm:text-sm text-neon-yellow mb-2 break-words">BOSS</div>
          <div className="text-lg sm:text-2xl font-bold text-white">
            {character.resources?.boss?.[character.currentTier] || 0}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceDisplay;
