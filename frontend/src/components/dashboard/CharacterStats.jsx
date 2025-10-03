const CharacterStats = ({ character, totalResources }) => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Character Stats */}
      <div className="arcade-panel">
        <h3 className="font-arcade text-lg text-neon-purple mb-4 text-center">
          CHARACTER STATS
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Name:</span>
            <span className="font-arcade text-white">{character.name}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Avatar:</span>
            <span className="font-arcade text-white capitalize">{character.avatar}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Current Tier:</span>
            <span className="font-arcade text-neon-green">Tier {character.currentTier}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Wins:</span>
            <span className="font-arcade text-neon-yellow">{character.stats.totalWins || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Wins:</span>
            <span className="font-arcade text-green-400">{character.stats.wins || 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Losses:</span>
            <span className="font-arcade text-red-400">{character.stats.losses || 0}</span>
          </div>
        </div>
      </div>

      {/* Resource Summary */}
      <div className="arcade-panel">
        <h3 className="font-arcade text-lg text-neon-blue mb-4 text-center">
          RESOURCE SUMMARY
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Total Resources:</span>
            <span className="font-arcade text-neon-yellow">{totalResources}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Gathering:</span>
            <span className="font-arcade text-neon-green">
              {Object.values(character.resources?.gathering || {}).reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Minion:</span>
            <span className="font-arcade text-neon-pink">
              {Object.values(character.resources?.minion || {}).reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Boss:</span>
            <span className="font-arcade text-neon-yellow">
              {Object.values(character.resources?.boss || {}).reduce((a, b) => a + b, 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;
