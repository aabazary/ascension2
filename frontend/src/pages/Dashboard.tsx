import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface UserData {
  username: string;
  email: string;
}

const Dashboard = ({ setIsAuthenticated }: DashboardProps) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUserData(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b-2 border-dark-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center shadow-neon">
            <span className="text-2xl">🔮</span>
          </div>
          <div>
            <h1 className="font-arcade text-xl neon-text">ASCENSION</h1>
            {userData && (
              <p className="text-sm text-gray-400">Welcome, {userData.username}</p>
            )}
          </div>
        </div>
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
          {/* Title */}
          <div className="text-center mb-12">
            <h2 className="font-arcade text-3xl neon-text mb-4 animate-pulse-neon">
              CHOOSE YOUR PATH
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-neon-blue to-neon-pink rounded-full"></div>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Gathering */}
            <button className="group arcade-panel hover:border-neon-green transition-all duration-300 text-left relative overflow-hidden">
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
          </div>

          {/* Character Stats Section (placeholder) */}
          <div className="mt-12 arcade-panel">
            <h3 className="font-arcade text-lg text-neon-purple mb-6 text-center">
              YOUR CHARACTERS
            </h3>
            <div className="text-center text-gray-500 py-8">
              <p className="font-arcade text-sm mb-4">No characters yet</p>
              <button className="arcade-button">
                CREATE CHARACTER
              </button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="arcade-panel text-center">
              <div className="text-3xl mb-2">🏆</div>
              <div className="text-2xl font-arcade text-neon-yellow mb-1">0</div>
              <div className="text-xs text-gray-500 font-arcade">TOTAL WINS</div>
            </div>
            <div className="arcade-panel text-center">
              <div className="text-3xl mb-2">⭐</div>
              <div className="text-2xl font-arcade text-neon-blue mb-1">T0</div>
              <div className="text-xs text-gray-500 font-arcade">CURRENT TIER</div>
            </div>
            <div className="arcade-panel text-center">
              <div className="text-3xl mb-2">💎</div>
              <div className="text-2xl font-arcade text-neon-green mb-1">0</div>
              <div className="text-xs text-gray-500 font-arcade">RESOURCES</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

