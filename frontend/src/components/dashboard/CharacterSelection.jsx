import React from 'react';
import { getAvatarImage } from '../../constants/avatars';

const CharacterSelection = ({ 
  characters, 
  selectedCharacter, 
  onCharacterSelect, 
  onCreateCharacter, 
  onEditCharacter, 
  onDeleteCharacter 
}) => {
  // Use shared avatar helper function

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
              onClick={onCreateCharacter}
              className="arcade-button px-6 py-3"
            >
              CREATE FIRST CHARACTER
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {characters.map((character) => (
              <div
                key={character._id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedCharacter?._id === character._id
                    ? 'border-neon-green bg-neon-green bg-opacity-10'
                    : 'border-dark-border hover:border-gray-500'
                }`}
              >
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => onCharacterSelect(character)}
                    className="flex-1 text-left"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <img
                        src={getAvatarImage(character.avatar)}
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
                  
                  {/* Edit and Delete buttons */}
                  <div className="flex flex-col gap-2 ml-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditCharacter(character);
                      }}
                      className="p-2 bg-blue-600 hover:bg-blue-700 border border-blue-600 rounded transition-colors"
                      title="Edit Character"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteCharacter(character);
                      }}
                      className="p-2 bg-red-600 hover:bg-red-700 border border-red-600 rounded transition-colors"
                      title="Delete Character"
                    >
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Create New Character Button */}
            {characters.length < 3 && (
              <div className="p-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-neon-green transition-colors">
                <button
                  onClick={onCreateCharacter}
                  className="w-full h-full flex flex-col items-center justify-center py-8 text-gray-400 hover:text-neon-green transition-colors"
                >
                  <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span className="font-arcade text-sm">CREATE CHARACTER</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CharacterSelection;
