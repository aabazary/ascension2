import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileModal from '../ProfileModal';
import { getAvatarImage } from '../../constants/avatars';

const Header = ({ showDashboard = true, showLogout = false, showLogin = false, onLogout, onLogin, userData, onProfileUpdated, selectedCharacter }) => {
  const navigate = useNavigate();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const getProfileImageSrc = () => {
    if (!userData?.profilePicture) return '/mages/earth_mage.png'; // Default
    
    if (userData.profilePicture.startsWith('http')) {
      return userData.profilePicture; // Google profile image
    }
    
    return getAvatarImage(userData.profilePicture);
  };

  const handleImageError = (e) => {
    // Fallback to default avatar if Google image fails to load (rate limiting)
    e.target.src = '/mages/earth_mage.png';
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
          <h1 className="font-arcade text-lg sm:text-xl neon-text hidden lg:block">ASCENSION</h1>
        </button>
        
        <div className="flex items-center gap-4">
          {/* Current tier resources */}
          {selectedCharacter && (
            <>
              {selectedCharacter.currentTier >= 6 ? (
                /* Max tier display */
                <div className="flex items-center gap-2 px-3 py-2 bg-dark-panel border border-yellow-500 rounded-lg">
                  <div className="text-xs text-yellow-400 font-bold">👑 MAX TIER</div>
                  <div className="text-xs text-gray-400">Currently Max Tier</div>
                </div>
              ) : (
                <>
                  {/* Desktop version - full resources */}
                  <div className="hidden lg:flex items-center gap-3 px-3 py-2 bg-dark-panel border border-dark-border rounded-lg">
                    <div className="text-xs text-gray-400">T{selectedCharacter.currentTier}:</div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <span className="text-xs">✨</span>
                        <span className="text-xs text-neon-green font-mono">
                          {selectedCharacter.resources?.gathering?.[selectedCharacter.currentTier] || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">⚔️</span>
                        <span className="text-xs text-neon-pink font-mono">
                          {selectedCharacter.resources?.minion?.[selectedCharacter.currentTier] || 0}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs">👑</span>
                        <span className="text-xs text-neon-yellow font-mono">
                          {selectedCharacter.resources?.boss?.[selectedCharacter.currentTier] || 0}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Tablet version - compact resources */}
                  <div className="lg:hidden md:flex items-center gap-2 px-2 py-1 bg-dark-panel border border-dark-border rounded text-xs">
                    <span className="text-gray-400">T{selectedCharacter.currentTier}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-neon-green">✨{selectedCharacter.resources?.gathering?.[selectedCharacter.currentTier] || 0}</span>
                      <span className="text-neon-pink">⚔️{selectedCharacter.resources?.minion?.[selectedCharacter.currentTier] || 0}</span>
                      <span className="text-neon-yellow">👑{selectedCharacter.resources?.boss?.[selectedCharacter.currentTier] || 0}</span>
                    </div>
                  </div>
                  
                  {/* Mobile version - minimal */}
                  <div className="md:hidden flex items-center gap-1 px-2 py-1 bg-dark-panel border border-dark-border rounded text-xs">
                    <span className="text-gray-400">T{selectedCharacter.currentTier}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-neon-green">{selectedCharacter.resources?.gathering?.[selectedCharacter.currentTier] || 0}</span>
                      <span className="text-neon-pink">{selectedCharacter.resources?.minion?.[selectedCharacter.currentTier] || 0}</span>
                      <span className="text-neon-yellow">{selectedCharacter.resources?.boss?.[selectedCharacter.currentTier] || 0}</span>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* Welcome message and profile picture */}
          {userData && (
            <div className="flex items-center gap-2 lg:gap-3">
              <p className="text-xs sm:text-sm text-gray-400 hidden md:block">
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
                  onError={handleImageError}
                />
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all flex items-center justify-center">
                  <span className="text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">✏️</span>
                </div>
              </button>
            </div>
          )}

          {/* Desktop buttons */}
          <div className="hidden lg:flex items-center gap-3">
            {showLogin && onLogin && (
              <button
                onClick={onLogin}
                className="px-4 py-2 font-arcade text-xs bg-dark-panel border border-dark-border rounded-lg hover:border-neon-pink transition-colors"
              >
                LOGIN
              </button>
            )}
            
            {showDashboard && (
              <button
                onClick={() => navigate('/dashboard')}
                className="arcade-button text-sm px-4 py-3"
              >
                DASHBOARD
              </button>
            )}
            
            {showLogout && onLogout && (
              <button
                onClick={onLogout}
                className="px-4 py-2 font-arcade text-xs bg-dark-panel border border-dark-border rounded-lg hover:border-neon-pink transition-colors"
              >
                LOGOUT
              </button>
            )}
          </div>

          {/* Mobile/Tablet hamburger menu */}
          <div className="lg:hidden">
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 rounded-lg border border-dark-border hover:border-neon-purple transition-colors"
              title="Menu"
            >
              <div className="w-5 h-5 flex flex-col justify-center items-center gap-1">
                <div className={`w-4 h-0.5 bg-current transition-all ${showMobileMenu ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-4 h-0.5 bg-current transition-all ${showMobileMenu ? 'opacity-0' : ''}`}></div>
                <div className={`w-4 h-0.5 bg-current transition-all ${showMobileMenu ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="lg:hidden bg-dark-bg border-b-2 border-dark-border p-4">
          <div className="flex flex-col gap-3">
            {showLogin && onLogin && (
              <button
                onClick={() => {
                  onLogin();
                  setShowMobileMenu(false);
                }}
                className="px-4 py-3 font-arcade text-sm bg-dark-panel border border-dark-border rounded-lg hover:border-neon-pink transition-colors w-full"
              >
                LOGIN
              </button>
            )}
            
            {showDashboard && (
              <button
                onClick={() => {
                  navigate('/dashboard');
                  setShowMobileMenu(false);
                }}
                className="arcade-button text-sm px-4 py-3 w-full"
              >
                DASHBOARD
              </button>
            )}
            
            {showLogout && onLogout && (
              <button
                onClick={() => {
                  onLogout();
                  setShowMobileMenu(false);
                }}
                className="px-4 py-3 font-arcade text-sm bg-dark-panel border border-dark-border rounded-lg hover:border-neon-pink transition-colors w-full"
              >
                LOGOUT
              </button>
            )}
          </div>
        </div>
      )}

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
