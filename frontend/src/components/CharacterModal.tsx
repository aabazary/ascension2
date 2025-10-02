import { useState } from 'react';
import api from '../utils/api';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCharacterCreated: () => void;
}

const CharacterModal = ({ isOpen, onClose, onCharacterCreated }: CharacterModalProps) => {
  const [characterName, setCharacterName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('earth');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const avatars = [
    { id: 'earth', name: 'Earth Mage', image: '/mages/earth_mage.png' },
    { id: 'fire', name: 'Fire Mage', image: '/mages/fire_mage.png' },
    { id: 'water', name: 'Water Mage', image: '/mages/water_mage.png' },
    { id: 'lightning', name: 'Lightning Mage', image: '/mages/lightning_mage.png' },
    { id: 'ice', name: 'Ice Mage', image: '/mages/ice_mage.png' },
    { id: 'shadow', name: 'shadow Mage', image: '/mages/shadow_mage.png' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/characters', { 
        name: characterName,
        avatar: selectedAvatar 
      });

      if (response.data.success) {
        onCharacterCreated();
        onClose();
        setCharacterName('');
        setSelectedAvatar('earth');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div 
        className="arcade-panel max-w-md w-full mx-4 animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="font-arcade text-2xl neon-text mb-2">
            CREATE CHARACTER
          </h2>
          <div className="h-1 w-20 mx-auto bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"></div>
        </div>

        {/* Info */}
        <div className="mb-6 p-4 bg-dark-bg rounded-lg border border-dark-border">
          <p className="text-sm text-gray-400 leading-relaxed">
            Enter the arcane to begin your journey through the elemental trials. 
            Choose your name wisely, mage.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-arcade mb-2 text-neon-purple">
              CHARACTER NAME
            </label>
            <input
              type="text"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              className="input-arcade"
              required
              placeholder="Enter character name"
              minLength={3}
              maxLength={20}
              pattern="[a-zA-Z0-9_]+"
              title="Only letters, numbers, and underscores allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              3-20 characters, letters, numbers, and underscores only
            </p>
          </div>

          <div>
            <label className="block text-sm font-arcade mb-3 text-neon-purple">
              CHOOSE AVATAR
            </label>
            <div className="grid grid-cols-3 gap-3">
              {avatars.map((avatar) => (
                <button
                  key={avatar.id}
                  type="button"
                  onClick={() => setSelectedAvatar(avatar.id)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedAvatar === avatar.id
                      ? 'border-neon-blue bg-neon-blue/20'
                      : 'border-dark-border hover:border-neon-purple'
                  }`}
                >
                  <img 
                    src={avatar.image} 
                    alt={avatar.name}
                    className="w-12 h-12 mx-auto object-contain mb-2"
                  />
                  <div className="text-xs text-center text-gray-400">
                    {avatar.name}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="bg-red-500/20 border border-red-500 rounded-lg p-3 text-red-400 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="arcade-button w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'CREATING...' : 'CREATE CHARACTER'}
          </button>
        </form>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default CharacterModal;

