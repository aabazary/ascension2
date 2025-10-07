import { createContext, useContext, useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import { charactersCache } from '../utils/cacheUtils';

const CharacterContext = createContext();

export const useCharacter = () => {
  const context = useContext(CharacterContext);
  if (!context) {
    throw new Error('useCharacter must be used within a CharacterProvider');
  }
  return context;
};

export const CharacterProvider = ({ children, userData }) => {
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const loadingRef = useRef(false);

  // Reset character context state (useful for user changes)
  const resetCharacters = () => {
    setSelectedCharacter(null);
    setCharacters([]);
    setIsLoading(true);
  };

  // Load characters from API
  const loadCharacters = async (retryCount = 0) => {
    // Prevent duplicate calls
    if (loadingRef.current) {
      return;
    }
    
    loadingRef.current = true;
    setIsLoading(true);
    
    try {
      const response = await api.get('/characters');
      if (response.data.success) {
        const charactersData = response.data.characters;
        
        setCharacters(charactersData);
        
        // Update cache
        charactersCache.data = charactersData;
        charactersCache.timestamp = Date.now();
        
        // If no character is selected but we have characters, select the first one
        if (charactersData.length > 0) {
          setSelectedCharacter(charactersData[0]);
        }
        
        // Set loading to false when we have a definitive result
        setIsLoading(false);
        loadingRef.current = false;
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
      // If authentication fails, try again in a bit
      if (error.response?.status === 401) {
        setTimeout(() => loadCharacters(retryCount + 1), 1000);
      } else {
        // Only set loading to false if we're not retrying
        setIsLoading(false);
        loadingRef.current = false;
      }
    }
  };

  // Select a character by ID
  const selectCharacter = (characterId) => {
    const character = characters.find(char => char._id === characterId);
    if (character) {
      setSelectedCharacter(character);
    }
  };

  // Update character data (for upgrades, battles, etc.)
  const updateCharacter = (updatedCharacter) => {
    if (!updatedCharacter) return;
    
    // Update in characters array
    setCharacters(prev => {
      const updated = prev.map(char => 
        char._id === updatedCharacter._id ? updatedCharacter : char
      );
      
      // Update cache with the new array
      charactersCache.data = updated;
      charactersCache.timestamp = Date.now();
      
      return updated;
    });
    
    // Update selected character if it's the same one
    if (selectedCharacter && selectedCharacter._id === updatedCharacter._id) {
      setSelectedCharacter(updatedCharacter);
    }
  };

  // Auto-select first character when characters are loaded
  useEffect(() => {
    if (characters.length > 0 && !selectedCharacter) {
      // If no character selected but we have characters, select the first one
      setSelectedCharacter(characters[0]);
    }
  }, [characters, selectedCharacter]);

  // Reset and reload characters when user changes
  useEffect(() => {
    if (userData) {
      // Reset state first to clear any previous user's data
      resetCharacters();
      // Force a complete reset by clearing cache
      charactersCache.data = null;
      charactersCache.timestamp = 0;
      // Then load fresh characters for the new user
      setTimeout(() => {
        loadCharacters();
      }, 100);
    } else {
      // No user data, reset everything
      resetCharacters();
      charactersCache.data = null;
      charactersCache.timestamp = 0;
    }
  }, [userData?._id || userData?.id]); // Use userData._id or userData.id

  // Note: sessionStorage events don't work across tabs, so we rely on userData prop changes


  const value = {
    selectedCharacter,
    characters,
    isLoading,
    selectCharacter,
    updateCharacter,
    loadCharacters,
    resetCharacters
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};
