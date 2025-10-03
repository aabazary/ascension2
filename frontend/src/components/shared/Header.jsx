import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../ProfileModal';

const Header = ({ showDashboard = true, showLogout = false, onLogout, userData, onProfileUpdated }) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Available profile pictures for display
  const profilePictures = [
    { id: 'earth_mage', image: '/mages/earth_mage.png' },
    { id: 'fire_mage', image: '/mages/fire_mage.png' },
    { id: 'water_mage', image: '/mages/water_mage.png' },
    { id: 'lightning_mage', image: '/mages/lightning_mage.png' },
    { id: 'ice_mage', image: '/mages/ice_mage.png' },
    { id: 'shadow_mage', image: '/mages/shadow_mage.png' },
    { id: 'earth__dragonling', image: '/dragonling/earth__dragonling.png' },
    { id: 'infero_dragonling', image: '/dragonling/infero_dragonling.png' },
    { id: 'water_dragonling', image: '/dragonling/water_dragonling.png' },
    { id: 'lightning_dragonling', image: '/dragonling/lightning_dragonling.png' },
    { id: 'ice_dragonling', image: '/dragonling/ice_dragonling.png' },
    { id: 'void_dragonling', image: '/dragonling/void_dragonling.png' },
    { id: 'mountain_wyrm', image: '/dragons/mountain_wyrm.png' },
    { id: 'inferno_drake', image: '/dragons/inferno_drake.png' },
    { id: 'tsunami_serpent', image: '/dragons/tsunami_serpent.png' },
    { id: 'thunder_dragon', image: '/dragons/thunder_dragon.png' },
    { id: 'frost_wyvern', image: '/dragons/frost_wyvern.png' },
    { id: 'void_hydra', image: '/dragons/void_hydra.png' }
  ];

  const getProfileImageSrc = () => {
    if (!userData?.profilePicture) return '/mages/earth_mage.png'; // Default
    
    if (userData.profilePicture.startsWith('http')) {
      return userData.profilePicture; // Google profile image
    }
    
    const picture = profilePictures.find(p => p.id === userData.profilePicture);
    return picture?.image || '/mages/earth_mage.png';
  };

  return (
    <>
      <header className="p-3 sm:p-6 flex justify-between items-center border-b-2 border-dark-border">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity"
        >
          <img 
            src="/ascenion/ascension_no_bg.png" 
            alt="Ascension Logo" 
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain"
          />
          <h1 className="font-arcade text-lg sm:text-xl neon-text">ASCENSION</h1>
        </button>
        
        <div className="flex items-center gap-4">
          {/* Welcome message and profile picture */}
          {userData && (
            <div className="flex items-center gap-3">
              <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                Welcome, {userData.username}
              </p>
              <button
                onClick={() => setShowProfileModal(true)}
                className="relative group"
                title="Edit Profile"
              >
                <img
                  src={getProfileImageSrc()}
                  alt="Profile"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-dark-border hover:border-neon-green transition-colors"
                />
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                </div>
              </button>
            </div>
          )}

          {showDashboard && (
            <button
              onClick={() => navigate('/dashboard')}
              className="arcade-button text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3"
            >
              <span className="hidden sm:inline">DASHBOARD</span>
              <span className="sm:hidden">DASH</span>
            </button>
          )}
          
          {showLogout && onLogout && (
            <button
              onClick={onLogout}
              className="px-3 py-2 sm:px-4 sm:py-2 font-arcade text-xs bg-dark-panel border border-dark-border rounded-lg hover:border-neon-pink transition-colors"
            >
              LOGOUT
            </button>
          )}
        </div>
      </header>

      {/* Profile Modal */}
      {userData && (
        <ProfileModal
          isOpen={showProfileModal}
          onClose={() => setShowProfileModal(false)}
          userData={userData}
          onProfileUpdated={onProfileUpdated}
        />
      )}
    </>
  );
};

export default Header;
