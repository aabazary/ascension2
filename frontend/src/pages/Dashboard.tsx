import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import CharacterModal from '../components/CharacterModal';

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface UserData {
  username: string;
  email: string;
}

interface Character {
  _id: string;
  name: string;
  currentTier: number;
  resources: {
    gathering: { [key: number]: number };
    minion: { [key: number]: number };
    boss: { [key: number]: number };
  };
  stats: {
    totalWins: number;
    wins: number;
    losses: number;
  };
  equipment: {
    ring: { tier: number; infused: boolean };
    cloak: { tier: number; infused: boolean };
    belt: { tier: number; infused: boolean };
  };
}

const Dashboard = ({ setIsAuthenticated }: DashboardProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isCharacterModalOpen, setIsCharacterModalOpen] = useState(false);
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
      const response = await api.get('/characters');

      if (response.data.success) {
        setCharacters(response.data.characters);
        // Auto-select first character if available
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

  const handleLogout = async () => {
    try {
      // Call backend logout to clear cookies
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear local storage regardless of API call success
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      navigate('/');
    }
  };

  const handleCharacterCreated = () => {
    fetchCharacters();
  };

  const getTotalResources = (character: Character) => {
    let total = 0;
    if (character.resources?.gathering) {
      Object.values(character.resources.gathering).forEach((val) => (total += val));
    }
    if (character.resources?.minion) {
      Object.values(character.resources.minion).forEach((val) => (total += val));
    }
    if (character.resources?.boss) {
      Object.values(character.resources.boss).forEach((val) => (total += val));
    }
    return total;
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b-2 border-dark-border">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-4 hover:opacity-80 transition-opacity"
        >
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center shadow-neon">
            <span className="text-2xl">🔮</span>
          </div>
          <div>
            <h1 className="font-arcade text-xl neon-text">ASCENSION</h1>
            {userData && (
              <p className="text-sm text-gray-400">Welcome, {userData.username}</p>
            )}
          </div>
        </button>
        <button
          onClick={handleLogout}
          className="px-4 py-2 font-arcade text-xs bg-dark-panel border border-dark-border rounded-lg hover:border-neon-pink transition-colors"
        >
          LOGOUT
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          {/* Character Selection */}
          <div className="mb-12 arcade-panel">
            <h3 className="font-arcade text-lg text-neon-purple mb-6 text-center">
              YOUR CHARACTERS
            </h3>

            {loading ? (
              <div className="text-center text-gray-500 py-8">
                <p className="font-arcade text-sm">Loading...</p>
              </div>
            ) : characters.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p className="font-arcade text-sm mb-4">No characters yet</p>
                <button 
                  onClick={() => setIsCharacterModalOpen(true)}
                  className="arcade-button"
                >
                  CREATE CHARACTER
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid md:grid-cols-3 gap-4">
                  {characters.map((char) => (
                    <button
                      key={char._id}
                      onClick={() => setSelectedCharacter(char)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedCharacter?._id === char._id
                          ? 'border-neon-purple bg-neon-purple/10 shadow-neon'
                          : 'border-dark-border bg-dark-bg hover:border-neon-purple/50'
                      }`}
                    >
                      <div className="font-arcade text-lg text-white mb-2">{char.name}</div>
                      <div className="text-sm text-gray-400 space-y-1">
                        <div>Tier: {char.currentTier}</div>
                        <div>Wins: {char.stats?.totalWins || char.stats?.wins || 0}</div>
                      </div>
                    </button>
                  ))}
                  {characters.length < 3 && (
                    <button
                      onClick={() => setIsCharacterModalOpen(true)}
                      className="p-4 rounded-lg border-2 border-dashed border-dark-border hover:border-neon-green transition-all"
                    >
                      <div className="text-4xl mb-2 text-center">+</div>
                      <div className="font-arcade text-xs text-center text-gray-400">
                        NEW CHARACTER
                      </div>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Show activities only if character is selected */}
          {selectedCharacter ? (
            <>
              {/* Title */}
              <div className="text-center mb-12">
                <h2 className="font-arcade text-3xl neon-text mb-4 animate-pulse-neon">
                  CHOOSE YOUR PATH
                </h2>
                <div className="h-1 w-32 mx-auto bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"></div>
              </div>

              {/* Current Resources Display */}
              <div className="mb-12 arcade-panel">
                <h3 className="font-arcade text-lg text-neon-green mb-6 text-center">
                  CURRENT TIER RESOURCES
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {/* Gathering Resources */}
                  <div className="text-center p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="text-3xl mb-2">✨</div>
                    <div className="font-arcade text-sm text-neon-green mb-2">GATHERING</div>
                    <div className="text-2xl font-bold text-white">
                      {selectedCharacter.resources?.gathering?.[selectedCharacter.currentTier] || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Tier {selectedCharacter.currentTier}</div>
                  </div>

                  {/* Minion Resources */}
                  <div className="text-center p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="text-3xl mb-2">⚔️</div>
                    <div className="font-arcade text-sm text-neon-blue mb-2">MINION</div>
                    <div className="text-2xl font-bold text-white">
                      {selectedCharacter.resources?.minion?.[selectedCharacter.currentTier] || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Tier {selectedCharacter.currentTier}</div>
                  </div>

                  {/* Boss Resources */}
                  <div className="text-center p-4 bg-dark-bg rounded-lg border border-dark-border">
                    <div className="text-3xl mb-2">🐉</div>
                    <div className="font-arcade text-sm text-neon-pink mb-2">BOSS</div>
                    <div className="text-2xl font-bold text-white">
                      {selectedCharacter.resources?.boss?.[selectedCharacter.currentTier] || 0}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Tier {selectedCharacter.currentTier}</div>
                  </div>
                </div>
              </div>

              {/* Action Cards */}
              <div className="grid md:grid-cols-4 gap-6">
                {/* Gathering */}
                <button 
                  onClick={() => navigate('/gathering', { state: { character: selectedCharacter } })}
                  className="group arcade-panel hover:border-neon-green transition-all duration-300 text-left relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-green/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                      ✨
                    </div>
                    <h3 className="font-arcade text-xl text-neon-green mb-3">
                      GATHER
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      Collect elemental resources through mystical rituals. Test your reflexes and timing.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-arcade">CLICK TO START</span>
                      <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </button>

                {/* Fight Minions */}
                <button className="group arcade-panel hover:border-neon-blue transition-all duration-300 text-left relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-blue/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                      ⚔️
                    </div>
                    <h3 className="font-arcade text-xl text-neon-blue mb-3">
                      FIGHT MINIONS
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      Battle elemental dragonlings. Perfect for farming resources and testing your build.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-arcade">CLICK TO START</span>
                      <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </button>

                {/* Fight Bosses */}
                <button className="group arcade-panel hover:border-neon-pink transition-all duration-300 text-left relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                      🐉
                    </div>
                    <h3 className="font-arcade text-xl text-neon-pink mb-3">
                      FIGHT BOSSES
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      Face powerful elemental dragons. High risk, high reward. Are you ready?
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-arcade">CLICK TO START</span>
                      <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </button>

                {/* Upgrade */}
                <button className="group arcade-panel hover:border-neon-purple transition-all duration-300 text-left relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative">
                    <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform">
                      ⚡
                    </div>
                    <h3 className="font-arcade text-xl text-neon-purple mb-3">
                      UPGRADE
                    </h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">
                      Enhance your equipment using gathered resources. Increase your power and survivability.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 font-arcade">CLICK TO START</span>
                      <span className="text-2xl group-hover:translate-x-2 transition-transform">→</span>
                    </div>
                  </div>
                </button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 mt-8">
                <div className="arcade-panel text-center">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-arcade text-neon-yellow mb-1">
                    {selectedCharacter.stats?.totalWins || selectedCharacter.stats?.wins || 0}
                  </div>
                  <div className="text-xs text-gray-500 font-arcade">TOTAL WINS</div>
                </div>
                <div className="arcade-panel text-center">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-2xl font-arcade text-neon-blue mb-1">
                    T{selectedCharacter.currentTier}
                  </div>
                  <div className="text-xs text-gray-500 font-arcade">CURRENT TIER</div>
                </div>
                <div className="arcade-panel text-center">
                  <div className="text-3xl mb-2">💎</div>
                  <div className="text-2xl font-arcade text-neon-green mb-1">
                    {getTotalResources(selectedCharacter)}
                  </div>
                  <div className="text-xs text-gray-500 font-arcade">RESOURCES</div>
                </div>
              </div>
            </>
          ) : !loading && (
            <div className="text-center py-12">
              <p className="font-arcade text-gray-400 mb-6">
                Select or create a character to begin
              </p>
            </div>
          )}
        </div>
      </main>

      {/* Character Modal */}
      <CharacterModal
        isOpen={isCharacterModalOpen}
        onClose={() => setIsCharacterModalOpen(false)}
        onCharacterCreated={handleCharacterCreated}
      />
    </div>
  );
};

export default Dashboard;
