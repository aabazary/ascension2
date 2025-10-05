import React from 'react';

const CombatLog = ({ combatLog, isBattleStarted }) => {
  if (!isBattleStarted) return null;

  return (
    <div className="arcade-panel mb-6">
      <h3 className="font-arcade text-sm text-neon-purple mb-3 text-center">
        COMBAT LOG
      </h3>
      <div className="bg-black/50 rounded-lg p-3 max-h-32 overflow-y-auto">
        {combatLog.length === 0 ? (
          <div className="text-gray-500 text-sm text-center">Battle log will appear here...</div>
        ) : (
          <div className="space-y-1">
            {combatLog.map((entry) => (
              <div 
                key={entry.id} 
                className={`text-xs ${
                  entry.type === 'vulnerable' ? 'text-yellow-400 font-bold animate-pulse' :
                  entry.type === 'crit' ? 'text-orange-400 font-bold' :
                  entry.type === 'damage' ? 'text-red-400' :
                  entry.type === 'miss' ? 'text-gray-400' :
                  entry.type === 'action' ? 'text-blue-400' :
                  'text-neon-purple'
                }`}
              >
                {entry.message}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombatLog;
