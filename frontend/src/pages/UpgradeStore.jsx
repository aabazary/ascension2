import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCharacterSync } from '../hooks/useCharacterSync';
import { useUpgrade } from '../hooks/useUpgrade';
import Header from '../components/shared/Header';
import GearDisplay from '../components/upgrade/GearDisplay';
import UpgradeModal from '../components/upgrade/UpgradeModal';

const UpgradeStore = ({ userData, onProfileUpdated }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const character = useCharacterSync(location.state?.character);
  
  const {
    upgradeStatus,
    selectedGear,
    isUpgradeModalOpen,
    loading,
    error,
    selectGear,
    closeUpgradeModal,
    performUpgrade,
    refreshUpgradeStatus
  } = useUpgrade(character);

  useEffect(() => {
    if (!character) {
      navigate('/dashboard');
      return;
    }
    
    refreshUpgradeStatus();
  }, [character, navigate]);

  if (!character) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header 
        showDashboard={true}
        showLogout={true}
        userData={userData}
        onProfileUpdated={onProfileUpdated}
        selectedCharacter={character}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">Upgrade Store</h1>
            <p className="text-gray-400">Enhance your equipment to increase your power</p>
          </div>

          {/* Character Info */}
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{character.name}</h2>
                <p className="text-gray-400">Current Tier: {character.currentTier}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400">Equipment Bonuses</p>
                <div className="flex gap-4 text-sm">
                  <span className="text-green-400">+{character.equipment?.ring?.tier * 4 || 0} Power</span>
                  <span className="text-blue-400">+{character.equipment?.ring?.tier * 20 || 0} Health</span>
                </div>
              </div>
            </div>
          </div>

          {/* Gear Display */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">Error loading upgrade information</p>
              <button 
                onClick={refreshUpgradeStatus}
                className="px-4 py-2 bg-neon-green text-black rounded-lg hover:bg-green-400 transition-colors"
              >
                Retry
              </button>
            </div>
          ) : (
            <GearDisplay 
              upgradeStatus={upgradeStatus}
              onGearSelect={selectGear}
            />
          )}

          {/* Upgrade Modal */}
          <UpgradeModal
            isOpen={isUpgradeModalOpen}
            onClose={closeUpgradeModal}
            gear={selectedGear}
            upgradeStatus={upgradeStatus}
            onUpgrade={performUpgrade}
            loading={loading}
          />
        </div>
      </main>
    </div>
  );
};

export default UpgradeStore;
