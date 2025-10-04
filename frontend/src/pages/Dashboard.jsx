import { useDashboard } from '../hooks/useDashboard';
import CharacterModal from '../components/CharacterModal';
import CharacterEditModal from '../components/CharacterEditModal';
import ConfirmModal from '../components/shared/ConfirmModal';
import Header from '../components/shared/Header';
import CharacterSelection from '../components/dashboard/CharacterSelection';
import ActivityButtons from '../components/dashboard/ActivityButtons';
import ResourceDisplay from '../components/dashboard/ResourceDisplay';
import CharacterStats from '../components/dashboard/CharacterStats';
import ResourceSummary from '../components/dashboard/ResourceSummary';

const Dashboard = ({ setIsAuthenticated }) => {
  const {
    userData,
    characters,
    selectedCharacter,
    isCharacterModalOpen,
    isCharacterEditModalOpen,
    isConfirmModalOpen,
    characterToEdit,
    characterToDelete,
    loading,
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
  } = useDashboard(setIsAuthenticated);

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
          <CharacterSelection
            characters={characters}
            selectedCharacter={selectedCharacter}
            onCharacterSelect={setSelectedCharacter}
            onCreateCharacter={handleCreateCharacter}
            onEditCharacter={handleEditCharacter}
            onDeleteCharacter={handleDeleteCharacter}
          />

          {selectedCharacter && (
            <>
              {/* Activity Buttons */}
              <ActivityButtons character={selectedCharacter} />

              {/* Current Resources Display */}
              <ResourceDisplay character={selectedCharacter} />

              {/* Character Stats and Resource Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <CharacterStats character={selectedCharacter} />
                <ResourceSummary character={selectedCharacter} />
              </div>
            </>
          )}
        </div>
      </main>

      {/* Modals */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onCharacterCreated={handleCharacterCreated}
      />

      <CharacterEditModal
        isOpen={isCharacterEditModalOpen}
        onClose={() => setIsCharacterEditModalOpen(false)}
        character={characterToEdit}
        onCharacterUpdated={handleCharacterUpdated}
      />

      <ConfirmModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmDeleteCharacter}
        title="Delete Character"
        message={`Are you sure you want to delete "${characterToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        isDestructive={true}
      />
    </div>
  );
};

export default Dashboard;
