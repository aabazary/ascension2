import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { clearAllCaches } from '../utils/cacheUtils';
import { useCharacter } from '../contexts/CharacterContext';

export const useDashboard = (setIsAuthenticated, setUserData) => {
  const { characters, selectedCharacter, selectCharacter, updateCharacter } = useCharacter();
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState(null);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const navigate = useNavigate();

  // Enhanced setSelectedCharacter that uses context
  const handleCharacterSelect = (character) => {
    selectCharacter(character._id);
  };

  const handleCharacterCreated = async () => {
    // Characters will be automatically updated by the context
    setIsCharacterModalOpen(false);
  };

  const handleEditCharacter = (character) => {
    setCharacterToEdit(character);
    setIsCharacterEditModalOpen(true);
  };

  const handleCharacterUpdated = async () => {
    // Characters will be automatically updated by the context
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
        // Characters will be automatically updated by the context
        // If we deleted the selected character, the context will handle selection
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
