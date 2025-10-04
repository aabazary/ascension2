import React from 'react';
import { useNavigate } from 'react-router-dom';

const ActivityButtons = ({ character }) => {
  const navigate = useNavigate();

  if (!character) return null;

  return (
    <div className="mb-12">
      <h3 className="font-arcade text-lg text-neon-green mb-6 text-center">
        ACTIVITIES
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Gathering Button */}
        <button
          onClick={() => navigate('/gathering', { state: { character } })}
          className="arcade-panel p-8 text-center hover:scale-105 transition-transform group"
        >
          <div className="text-6xl mb-4 group-hover:animate-bounce">✨</div>
          <h3 className="font-arcade text-2xl text-neon-green mb-4">GATHERING</h3>
          <p className="text-gray-400 text-sm mb-4">
            Collect essence from dragon eggs. Test your reflexes and timing!
          </p>
          <div className="text-xs text-gray-500">
            Click eggs when they glow to gather resources
          </div>
        </button>

        {/* Battle Button */}
        <button
          onClick={() => navigate('/battle', { state: { character } })}
          className="arcade-panel p-8 text-center hover:scale-105 transition-transform group"
        >
          <div className="text-6xl mb-4 group-hover:animate-bounce">⚔️</div>
          <h3 className="font-arcade text-2xl text-neon-pink mb-4">BATTLE</h3>
          <p className="text-gray-400 text-sm mb-4">
            Fight elemental minions in turn-based combat. Strategy and luck!
          </p>
          <div className="text-xs text-gray-500">
            Choose spells and defeat powerful enemies
          </div>
        </button>

        {/* Boss Battle Button */}
        <button
          onClick={() => navigate('/boss-battle', { state: { character } })}
          className="arcade-panel p-8 text-center hover:scale-105 transition-transform group"
        >
          <div className="text-6xl mb-4 group-hover:animate-bounce">🐉</div>
          <h3 className="font-arcade text-2xl text-red-500 mb-4">BOSS BATTLE</h3>
          <p className="text-gray-400 text-sm mb-4">
            Face mighty elemental dragons! Ultimate challenge awaits!
          </p>
          <div className="text-xs text-gray-500">
            Epic battles against legendary dragons
          </div>
        </button>
      </div>
    </div>
  );
};

export default ActivityButtons;
