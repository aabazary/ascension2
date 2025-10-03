import { useState, useEffect } from 'react';
import api from '../utils/api';

const ProfileModal = ({ isOpen, onClose, userData, onProfileUpdated }) => {
  const [formData, setFormData] = useState({
    username: '',
    profilePicture: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Available profile pictures
  const profilePictures = [
    // Mages
    { id: 'earth_mage', name: 'Earth Mage', image: '/mages/earth_mage.png' },
    { id: 'fire_mage', name: 'Fire Mage', image: '/mages/fire_mage.png' },
    { id: 'water_mage', name: 'Water Mage', image: '/mages/water_mage.png' },
    { id: 'lightning_mage', name: 'Lightning Mage', image: '/mages/lightning_mage.png' },
    { id: 'ice_mage', name: 'Ice Mage', image: '/mages/ice_mage.png' },
    { id: 'shadow_mage', name: 'Shadow Mage', image: '/mages/shadow_mage.png' },
    
    // Dragonlings
    { id: 'earth__dragonling', name: 'Earth Dragonling', image: '/dragonling/earth__dragonling.png' },
    { id: 'infero_dragonling', name: 'Fire Dragonling', image: '/dragonling/infero_dragonling.png' },
    { id: 'water_dragonling', name: 'Water Dragonling', image: '/dragonling/water_dragonling.png' },
    { id: 'lightning_dragonling', name: 'Lightning Dragonling', image: '/dragonling/lightning_dragonling.png' },
    { id: 'ice_dragonling', name: 'Ice Dragonling', image: '/dragonling/ice_dragonling.png' },
    { id: 'void_dragonling', name: 'Void Dragonling', image: '/dragonling/void_dragonling.png' },
    
    // Dragons (Boss creatures)
    { id: 'mountain_wyrm', name: 'Mountain Wyrm', image: '/dragons/mountain_wyrm.png' },
    { id: 'inferno_drake', name: 'Inferno Drake', image: '/dragons/inferno_drake.png' },
    { id: 'tsunami_serpent', name: 'Tsunami Serpent', image: '/dragons/tsunami_serpent.png' },
    { id: 'thunder_dragon', name: 'Thunder Dragon', image: '/dragons/thunder_dragon.png' },
    { id: 'frost_wyvern', name: 'Frost Wyvern', image: '/dragons/frost_wyvern.png' },
    { id: 'void_hydra', name: 'Void Hydra', image: '/dragons/void_hydra.png' }
  ];

  useEffect(() => {
    if (isOpen && userData) {
      setFormData({
        username: userData.username || '',
        profilePicture: userData.profilePicture || ''
      });
      setError('');
      setMessage('');
    }
  }, [isOpen, userData]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePictureSelect = (pictureId) => {
    setFormData({
      ...formData,
      profilePicture: pictureId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.put('/auth/profile', {
        username: formData.username,
        profilePicture: formData.profilePicture
      });

      if (response.data.success) {
        setMessage('Profile updated successfully!');
        onProfileUpdated(response.data.user);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="arcade-panel max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-arcade text-xl text-neon-green">EDIT PROFILE</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
              placeholder="Enter username"
            />
          </div>

          {/* Profile Picture Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Profile Picture
            </label>
            
            {/* Current Selection Preview */}
            {formData.profilePicture && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Current Selection:</p>
                <div className="flex items-center gap-3">
                  {formData.profilePicture.startsWith('http') ? (
                    <img
                      src={formData.profilePicture}
                      alt="Google Profile"
                      className="w-12 h-12 rounded-full object-cover border-2 border-neon-green"
                    />
                  ) : (
                    <img
                      src={profilePictures.find(p => p.id === formData.profilePicture)?.image}
                      alt="Selected"
                      className="w-12 h-12 rounded-full object-cover border-2 border-neon-green"
                    />
                  )}
                  <span className="text-sm text-gray-300">
                    {formData.profilePicture.startsWith('http') 
                      ? 'Google Profile Image' 
                      : profilePictures.find(p => p.id === formData.profilePicture)?.name
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Google Profile Option - Always show for OAuth users */}
            {userData?.profilePicture?.startsWith('http') && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Your Google Profile:</p>
                <button
                  type="button"
                  onClick={() => handlePictureSelect(userData.profilePicture)}
                  className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                    formData.profilePicture === userData.profilePicture
                      ? 'border-neon-green bg-neon-green bg-opacity-10'
                      : 'border-dark-border hover:border-gray-500'
                  }`}
                >
                  <img
                    src={userData.profilePicture}
                    alt="Google Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-300">Use Google Profile Image</span>
                </button>
              </div>
            )}

            {/* Available Images Grid */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Game Avatars:</p>
              <div className="max-h-64 overflow-y-auto border border-dark-border rounded-lg p-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {profilePictures.map((picture) => (
                  <button
                    key={picture.id}
                    type="button"
                    onClick={() => handlePictureSelect(picture.id)}
                    className={`p-2 rounded-lg border-2 transition-all ${
                      formData.profilePicture === picture.id
                        ? 'border-neon-green bg-neon-green bg-opacity-10'
                        : 'border-dark-border hover:border-gray-500'
                    }`}
                    title={picture.name}
                  >
                    <img
                      src={picture.image}
                      alt={picture.name}
                      className="w-full h-12 object-contain rounded"
                    />
                    <div className="text-xs text-gray-400 mt-1 truncate">
                      {picture.name}
                    </div>
                  </button>
                ))}
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          {message && (
            <div className="text-green-400 text-sm text-center">{message}</div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 arcade-button py-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'UPDATING...' : 'UPDATE PROFILE'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white hover:border-gray-500 transition-colors"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileModal;
