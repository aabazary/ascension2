import { TIER_THEMES } from '../../constants';

const TierSelection = ({ selectedTier, characterTier, isPlaying, onTierSelect, config }) => {
  return (
    <div className="arcade-panel mb-8">
      <h3 className="font-arcade text-sm text-neon-green mb-4 text-center">
        SELECT DRAGON TYPE
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 justify-center">
        {[0, 1, 2, 3, 4, 5].map((tier) => {
          const theme = TIER_THEMES[tier];
          const isLocked = tier > characterTier;
          const isSelected = selectedTier === tier;
          
          return (
            <button
              key={tier}
              onClick={() => !isPlaying && onTierSelect(tier)}
              disabled={isLocked || isPlaying}
              className={`relative px-3 py-3 font-arcade text-xs rounded-lg transition-all ${
                isSelected
                  ? `bg-gradient-to-br ${theme.color} text-white ${theme.glow}`
                  : isLocked
                  ? 'bg-dark-bg border border-dark-border opacity-30 cursor-not-allowed'
                  : 'bg-dark-bg border border-dark-border hover:border-opacity-50'
              }`}
              title={isLocked ? 'Locked - Progress to unlock' : theme.name}
            >
              <div className="text-2xl mb-1">{theme.egg}</div>
              <div className="text-xs">T{tier}</div>
              <div className="text-[10px] opacity-70">{theme.name}</div>
              {isLocked && (
                <div className="absolute top-1 right-1 text-xs">🔒</div>
              )}
            </button>
          );
        })}
      </div>
      
      {config && (
        <div className="mt-4 text-center text-xs text-gray-400">
          <p>Target: {config.successThreshold} successes out of {config.totalButtons} attempts</p>
          <p>Click window: {config.buttonWindow}ms</p>
        </div>
      )}
    </div>
  );
};

export default TierSelection;
