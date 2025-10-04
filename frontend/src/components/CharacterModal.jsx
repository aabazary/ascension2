import { useState } from 'react';
import api from '../utils/api';
import { MAGE_AVATARS } from '../constants/avatars';

const CharacterModal = ({ isOpen, onClose, onCharacterCreated }) => {
  const [characterName, setCharacterName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('earth_mage');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const avatars = MAGE_AVATARS;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/characters', {
        name: characterName,
        avatar: selectedAvatar,
      });

      if (response.data.success) {
        onCharacterCreated();
        onClose();
        setCharacterName('');
        setSelectedAvatar('earth_mage');
      } else {
        setError(response.data.message || 'Character creation failed');
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
      <div className="arcade-panel max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-arcade text-xl text-neon-green">CREATE CHARACTER</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Character Name
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              required
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
              placeholder="Enter character name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-3">
              Choose Avatar
            </label>
            <div className="grid grid-cols-2 gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAvatar === avatar.id
                      ? 'border-neon-pink bg-neon-pink bg-opacity-10'
                      : 'border-dark-border hover:border-gray-500'
                  }`}
                >
                  <img
                    src={avatar.image}
                    alt={avatar.name}
                    className="w-12 h-12 mx-auto mb-2 object-contain"
                  />
                  <div className="text-xs text-center text-gray-300">
                    {avatar.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full arcade-button py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'CREATING...' : 'CREATE CHARACTER'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CharacterModal;
