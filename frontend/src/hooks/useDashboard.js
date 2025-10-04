import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { charactersCache, invalidateCharacterCache, clearAllCaches, subscribeToCacheUpdates } from '../utils/cacheUtils';

export const useDashboard = (setIsAuthenticated, setUserData) => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState(null);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    return charactersCache.data && 
           (Date.now() - charactersCache.timestamp) < charactersCache.ttl;
  }, []);

  useEffect(() => {
    // Use cached data if available and valid
    if (isCacheValid) {
      setCharacters(charactersCache.data);
      if (charactersCache.data.length > 0) {
        selectCharacterFromStorage(charactersCache.data);
      }
      setLoading(false);
      return;
    }
    
    fetchCharacters();
  }, [isCacheValid]);

  // Subscribe to cache updates to keep selected character in sync
  useEffect(() => {
    const unsubscribe = subscribeToCacheUpdates((updatedCharacters) => {
      setCharacters(updatedCharacters);
      
      // Update selected character if it exists in the updated data
      if (selectedCharacter) {
        const updatedSelectedCharacter = updatedCharacters.find(char => char._id === selectedCharacter._id);
        if (updatedSelectedCharacter) {
          setSelectedCharacter(updatedSelectedCharacter);
        }
      }
    });

    return unsubscribe;
  }, [selectedCharacter]);

  // Helper function to select character from localStorage or default to first
  const selectCharacterFromStorage = (characters) => {
    const savedCharacterId = localStorage.getItem('selectedCharacterId');
    if (savedCharacterId) {
      const savedCharacter = characters.find(char => char._id === savedCharacterId);
      if (savedCharacter) {
        setSelectedCharacter(savedCharacter);
        return;
      }
    }
    // Fallback to first character if no saved character found
    setSelectedCharacter(characters[0]);
  };

  // Enhanced setSelectedCharacter that also saves to localStorage
  const handleCharacterSelect = (character) => {
    setSelectedCharacter(character);
    localStorage.setItem('selectedCharacterId', character._id);
  };

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/characters');
      if (response.data.success) {
        const charactersData = response.data.characters;
        setCharacters(charactersData);
        
        // Update cache
        charactersCache.data = charactersData;
        charactersCache.timestamp = Date.now();
        
        if (charactersData.length > 0) {
          selectCharacterFromStorage(charactersData);
        }
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
      // Use cached data if available, even if expired
      if (charactersCache.data) {
        setCharacters(charactersCache.data);
      if (charactersCache.data.length > 0) {
        selectCharacterFromStorage(charactersCache.data);
      }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCharacterCreated = async () => {
    // Invalidate cache and fetch fresh data
    invalidateCharacterCache();
    await fetchCharacters();
    setIsCharacterModalOpen(false);
  };

  const handleEditCharacter = (character) => {
    setCharacterToEdit(character);
    setIsCharacterEditModalOpen(true);
  };

  const handleCharacterUpdated = async () => {
    // Invalidate cache and fetch fresh data
    invalidateCharacterCache();
    await fetchCharacters();
    setIsCharacterEditModalOpen(false);
    setCharacterToEdit(null);
  };

  const handleDeleteCharacter = (character) => {
    setCharacterToDelete(character);
    setIsConfirmModalOpen(true);
  };

  const confirmDeleteCharacter = async () => {
    if (!characterToDelete) return;

    try {
      const response = await api.delete(`/characters/${characterToDelete._id}`);
      if (response.data.success) {
        // Invalidate cache and fetch fresh data
        invalidateCharacterCache();
        await fetchCharacters();
        
        // If we deleted the selected character, select the first available one
        if (selectedCharacter?._id === characterToDelete._id) {
          if (charactersCache.data && charactersCache.data.length > 0) {
            handleCharacterSelect(charactersCache.data[0]);
          } else {
            setSelectedCharacter(null);
            localStorage.removeItem('selectedCharacterId');
          }
        }
      }
    } catch (error) {
      console.error('Failed to delete character:', error);
    } finally {
      setIsConfirmModalOpen(false);
      setCharacterToDelete(null);
    }
  };

  const handleCreateCharacter = () => {
    if (characters.length >= 3) {
      return; // Don't show modal if already at max
    }
    setIsCharacterModalOpen(true);
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('user');
      setUserData(null);
      setIsAuthenticated(false);
      clearAllCaches(); // Clear all caches on logout
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('user');
      setUserData(null);
      setIsAuthenticated(false);
      clearAllCaches(); // Clear all caches on logout
      navigate('/');
    }
  };

  const handleProfileUpdated = (updatedUserData) => {
    setUserData(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  return {
    // State
    characters,
    selectedCharacter,
    isCharacterModalOpen,
    isCharacterEditModalOpen,
    isConfirmModalOpen,
    characterToEdit,
    characterToDelete,
    loading,
    
    // Actions
    setSelectedCharacter: handleCharacterSelect,
    setIsCharacterModalOpen,
    setIsCharacterEditModalOpen,
    setIsConfirmModalOpen,
    handleCharacterCreated,
    handleEditCharacter,
    handleCharacterUpdated,
    handleDeleteCharacter,
    confirmDeleteCharacter,
    handleCreateCharacter,
    handleLogout,
    handleProfileUpdated
  };
};
