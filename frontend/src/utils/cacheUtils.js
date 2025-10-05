// Cache for characters data
export const charactersCache = {
  data: null,
  timestamp: 0,
  ttl: 2 * 60 * 1000 // 2 minutes cache
};


// Function to update character cache with new resource data
export const updateCharacterCache = (characterId, resourceType, tier, amount) => {
  if (!charactersCache.data) {
    console.log('Cache is empty, skipping update');
    return;
  }
  
  // Find the character in cache and update their resources
  const updatedCharacters = charactersCache.data.map(character => {
    if (character._id === characterId) {
      return {
        ...character,
        resources: {
          ...character.resources,
          [resourceType]: {
            ...character.resources[resourceType],
            [tier]: (character.resources[resourceType]?.[tier] || 0) + amount
          }
        }
      };
    }
    return character;
  });
  
  charactersCache.data = updatedCharacters;
  charactersCache.timestamp = Date.now();
  
};

// Function to update character cache with full character data (for upgrades, etc.)
export const updateCharacterCacheFull = (updatedCharacter) => {
  if (!charactersCache.data) {
    console.log('Cache is empty, skipping update');
    return;
  }
  
  // Find the character in cache and replace with updated data
  const updatedCharacters = charactersCache.data.map(character => {
    if (character._id === updatedCharacter._id) {
      return updatedCharacter;
    }
    return character;
  });
  
  charactersCache.data = updatedCharacters;
  charactersCache.timestamp = Date.now();
  
};


// Function to clear all caches (useful for logout)
export const clearAllCaches = () => {
  charactersCache.data = null;
  charactersCache.timestamp = 0;
  
  // Clear other caches if they exist
  if (typeof window !== 'undefined') {
    // Clear any localStorage cache entries (but preserve user data)
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('cache_') || key === 'selectedCharacterId' || key === 'cachedCharacter')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
  }
};

