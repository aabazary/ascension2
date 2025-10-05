import { TIER_THEMES } from '../../constants';

const GatheringTierSelection = ({ 
  selectedTier, 
  onTierSelect, 
  character, 
  gatheringConfig, 
  isPlaying 
}) => {
  const config = gatheringConfig?.tiers[selectedTier];

  return (
    <div className="arcade-panel mb-8">
      <h3 className="font-arcade text-sm text-neon-green mb-4 text-center">
        SELECT DRAGON TYPE
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 justify-center">
        {[0, 1, 2, 3, 4, 5].map((tier) => {
          const theme = TIER_THEMES[tier];
          return (
            <button
              key={tier}
              onClick={() => !isPlaying && tier <= Math.min(character.currentTier, 5) && onTierSelect(tier)}
              disabled={tier > Math.min(character.currentTier, 5) || isPlaying}
              className={`relative px-3 py-3 font-arcade text-xs rounded-lg transition-all ${
                selectedTier === tier
                  ? `bg-gradient-to-br ${theme.color} text-white ${theme.glow}`
                  : tier <= Math.min(character.currentTier, 5)
                  ? 'bg-dark-bg border border-dark-border hover:border-opacity-50'
                  : 'bg-dark-bg border border-dark-border opacity-30 cursor-not-allowed'
              }`}
              title={tier > Math.min(character.currentTier, 5) ? 'Locked' : theme.name}
            >
              <div className="text-2xl mb-1">{theme.egg}</div>
              <div className="text-xs">T{tier}</div>
              <div className="text-[10px] opacity-70">{theme.name}</div>
            </button>
          );
        })}
      </div>
      {config && (
        <div className="mt-4 text-center text-xs sm:text-sm text-gray-400 px-2">
          <p className="break-words">Total Buttons: {config.totalButtons} | Success Needed: {Math.ceil(config.totalButtons * config.successThreshold)} | Window: {config.buttonWindow}ms | Max Misses: 3</p>
        </div>
      )}
    </div>
  );
};

export default GatheringTierSelection;
