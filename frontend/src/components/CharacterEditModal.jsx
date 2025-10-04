import { useState, useEffect } from 'react';
import api from '../utils/api';
import { MAGE_AVATARS } from '../constants/avatars';

const CharacterEditModal = ({ isOpen, onClose, character, onCharacterUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    avatar: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Available character avatars (only mages)
  const characterAvatars = MAGE_AVATARS;

  useEffect(() => {
    if (isOpen && character) {
      // Handle both old format (earth, fire, etc.) and new format (earth_mage, fire_mage, etc.)
      let avatarValue = character.avatar || '';
      if (avatarValue && !avatarValue.includes('_')) {
        avatarValue = `${avatarValue}_mage`;
      }
      
      setFormData({
        name: character.name || '',
        avatar: avatarValue
      });
      setError('');
      setMessage('');
    }
  }, [isOpen, character]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarSelect = (avatarId) => {
    setFormData({
      ...formData,
      avatar: avatarId
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const response = await api.put(`/characters/${character._id}`, {
        name: formData.name,
        avatar: formData.avatar
      });

      if (response.data.success) {
        setMessage('Character updated successfully!');
        onCharacterUpdated(response.data.character);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setError(response.data.message || 'Failed to update character');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !character) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="arcade-panel max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-arcade text-xl text-neon-green">EDIT CHARACTER</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Character Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Character Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
              placeholder="Enter character name"
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-4">
              Character Avatar
            </label>
            
            {/* Current Selection Preview */}
            {formData.avatar && (
              <div className="mb-4">
                <p className="text-sm text-gray-400 mb-2">Current Selection:</p>
                <div className="flex items-center gap-3">
                  <img
                    src={characterAvatars.find(a => a.id === formData.avatar)?.image}
                    alt="Selected"
                    className="w-12 h-12 rounded-full object-cover border-2 border-neon-green"
                  />
                  <span className="text-sm text-gray-300">
                    {characterAvatars.find(a => a.id === formData.avatar)?.name}
                  </span>
                </div>
              </div>
            )}

            {/* Available Avatars Grid */}
            <div className="mb-4">
              <p className="text-sm text-gray-400 mb-2">Available Avatars:</p>
              <div className="max-h-64 overflow-y-auto border border-dark-border rounded-lg p-3">
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {characterAvatars.map((avatar) => (
                    <button
                      key={avatar.id}
                      type="button"
                      onClick={() => handleAvatarSelect(avatar.id)}
                      className={`p-2 rounded-lg border-2 transition-all ${
                        formData.avatar === avatar.id
                          ? 'border-neon-green bg-neon-green bg-opacity-10'
                          : 'border-dark-border hover:border-gray-500'
                      }`}
                      title={avatar.name}
                    >
                      <img
                        src={avatar.image}
                        alt={avatar.name}
                        className="w-full h-12 object-contain rounded"
                      />
                      <div className="text-xs text-gray-400 mt-1 truncate">
                        {avatar.name}
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
              {loading ? 'UPDATING...' : 'UPDATE CHARACTER'}
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

export default CharacterEditModal;
