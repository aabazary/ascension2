import React from 'react';

const ResourceSummary = ({ character }) => {
  if (!character) return null;

  const calculateTotalResources = (character) => {
    if (!character?.resources) return 0;
    
    const gathering = Object.values(character.resources.gathering || {}).reduce((a, b) => a + b, 0);
    const minion = Object.values(character.resources.minion || {}).reduce((a, b) => a + b, 0);
    const boss = Object.values(character.resources.boss || {}).reduce((a, b) => a + b, 0);
    
    return gathering + minion + boss;
  };

  return (
    <div className="arcade-panel">
      <h3 className="font-arcade text-lg text-neon-blue mb-4 text-center">
        RESOURCE SUMMARY
      </h3>
      
      {/* Total Resources */}
      <div className="mb-4 p-3 bg-dark-bg rounded-lg border border-dark-border">
        <div className="flex justify-between items-center">
          <span className="text-gray-300 font-medium">Total Resources:</span>
          <span className="font-arcade text-xl text-neon-yellow">{calculateTotalResources(character)}</span>
        </div>
      </div>

      {/* Resource Breakdown by Type */}
      <div className="space-y-4">
        {/* Gathering Resources */}
        <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neon-green font-medium">✨ Gathering</span>
            <span className="font-arcade text-neon-green">
              {Object.values(character.resources?.gathering || {}).reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1 text-xs">
            {[0, 1, 2, 3, 4, 5].map(tier => (
              <div key={tier} className="text-center">
                <div className="text-gray-400">T{tier}</div>
                <div className="text-white font-mono">
                  {character.resources?.gathering?.[tier] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Minion Resources */}
        <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neon-pink font-medium">⚔️ Minion</span>
            <span className="font-arcade text-neon-pink">
              {Object.values(character.resources?.minion || {}).reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1 text-xs">
            {[0, 1, 2, 3, 4, 5].map(tier => (
              <div key={tier} className="text-center">
                <div className="text-gray-400">T{tier}</div>
                <div className="text-white font-mono">
                  {character.resources?.minion?.[tier] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Boss Resources */}
        <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
          <div className="flex justify-between items-center mb-2">
            <span className="text-neon-yellow font-medium">👑 Boss</span>
            <span className="font-arcade text-neon-yellow">
              {Object.values(character.resources?.boss || {}).reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="grid grid-cols-6 gap-1 text-xs">
            {[0, 1, 2, 3, 4, 5].map(tier => (
              <div key={tier} className="text-center">
                <div className="text-gray-400">T{tier}</div>
                <div className="text-white font-mono">
                  {character.resources?.boss?.[tier] || 0}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourceSummary;
