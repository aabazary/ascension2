import React from 'react';

const CharacterStats = ({ character }) => {
  if (!character) return null;

  return (
    <div className="arcade-panel">
      <h3 className="font-arcade text-lg text-neon-purple mb-4 text-center">
        CHARACTER STATS
      </h3>
      <div className="space-y-4">
        {/* Basic Info */}
        <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
          <h4 className="text-neon-green font-medium mb-2">Basic Information</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Name:</span>
              <span className="font-arcade text-white">{character.name}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Avatar:</span>
              <span className="font-arcade text-white capitalize">{character.avatar?.replace('_mage', '') || 'earth'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Tier:</span>
              <span className="font-arcade text-neon-green">Tier {character.currentTier}</span>
            </div>
          </div>
        </div>

        {/* Battle Stats */}
        <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
          <h4 className="text-neon-pink font-medium mb-2">Battle Statistics</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Total Wins:</span>
              <span className="font-arcade text-neon-yellow">{character.stats.totalWins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Current Wins:</span>
              <span className="font-arcade text-green-400">{character.stats.wins || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Losses:</span>
              <span className="font-arcade text-red-400">{character.stats.losses || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Win Rate:</span>
              <span className="font-arcade text-blue-400">
                {character.stats.wins && character.stats.losses 
                  ? Math.round((character.stats.wins / (character.stats.wins + character.stats.losses)) * 100)
                  : character.stats.wins ? 100 : 0}%
              </span>
            </div>
          </div>
        </div>

        {/* Equipment Stats */}
        <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
          <h4 className="text-neon-yellow font-medium mb-2">Equipment</h4>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ring Tier:</span>
              <span className="font-arcade text-yellow-400">T{character.equipment?.ring?.tier || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Cloak Tier:</span>
              <span className="font-arcade text-purple-400">T{character.equipment?.cloak?.tier || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Ring Infused:</span>
              <span className="font-arcade text-green-400">
                {character.equipment?.ring?.infused ? 'YES' : 'NO'}
              </span>
            </div>
            {character.equipment?.ring?.infused && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Infusion Level:</span>
                <span className="font-arcade text-blue-400">+{character.equipment?.ring?.infusionLevel || 0}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterStats;
