import { TIER_THEMES } from '../../constants';

const TierSelection = ({ 
  selectedTier, 
  onTierSelect, 
  character, 
  battleConfig, 
  isBattleStarted, 
  battleResult 
}) => {
  return (
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
              onClick={() => (!isBattleStarted || battleResult) && tier <= character.currentTier && onTierSelect(tier)}
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
    </div>
  );
};

export default TierSelection;
