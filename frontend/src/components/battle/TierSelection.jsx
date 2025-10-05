import { TIER_THEMES } from '../../constants';

const TierSelection = ({ 
  selectedTier, 
  onTierSelect, 
  character, 
  battleConfig, 
  isBattleStarted, 
  battleResult,
  isBossBattle = false
}) => {
  return (
    <div className="arcade-panel mb-8">
      <h3 className="font-arcade text-sm text-neon-green mb-4 text-center">
        {isBossBattle ? 'SELECT BOSS TIER' : 'SELECT MINION TIER'}
      </h3>
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 justify-center">
        {[0, 1, 2, 3, 4, 5, 6].map((tier) => {
          const theme = TIER_THEMES[tier];
          const tierConfig = battleConfig?.tiers[tier];
          
          // Special logic for Tier 6 - only available for boss battles and requires full Tier 6 gear
          const isTier6Available = tier === 6 ? 
            isBossBattle && character.equipment && 
            Object.values(character.equipment).every(equip => equip.tier === 6) : 
            tier <= character.currentTier;
          
          // Skip Tier 6 minion battles (no minion exists for Tier 6)
          if (tier === 6 && !isBossBattle) {
            return null;
          }
          
          return (
            <button
              key={tier}
              onClick={() => (!isBattleStarted || battleResult) && isTier6Available && onTierSelect(tier)}
              disabled={!isTier6Available || (isBattleStarted && !battleResult)}
              className={`relative px-3 py-3 font-arcade text-xs rounded-lg transition-all ${
                selectedTier === tier
                  ? `bg-gradient-to-br ${theme.color} text-white ${theme.glow}`
                  : isTier6Available
                  ? 'bg-dark-bg border border-dark-border hover:border-opacity-50'
                  : 'bg-dark-bg border border-dark-border opacity-30 cursor-not-allowed'
              }`}
              title={!isTier6Available ? 
                (tier === 6 && !isBossBattle ? 'No minion battle for Tier 6' :
                 tier === 6 && isBossBattle ? 'Requires full Tier 6 gear' :
                 'Locked') : 
                `${theme.name} - ${isBossBattle ? tierConfig?.bossName : tierConfig?.minionName}`}
            >
              <div className="mb-1">
                <img 
                  src={isBossBattle && tier === 6 ? 
                    `/mages/${character.avatar?.replace('_mage', '') || 'earth'}_mage.png` : 
                    (isBossBattle ? (tierConfig?.bossImage || '/dragons/mountain_wyrm.png') : (tierConfig?.minionImage || '/dragonling/earth__dragonling.png'))} 
                  alt={isBossBattle ? (tierConfig?.bossName || 'Dragon') : (tierConfig?.minionName || 'Dragonling')}
                  className={`w-8 h-8 mx-auto object-contain ${tier === 6 ? 'brightness-50 contrast-150 sepia' : ''}`}
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
