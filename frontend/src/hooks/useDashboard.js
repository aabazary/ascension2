import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { clearAllCaches } from '../utils/cacheUtils';
import { useCharacter } from '../contexts/CharacterContext';

export const useDashboard = (setIsAuthenticated, setUserData, userData) => {
  const { characters, selectedCharacter, selectCharacter, updateCharacter, resetCharacters, loadCharacters, isLoading } = useCharacter();
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState(null);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const navigate = useNavigate();

  // Reset dashboard state when user changes
  useEffect(() => {
    if (userData) {
      setIsCharacterModalOpen(false);
      setIsCharacterEditModalOpen(false);
      setIsConfirmModalOpen(false);
      setCharacterToEdit(null);
      setCharacterToDelete(null);
    }
  }, [userData?._id || userData?.id]);

  // Enhanced setSelectedCharacter that uses context
  const handleCharacterSelect = (character) => {
    selectCharacter(character._id);
  };

  const handleCharacterCreated = async () => {
    // Reload characters to show the newly created one
    await loadCharacters();
    setIsCharacterModalOpen(false);
  };

  const handleEditCharacter = (character) => {
    setCharacterToEdit(character);
    setIsCharacterEditModalOpen(true);
  };

  const handleCharacterUpdated = async () => {
    // Reload characters to show the updated one
    await loadCharacters();
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
        // Reload characters to reflect the deletion
        await loadCharacters();
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
      sessionStorage.removeItem('user');
      setUserData(null);
      setIsAuthenticated(false);
      clearAllCaches(); // Clear all caches on logout
      resetCharacters(); // Reset character context state
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      sessionStorage.removeItem('user');
      setUserData(null);
      setIsAuthenticated(false);
      clearAllCaches(); // Clear all caches on logout
      resetCharacters(); // Reset character context state
      navigate('/');
    }
  };

  const handleProfileUpdated = (updatedUserData) => {
    setUserData(updatedUserData);
    sessionStorage.setItem('user', JSON.stringify(updatedUserData));
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
            loading: isLoading, // Add loading state from context
    
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
