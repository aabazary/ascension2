const CombatLog = ({ combatLog }) => {
  const getLogColor = (type) => {
    switch (type) {
      case 'action': return 'text-blue-400';
      case 'damage': return 'text-red-400';
      case 'miss': return 'text-yellow-400';
      case 'crit': return 'text-purple-400';
      case 'turn': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="arcade-panel">
      <h3 className="font-arcade text-sm text-neon-green mb-4 text-center">COMBAT LOG</h3>
      <div className="max-h-32 overflow-y-auto space-y-1">
        {combatLog.length === 0 ? (
          <p className="text-gray-500 text-sm text-center">No combat activity yet...</p>
        ) : (
          combatLog.map((entry) => (
            <div key={entry.id} className="text-xs">
              <span className="text-gray-500">
                {new Date(entry.timestamp).toLocaleTimeString()}
              </span>
              <span className={`ml-2 ${getLogColor(entry.type)}`}>
                {entry.message}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CombatLog;
