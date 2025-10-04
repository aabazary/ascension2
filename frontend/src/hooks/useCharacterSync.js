import { useState, useEffect } from 'react';
import { subscribeToCacheUpdates, getCharacterFromCache, initializeCharacterCache } from '../utils/cacheUtils';

// Hook to keep a character in sync with cache updates
export const useCharacterSync = (initialCharacter) => {
  const [character, setCharacter] = useState(initialCharacter);

  useEffect(() => {
    // Update character when initial character changes
    setCharacter(initialCharacter);
    
    // Initialize cache if it doesn't exist and we have a character
    if (initialCharacter && !getCharacterFromCache(initialCharacter._id)) {
      initializeCharacterCache(initialCharacter);
    }
  }, [initialCharacter]);

  useEffect(() => {
    if (!character?._id) return;

    // Subscribe to cache updates to keep character in sync
    const unsubscribe = subscribeToCacheUpdates((updatedCharacters) => {
      const updatedCharacter = updatedCharacters.find(char => char._id === character._id);
      if (updatedCharacter) {
        setCharacter(updatedCharacter);
      }
    });

    return unsubscribe;
  }, [character?._id]);

  return character;
};
