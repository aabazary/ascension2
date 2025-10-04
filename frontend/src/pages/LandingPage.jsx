import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import Header from '../components/shared/Header';
import api from '../utils/api';
import { clearAllCaches } from '../utils/cacheUtils';

// Cache for leaderboard data
const leaderboardCache = {
  data: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes cache
};

const LandingPage = ({ setIsAuthenticated, userData, setUserData }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const navigate = useNavigate();

  // Check if cache is valid
  const isCacheValid = useMemo(() => {
    return leaderboardCache.data && 
           (Date.now() - leaderboardCache.timestamp) < leaderboardCache.ttl;
  }, []);

  useEffect(() => {
    // Use cached data if available and valid
    if (isCacheValid) {
      setHighScores(leaderboardCache.data);
      return;
    }
    
    fetchLeaderboard();
  }, [isCacheValid]);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/leaderboard?limit=5');
      if (response.data.success) {
        const leaderboardData = response.data.leaderboard;
        setHighScores(leaderboardData);
        
        // Update cache
        leaderboardCache.data = leaderboardData;
        leaderboardCache.timestamp = Date.now();
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
      // Use cached data if available, even if expired
      if (leaderboardCache.data) {
        setHighScores(leaderboardCache.data);
      }
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleProfileUpdated = (updatedUser) => {
    setUserData(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUserData(null);
    setIsAuthenticated(false);
    clearAllCaches(); // Clear all caches on logout
  };

  const handleGoToDashboard = () => {
    const user = localStorage.getItem('user');
    if (user) {
      navigate('/dashboard');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Header 
        showDashboard={!!userData}
        showLogout={!!userData}
        onLogout={handleLogout}
        userData={userData}
        onProfileUpdated={handleProfileUpdated}
      />
      
      {/* Custom login button for non-authenticated users */}
      {!userData && (
        <div className="absolute top-4 right-4 z-10">
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="px-3 py-2 sm:px-4 sm:py-2 font-arcade text-xs bg-dark-panel border border-dark-border rounded-lg hover:border-neon-pink transition-colors"
          >
            LOGIN
          </button>
        </div>
      )}

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-16">
          {/* Welcome Image */}
          <div className="mb-8">
            <img 
              src="/ascenion/ascension_full.png" 
              alt="Ascension - The Elemental Trial" 
              className="w-full max-w-2xl mx-auto object-contain"
            />
          </div>
          
          <h2 className="font-arcade text-4xl md:text-6xl neon-text mb-6 animate-pulse-neon">
            THE ELEMENTAL TRIAL
          </h2>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Master the elements, gather resources, and battle powerful minions in this epic adventure!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="arcade-button text-lg px-8 py-4 hover:scale-105 transition-transform"
            >
              START YOUR JOURNEY
            </button>
            <button
              onClick={handleGoToDashboard}
              className="arcade-button text-lg px-8 py-4 hover:scale-105 transition-transform"
            >
              CONTINUE ADVENTURE
            </button>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="arcade-panel text-center p-6">
            <div className="text-4xl mb-4">⚔️</div>
            <h3 className="font-arcade text-xl text-neon-green mb-3">BATTLE MINIONS</h3>
            <p className="text-gray-300">
              Fight powerful elemental minions and prove your strength in turn-based combat!
            </p>
          </div>
          <div className="arcade-panel text-center p-6">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="font-arcade text-xl text-neon-blue mb-3">GATHER RESOURCES</h3>
            <p className="text-gray-300">
              Collect precious materials through skill-based gathering mini-games!
            </p>
          </div>
          <div className="arcade-panel text-center p-6">
            <div className="text-4xl mb-4">🏆</div>
            <h3 className="font-arcade text-xl text-neon-pink mb-3">CLIMB THE RANKS</h3>
            <p className="text-gray-300">
              Progress through tiers and compete on the leaderboard!
            </p>
          </div>
        </div>

        {/* Leaderboard Section */}
        {highScores.length > 0 && (
          <div className="arcade-panel">
            <h3 className="font-arcade text-2xl text-neon-yellow mb-6 text-center">
              TOP ADVENTURERS
            </h3>
            <div className="space-y-3">
              {highScores.map((score, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-dark-bg rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="font-arcade text-neon-green text-lg">
                      #{index + 1}
                    </span>
                    <div>
                      <div className="font-arcade text-white">{score.characterName}</div>
                      <div className="text-sm text-gray-400">by {score.username}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-arcade text-neon-yellow">{score.totalWins} wins</div>
                    <div className="text-sm text-gray-400">Tier {score.currentTier}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;
