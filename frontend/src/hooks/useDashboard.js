import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const useDashboard = (setIsAuthenticated) => {
  const [userData, setUserData] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
  const [isCharacterEditModalOpen, setIsCharacterEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [characterToEdit, setCharacterToEdit] = useState(null);
  const [characterToDelete, setCharacterToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUserData(JSON.parse(userStr));
    }
    fetchCharacters();
  }, []);

  const fetchCharacters = async () => {
    try {
      setLoading(true);
      const response = await api.get('/characters');
      if (response.data.success) {
        setCharacters(response.data.characters);
        if (response.data.characters.length > 0) {
          setSelectedCharacter(response.data.characters[0]);
        }
      }
    } catch (error) {
      console.error('Failed to fetch characters:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCharacterCreated = async () => {
    await fetchCharacters();
    // Select the newly created character (last one in the list)
    const response = await api.get('/characters');
    if (response.data.success && response.data.characters.length > 0) {
      const newCharacter = response.data.characters[response.data.characters.length - 1];
      setSelectedCharacter(newCharacter);
    }
    setIsCharacterModalOpen(false);
  };

  const handleEditCharacter = (character) => {
    setCharacterToEdit(character);
    setIsCharacterEditModalOpen(true);
  };

  const handleCharacterUpdated = async () => {
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
        await fetchCharacters();
        // If we deleted the selected character, select the first available one
        if (selectedCharacter?._id === characterToDelete._id) {
          const response = await api.get('/characters');
          if (response.data.success && response.data.characters.length > 0) {
            setSelectedCharacter(response.data.characters[0]);
          } else {
            setSelectedCharacter(null);
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
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  const handleProfileUpdated = (updatedUserData) => {
    setUserData(updatedUserData);
    localStorage.setItem('user', JSON.stringify(updatedUserData));
  };

  return {
    // State
    userData,
    characters,
    selectedCharacter,
    isCharacterModalOpen,
    isCharacterEditModalOpen,
    isConfirmModalOpen,
    characterToEdit,
    characterToDelete,
    loading,
    
    // Actions
    setSelectedCharacter,
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
