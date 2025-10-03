import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

export const useDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
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
      setSelectedCharacter(response.data.characters[response.data.characters.length - 1]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const calculateTotalResources = (character) => {
    if (!character?.resources) return 0;
    
    const gathering = Object.values(character.resources.gathering || {}).reduce((a, b) => a + b, 0);
    const minion = Object.values(character.resources.minion || {}).reduce((a, b) => a + b, 0);
    const boss = Object.values(character.resources.boss || {}).reduce((a, b) => a + b, 0);
    
    return gathering + minion + boss;
  };

  return {
    userData,
    characters,
    selectedCharacter,
    isCharacterModalOpen,
    loading,
    navigate,
    setSelectedCharacter,
    setIsCharacterModalOpen,
    fetchCharacters,
    handleCharacterCreated,
    handleLogout,
    calculateTotalResources,
  };
};
