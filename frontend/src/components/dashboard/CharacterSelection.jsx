import CharacterModal from '../CharacterModal';

const CharacterSelection = ({
  characters,
  selectedCharacter,
  loading,
  onCharacterSelect,
  onCreateCharacter,
  isCharacterModalOpen,
  onOpenCharacterModal,
  onCloseCharacterModal,
  onCharacterCreated
}) => {
  if (loading) {
    return (
      <div className="mb-12 arcade-panel">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Loading characters...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12">
      <div className="arcade-panel">
        <h3 className="font-arcade text-lg text-neon-green mb-6 text-center">
          SELECT CHARACTER
        </h3>
        
        {characters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-400 mb-4">No characters found</p>
            <button
              onClick={onOpenCharacterModal}
              className="arcade-button px-6 py-3"
            >
              CREATE FIRST CHARACTER
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
              <button
                key={character._id}
                onClick={() => onCharacterSelect(character)}
                className={`p-4 rounded-lg border-2 transition-all text-left ${
                  selectedCharacter?._id === character._id
                    ? 'border-neon-green bg-neon-green bg-opacity-10'
                    : 'border-dark-border hover:border-gray-500'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <img
                    src={`/mages/${character.avatar}_mage.png`}
                    alt={character.name}
                    className="w-8 h-8 object-contain"
                  />
                  <div>
                    <h4 className="font-arcade text-white">{character.name}</h4>
                    <p className="text-xs text-gray-400">
                      Tier {character.currentTier}
                    </p>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {character.stats.wins}W / {character.stats.losses}L
                </div>
              </button>
            ))}
            
            <button
              onClick={onOpenCharacterModal}
              className="p-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-neon-pink transition-colors text-center"
            >
              <div className="text-2xl mb-2">+</div>
              <div className="text-sm text-gray-400">Create New Character</div>
            </button>
          </div>
        )}
      </div>

      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={onCloseCharacterModal}
        onCharacterCreated={onCharacterCreated}
      />
    </div>
  );
};

export default CharacterSelection;
