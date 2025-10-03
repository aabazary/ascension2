import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CharacterModal from '../components/CharacterModal';
import CharacterEditModal from '../components/CharacterEditModal';
import ConfirmModal from '../components/shared/ConfirmModal';
import Header from '../components/shared/Header';

const Dashboard = ({ setIsAuthenticated }) => {
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
      setSelectedCharacter(response.data.characters[response.data.characters.length - 1]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  const handleProfileUpdated = (updatedUser) => {
    setUserData(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleEditCharacter = (character) => {
    setCharacterToEdit(character);
    setIsCharacterEditModalOpen(true);
  };

  const handleDeleteCharacter = (character) => {
    setCharacterToDelete(character);
    setIsConfirmModalOpen(true);
  };

  const handleCharacterUpdated = async (updatedCharacter) => {
    await fetchCharacters();
    // Update selected character if it was the one being edited
    if (selectedCharacter && selectedCharacter._id === updatedCharacter._id) {
      setSelectedCharacter(updatedCharacter);
    }
  };

  const confirmDeleteCharacter = async () => {
    if (!characterToDelete) return;

    try {
      const response = await api.delete(`/characters/${characterToDelete._id}`);
      if (response.data.success) {
        await fetchCharacters();
        // If deleted character was selected, select the first available character
        if (selectedCharacter && selectedCharacter._id === characterToDelete._id) {
          const updatedCharacters = characters.filter(c => c._id !== characterToDelete._id);
          if (updatedCharacters.length > 0) {
            setSelectedCharacter(updatedCharacters[0]);
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

  const calculateTotalResources = (character) => {
    if (!character?.resources) return 0;
    
    const gathering = Object.values(character.resources.gathering || {}).reduce((a, b) => a + b, 0);
    const minion = Object.values(character.resources.minion || {}).reduce((a, b) => a + b, 0);
    const boss = Object.values(character.resources.boss || {}).reduce((a, b) => a + b, 0);
    
    return gathering + minion + boss;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header 
        showDashboard={false}
        showLogout={true}
        onLogout={handleLogout}
        userData={userData}
        onProfileUpdated={handleProfileUpdated}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Character Selection */}
          <div className="mb-12">
            <div className="arcade-panel">
              <h3 className="font-arcade text-lg text-neon-green mb-6 text-center">
                SELECT CHARACTER
              </h3>
              
              {characters.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No characters found</p>
                  <button
                    onClick={() => setIsCharacterModalOpen(true)}
                    className="arcade-button px-6 py-3"
                  >
                    CREATE FIRST CHARACTER
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {characters.map((character) => {
                    // Get correct avatar image
                    const getAvatarImage = (avatar) => {
                      if (!avatar) return '/mages/earth_mage.png';
                      
                      // Handle both old format (earth, fire, etc.) and new format (earth_mage, fire_mage, etc.)
                      let avatarKey = avatar;
                      if (!avatar.includes('_')) {
                        avatarKey = `${avatar}_mage`;
                      }
                      
                      const avatarMap = {
                        'earth_mage': '/mages/earth_mage.png',
                        'fire_mage': '/mages/fire_mage.png',
                        'water_mage': '/mages/water_mage.png',
                        'lightning_mage': '/mages/lightning_mage.png',
                        'ice_mage': '/mages/ice_mage.png',
                        'shadow_mage': '/mages/shadow_mage.png',
                        'earth__dragonling': '/dragonling/earth__dragonling.png',
                        'infero_dragonling': '/dragonling/infero_dragonling.png',
                        'water_dragonling': '/dragonling/water_dragonling.png',
                        'lightning_dragonling': '/dragonling/lightning_dragonling.png',
                        'ice_dragonling': '/dragonling/ice_dragonling.png',
                        'void_dragonling': '/dragonling/void_dragonling.png',
                        'mountain_wyrm': '/dragons/mountain_wyrm.png',
                        'inferno_drake': '/dragons/inferno_drake.png',
                        'tsunami_serpent': '/dragons/tsunami_serpent.png',
                        'thunder_dragon': '/dragons/thunder_dragon.png',
                        'frost_wyvern': '/dragons/frost_wyvern.png',
                        'void_hydra': '/dragons/void_hydra.png'
                      };
                      
                      return avatarMap[avatarKey] || '/mages/earth_mage.png';
                    };

                    return (
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
                            onClick={() => setSelectedCharacter(character)}
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
                                handleEditCharacter(character);
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
                                handleDeleteCharacter(character);
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
                    );
                  })}
                  
                  {/* Create new character button - only show if less than 3 characters */}
                  {characters.length < 3 && (
                    <button
                      onClick={handleCreateCharacter}
                      className="p-4 rounded-lg border-2 border-dashed border-gray-600 hover:border-neon-pink transition-colors text-center"
                    >
                      <div className="text-2xl mb-2">+</div>
                      <div className="text-sm text-gray-400">Create New Character</div>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Show activities only if character is selected */}
          {selectedCharacter && (
            <>
              {/* Title */}
              <div className="text-center mb-12">
                <h2 className="font-arcade text-3xl neon-text mb-4 animate-pulse-neon">
                  CHOOSE YOUR PATH
                </h2>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"></div>
              </div>

              {/* Activity Buttons */}
              <div className="mb-12">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Gathering Button */}
                  <button
                    onClick={() => navigate('/gathering', { state: { character: selectedCharacter } })}
                    className="arcade-panel p-8 text-center hover:scale-105 transition-transform group"
                  >
                    <div className="text-6xl mb-4 group-hover:animate-bounce">✨</div>
                    <h3 className="font-arcade text-2xl text-neon-green mb-4">GATHERING</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Collect essence from dragon eggs. Test your reflexes and timing!
                    </p>
                    <div className="text-xs text-gray-500">
                      Click eggs when they glow to gather resources
                    </div>
                  </button>

                  {/* Battle Button */}
                  <button
                    onClick={() => navigate('/battle', { state: { character: selectedCharacter } })}
                    className="arcade-panel p-8 text-center hover:scale-105 transition-transform group"
                  >
                    <div className="text-6xl mb-4 group-hover:animate-bounce">⚔️</div>
                    <h3 className="font-arcade text-2xl text-neon-pink mb-4">BATTLE</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Fight elemental minions in turn-based combat. Strategy and luck!
                    </p>
                    <div className="text-xs text-gray-500">
                      Choose spells and defeat powerful enemies
                    </div>
                  </button>
                </div>
              </div>

              {/* Current Resources Display */}
              <div className="mb-12 arcade-panel">
                <h3 className="font-arcade text-lg text-neon-green mb-6 text-center">
                  CURRENT TIER RESOURCES
                </h3>
                <div className="grid grid-cols-3 gap-2 sm:gap-4">
                  {/* Gathering Resources */}
                  <div className="text-center p-2 sm:p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="text-2xl sm:text-3xl mb-2">✨</div>
                    <div className="font-arcade text-xs sm:text-sm text-neon-green mb-2 break-words">GATHERING</div>
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {selectedCharacter.resources?.gathering?.[selectedCharacter.currentTier] || 0}
                    </div>
                  </div>

                  {/* Minion Resources */}
                  <div className="text-center p-2 sm:p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="text-2xl sm:text-3xl mb-2">⚔️</div>
                    <div className="font-arcade text-xs sm:text-sm text-neon-pink mb-2 break-words">MINION</div>
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {selectedCharacter.resources?.minion?.[selectedCharacter.currentTier] || 0}
                    </div>
                  </div>

                  {/* Boss Resources */}
                  <div className="text-center p-2 sm:p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="text-2xl sm:text-3xl mb-2">👑</div>
                    <div className="font-arcade text-xs sm:text-sm text-neon-yellow mb-2 break-words">BOSS</div>
                    <div className="text-lg sm:text-2xl font-bold text-white">
                      {selectedCharacter.resources?.boss?.[selectedCharacter.currentTier] || 0}
                    </div>
                  </div>
                </div>
              </div>

              {/* Character Stats */}
              <div className="grid md:grid-cols-2 gap-6">
                {/* Character Stats */}
                <div className="arcade-panel">
                  <h3 className="font-arcade text-lg text-neon-purple mb-4 text-center">
                    CHARACTER STATS
                  </h3>
                  <div className="space-y-4">
                    {/* Basic Info */}
                    <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                      <h4 className="text-neon-green font-medium mb-2">Basic Information</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Name:</span>
                          <span className="font-arcade text-white">{selectedCharacter.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Avatar:</span>
                          <span className="font-arcade text-white capitalize">{selectedCharacter.avatar?.replace('_mage', '') || 'earth'}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Current Tier:</span>
                          <span className="font-arcade text-neon-green">Tier {selectedCharacter.currentTier}</span>
                        </div>
                      </div>
                    </div>

                    {/* Battle Stats */}
                    <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                      <h4 className="text-neon-pink font-medium mb-2">Battle Statistics</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Total Wins:</span>
                          <span className="font-arcade text-neon-yellow">{selectedCharacter.stats.totalWins || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Current Wins:</span>
                          <span className="font-arcade text-green-400">{selectedCharacter.stats.wins || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Losses:</span>
                          <span className="font-arcade text-red-400">{selectedCharacter.stats.losses || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Win Rate:</span>
                          <span className="font-arcade text-blue-400">
                            {selectedCharacter.stats.wins && selectedCharacter.stats.losses 
                              ? Math.round((selectedCharacter.stats.wins / (selectedCharacter.stats.wins + selectedCharacter.stats.losses)) * 100)
                              : selectedCharacter.stats.wins ? 100 : 0}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Equipment Stats */}
                    <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                      <h4 className="text-neon-yellow font-medium mb-2">Equipment</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Ring Tier:</span>
                          <span className="font-arcade text-yellow-400">T{selectedCharacter.equipment?.ring?.tier || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Cloak Tier:</span>
                          <span className="font-arcade text-purple-400">T{selectedCharacter.equipment?.cloak?.tier || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-gray-400">Ring Infused:</span>
                          <span className="font-arcade text-green-400">
                            {selectedCharacter.equipment?.ring?.infused ? 'YES' : 'NO'}
                          </span>
                        </div>
                        {selectedCharacter.equipment?.ring?.infused && (
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Infusion Level:</span>
                            <span className="font-arcade text-blue-400">+{selectedCharacter.equipment?.ring?.infusionLevel || 0}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resource Summary */}
                <div className="arcade-panel">
                  <h3 className="font-arcade text-lg text-neon-blue mb-4 text-center">
                    RESOURCE SUMMARY
                  </h3>
                  
                  {/* Total Resources */}
                  <div className="mb-4 p-3 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 font-medium">Total Resources:</span>
                      <span className="font-arcade text-xl text-neon-yellow">{calculateTotalResources(selectedCharacter)}</span>
                    </div>
                  </div>

                  {/* Resource Breakdown by Type */}
                  <div className="space-y-4">
                    {/* Gathering Resources */}
                    <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neon-green font-medium">✨ Gathering</span>
                        <span className="font-arcade text-neon-green">
                          {Object.values(selectedCharacter.resources?.gathering || {}).reduce((a, b) => a + b, 0)}
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 text-xs">
                        {[0, 1, 2, 3, 4, 5].map(tier => (
                          <div key={tier} className="text-center">
                            <div className="text-gray-400">T{tier}</div>
                            <div className="text-white font-mono">
                              {selectedCharacter.resources?.gathering?.[tier] || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Minion Resources */}
                    <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neon-pink font-medium">⚔️ Minion</span>
                        <span className="font-arcade text-neon-pink">
                          {Object.values(selectedCharacter.resources?.minion || {}).reduce((a, b) => a + b, 0)}
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 text-xs">
                        {[0, 1, 2, 3, 4, 5].map(tier => (
                          <div key={tier} className="text-center">
                            <div className="text-gray-400">T{tier}</div>
                            <div className="text-white font-mono">
                              {selectedCharacter.resources?.minion?.[tier] || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Boss Resources */}
                    <div className="p-3 bg-dark-bg rounded-lg border border-dark-border">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-neon-yellow font-medium">👑 Boss</span>
                        <span className="font-arcade text-neon-yellow">
                          {Object.values(selectedCharacter.resources?.boss || {}).reduce((a, b) => a + b, 0)}
                        </span>
                      </div>
                      <div className="grid grid-cols-6 gap-1 text-xs">
                        {[0, 1, 2, 3, 4, 5].map(tier => (
                          <div key={tier} className="text-center">
                            <div className="text-gray-400">T{tier}</div>
                            <div className="text-white font-mono">
                              {selectedCharacter.resources?.boss?.[tier] || 0}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      {/* Character Creation Modal */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onCharacterCreated={handleCharacterCreated}
      />

      {/* Character Edit Modal */}
      <CharacterEditModal
        isOpen={isCharacterEditModalOpen}
        onClose={() => {
          setIsCharacterEditModalOpen(false);
          setCharacterToEdit(null);
        }}
        character={characterToEdit}
        onCharacterUpdated={handleCharacterUpdated}
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setCharacterToDelete(null);
        }}
        onConfirm={confirmDeleteCharacter}
        title="Delete Character"
        message={`Are you sure you want to delete "${characterToDelete?.name}"? This action cannot be undone.`}
        confirmText="DELETE"
        cancelText="CANCEL"
        variant="danger"
      />
    </div>
  );
};

export default Dashboard;
