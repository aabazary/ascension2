import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCharacterSync } from '../hooks/useCharacterSync';
import { useUpgrade } from '../hooks/useUpgrade';
import Header from '../components/shared/Header';
import GearDisplay from '../components/upgrade/GearDisplay';
import UpgradeModal from '../components/upgrade/UpgradeModal';

// Helper functions to calculate bonuses (matching backend logic)
const calculateTotalPowerBonus = (character) => {
  if (!character?.equipment) return 0;
  
  let powerBonus = 0;
  let minTier = 999;
  let tier1Items = 0;

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      // Equipment bonuses from config
      const equipmentBonuses = {
        ring: { damage: [0, 4, 9, 20, 45, 100] },
        cloak: { damage: [0, 4, 9, 20, 45, 100] },
        belt: { damage: [0, 4, 9, 20, 45, 100] }
      };
      
      const bonus = equipmentBonuses[item];
      if (bonus) {
        const tierIndex = Math.min(stats.tier, bonus.damage.length - 1);
        powerBonus += bonus.damage[tierIndex];
      }
      
      if (stats.tier >= 1) {
        tier1Items++;
        minTier = Math.min(minTier, stats.tier);
      }
    }
  });

  // Set bonus
  const setBonuses = [
    { damage: 0, health: 0 },       // Tier 0: no set bonus
    { damage: 20, health: 100 },    // Tier 1: +20 power, +100 health
    { damage: 45, health: 225 },    // Tier 2: +45 power, +225 health
    { damage: 100, health: 500 },   // Tier 3: +100 power, +500 health
    { damage: 225, health: 1125 },  // Tier 4: +225 power, +1125 health
    { damage: 500, health: 2500 }   // Tier 5: +500 power, +2500 health
  ];

  if (tier1Items >= 3 && minTier < setBonuses.length) {
    powerBonus += setBonuses[minTier].damage;
  }

  return powerBonus;
};

const calculateTotalHealthBonus = (character) => {
  if (!character?.equipment) return 0;
  
  let healthBonus = 0;
  let minTier = 999;
  let tier1Items = 0;

  Object.entries(character.equipment).forEach(([item, stats]) => {
    if (stats.infused) {
      // Equipment bonuses from config
      const equipmentBonuses = {
        ring: { health: [0, 20, 45, 100, 225, 500] },
        cloak: { health: [0, 20, 45, 100, 225, 500] },
        belt: { health: [0, 20, 45, 100, 225, 500] }
      };
      
      const bonus = equipmentBonuses[item];
      if (bonus) {
        const tierIndex = Math.min(stats.tier, bonus.health.length - 1);
        healthBonus += bonus.health[tierIndex];
      }
      
      if (stats.tier >= 1) {
        tier1Items++;
        minTier = Math.min(minTier, stats.tier);
      }
    }
  });

  // Set bonus
  const setBonuses = [
    { damage: 0, health: 0 },       // Tier 0: no set bonus
    { damage: 20, health: 100 },    // Tier 1: +20 power, +100 health
    { damage: 45, health: 225 },    // Tier 2: +45 power, +225 health
    { damage: 100, health: 500 },   // Tier 3: +100 power, +500 health
    { damage: 225, health: 1125 },  // Tier 4: +225 power, +1125 health
    { damage: 500, health: 2500 }   // Tier 5: +500 power, +2500 health
  ];

  if (tier1Items >= 3 && minTier < setBonuses.length) {
    healthBonus += setBonuses[minTier].health;
  }

  return healthBonus;
};

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
  }, [character, navigate, refreshUpgradeStatus]);

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
                  <span className="text-green-400">+{calculateTotalPowerBonus(character)} Power</span>
                  <span className="text-blue-400">+{calculateTotalHealthBonus(character)} Health</span>
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
