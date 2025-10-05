import { createContext, useContext, useState, useEffect } from 'react';
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

export const CharacterProvider = ({ children }) => {
  // Initialize selected character from localStorage immediately
  const [selectedCharacter, setSelectedCharacter] = useState(() => {
    try {
      const selectedCharacterId = localStorage.getItem('selectedCharacterId');
      const cachedCharacter = localStorage.getItem('cachedCharacter');
      
      if (selectedCharacterId && cachedCharacter) {
        const parsedCharacter = JSON.parse(cachedCharacter);
        // Verify it's the same character ID
        if (parsedCharacter._id === selectedCharacterId) {
          return parsedCharacter;
        }
      }
    } catch (error) {
      console.error('Failed to restore character from localStorage:', error);
    }
    return null;
  });
  const [characters, setCharacters] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load characters from API
  const loadCharacters = async () => {
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
        if (!selectedCharacter && charactersData.length > 0) {
          setSelectedCharacter(charactersData[0]);
        }
      }
    } catch (error) {
      console.error('Failed to load characters:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Select a character by ID
  const selectCharacter = (characterId) => {
    const character = characters.find(char => char._id === characterId);
    if (character) {
      setSelectedCharacter(character);
      // Store selected character ID and data in localStorage for persistence
      localStorage.setItem('selectedCharacterId', characterId);
      localStorage.setItem('cachedCharacter', JSON.stringify(character));
    }
  };

  // Update character data (for upgrades, battles, etc.)
  const updateCharacter = (updatedCharacter) => {
    if (!updatedCharacter) return;
    
    // Update in characters array
    setCharacters(prev => prev.map(char => 
      char._id === updatedCharacter._id ? updatedCharacter : char
    ));
    
    // Update cache
    charactersCache.data = characters.map(char => 
      char._id === updatedCharacter._id ? updatedCharacter : char
    );
    charactersCache.timestamp = Date.now();
    
    // Update selected character if it's the same one
    if (selectedCharacter && selectedCharacter._id === updatedCharacter._id) {
      setSelectedCharacter(updatedCharacter);
      // Update localStorage cache
      localStorage.setItem('cachedCharacter', JSON.stringify(updatedCharacter));
    }
  };

  // Update selected character when characters are loaded
  useEffect(() => {
    const selectedCharacterId = localStorage.getItem('selectedCharacterId');
    if (selectedCharacterId && characters.length > 0) {
      const character = characters.find(char => char._id === selectedCharacterId);
      if (character && (!selectedCharacter || selectedCharacter._id !== character._id)) {
        setSelectedCharacter(character);
        // Update localStorage cache with fresh data
        localStorage.setItem('cachedCharacter', JSON.stringify(character));
      }
    } else if (characters.length > 0 && !selectedCharacter) {
      // If no character selected but we have characters, select the first one
      setSelectedCharacter(characters[0]);
      localStorage.setItem('selectedCharacterId', characters[0]._id);
      localStorage.setItem('cachedCharacter', JSON.stringify(characters[0]));
    }
  }, [characters, selectedCharacter]);

  // Load characters on mount
  useEffect(() => {
    loadCharacters();
  }, []);

  const value = {
    selectedCharacter,
    characters,
    isLoading,
    selectCharacter,
    updateCharacter,
    loadCharacters
  };

  return (
    <CharacterContext.Provider value={value}>
      {children}
    </CharacterContext.Provider>
  );
};
