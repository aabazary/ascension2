import { useNavigate } from 'react-router-dom';

const ActivityButtons = ({ selectedCharacter }) => {
  const navigate = useNavigate();

  const handleGatheringClick = () => {
    navigate('/gathering', { state: { character: selectedCharacter } });
  };

  const handleBattleClick = () => {
    navigate('/battle', { state: { character: selectedCharacter } });
  };

  return (
    <div className="mb-12">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Gathering Button */}
        <button
          onClick={handleGatheringClick}
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
          onClick={handleBattleClick}
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
      </div>
    </div>
  );
};

export default ActivityButtons;
