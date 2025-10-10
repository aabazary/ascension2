import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';
import Header from '../components/shared/Header';
import api from '../utils/api';
import { clearAllCaches, isCacheValid } from '../utils/cacheUtils';

// Cache for leaderboard data
const leaderboardCache = {
  data: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes cache
};

// Cache for top adventurers data
const topAdventurersCache = {
  data: null,
  timestamp: 0,
  ttl: 5 * 60 * 1000 // 5 minutes cache
};

const LandingPage = ({ setIsAuthenticated, userData, setUserData }) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [highScores, setHighScores] = useState([]);
  const [topAdventurers, setTopAdventurers] = useState({
    gatherers: [],
    bossKillers: [],
    minionDestroyers: [],
    masterDuelists: []
  });
  const navigate = useNavigate();

  // Check if cache is valid
  const isLeaderboardCacheValid = useMemo(() => isCacheValid(leaderboardCache), []);
  const isTopAdventurersCacheValid = useMemo(() => isCacheValid(topAdventurersCache), []);

  useEffect(() => {
    // Use cached data if available and valid
    if (isLeaderboardCacheValid) {
      setHighScores(leaderboardCache.data);
    } else {
      fetchLeaderboard();
    }

    if (isTopAdventurersCacheValid) {
      setTopAdventurers(topAdventurersCache.data);
    } else {
      fetchTopAdventurers();
    }
  }, [isLeaderboardCacheValid, isTopAdventurersCacheValid]);

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

  const fetchTopAdventurers = async () => {
    try {
      const [gatherersRes, bossKillersRes, minionDestroyersRes, masterDuelistsRes] = await Promise.all([
        api.get('/leaderboard/gatherers?limit=3'),
        api.get('/leaderboard/boss-killers?limit=3'),
        api.get('/leaderboard/minion-destroyers?limit=3'),
        api.get('/leaderboard/master-duelists?limit=3')
      ]);

      const topAdventurersData = {
        gatherers: gatherersRes.data.success ? gatherersRes.data.leaderboard : [],
        bossKillers: bossKillersRes.data.success ? bossKillersRes.data.leaderboard : [],
        minionDestroyers: minionDestroyersRes.data.success ? minionDestroyersRes.data.leaderboard : [],
        masterDuelists: masterDuelistsRes.data.success ? masterDuelistsRes.data.leaderboard : []
      };

      setTopAdventurers(topAdventurersData);
      
      // Update cache
      topAdventurersCache.data = topAdventurersData;
      topAdventurersCache.timestamp = Date.now();
    } catch (error) {
      console.error('Failed to fetch top adventurers:', error);
      // Use cached data if available, even if expired
      if (topAdventurersCache.data) {
        setTopAdventurers(topAdventurersCache.data);
      }
    }
  };

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleProfileUpdated = (updatedUser) => {
    setUserData(updatedUser);
    sessionStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    sessionStorage.removeItem('user');
    setUserData(null);
    setIsAuthenticated(false);
    clearAllCaches(); // Clear all caches on logout
  };

  const handleGoToDashboard = () => {
    const user = sessionStorage.getItem('user');
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
        showLogin={!userData}
        onLogout={handleLogout}
        onLogin={() => setIsAuthModalOpen(true)}
        userData={userData}
        onProfileUpdated={handleProfileUpdated}
      />

      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          {/* Welcome Image */}
          <div className="mb-6">
            <img 
              src="/ascenion/ascension_full.png" 
              alt="Ascension - The Elemental Trial" 
              className="w-full max-w-xl mx-auto object-contain"
            />
          </div>
          
          <h2 className="font-arcade text-3xl md:text-5xl neon-text mb-4 animate-pulse-neon">
            THE ELEMENTAL TRIAL
          </h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 max-w-2xl mx-auto">
            Master the elements, gather resources, and battle powerful minions in this epic adventure!
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="arcade-button text-base px-6 py-3 hover:scale-105 transition-transform"
            >
              START YOUR JOURNEY
            </button>
            <button
              onClick={handleGoToDashboard}
              className="arcade-button text-base px-6 py-3 hover:scale-105 transition-transform"
            >
              CONTINUE ADVENTURE
            </button>
          </div>
        </div>

        {/* Features Section - More compact */}
        <div className="grid md:grid-cols-3 gap-4 mb-12">
          <div className="arcade-panel text-center p-4">
            <div className="text-3xl mb-3">⚔️</div>
            <h3 className="font-arcade text-lg text-neon-green mb-2">BATTLE MINIONS</h3>
            <p className="text-sm text-gray-300">
              Fight powerful elemental minions in turn-based combat!
            </p>
          </div>
          <div className="arcade-panel text-center p-4">
            <div className="text-3xl mb-3">💎</div>
            <h3 className="font-arcade text-lg text-neon-blue mb-2">GATHER RESOURCES</h3>
            <p className="text-sm text-gray-300">
              Collect materials through skill-based mini-games!
            </p>
          </div>
          <div className="arcade-panel text-center p-4">
            <div className="text-3xl mb-3">🏆</div>
            <h3 className="font-arcade text-lg text-neon-pink mb-2">CLIMB THE RANKS</h3>
            <p className="text-sm text-gray-300">
              Progress through tiers and compete on leaderboards!
            </p>
          </div>
        </div>

        {/* Top Adventurers Section - 4 smaller categories */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Master Duelist */}
          <div className="arcade-panel">
            <h4 className="font-arcade text-lg text-neon-yellow mb-3 text-center">
              👑 MASTER DUELIST
            </h4>
            <div className="space-y-2">
              {topAdventurers.masterDuelists.length > 0 ? (
                topAdventurers.masterDuelists.map((duelist, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-dark-bg rounded text-xs">
                    <div>
                      <div className="font-arcade text-white text-xs">{duelist.characterName}</div>
                      <div className="text-gray-400 text-xs">by {duelist.username}</div>
                    </div>
                    <div className="text-neon-yellow font-arcade text-xs">
                      {duelist.masterKills || 0}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-xs py-4">No Master duelists yet</div>
              )}
            </div>
          </div>

          {/* Master Gatherer */}
          <div className="arcade-panel">
            <h4 className="font-arcade text-lg text-neon-green mb-3 text-center">
              ✨ MASTER GATHERER
            </h4>
            <div className="space-y-2">
              {topAdventurers.gatherers.length > 0 ? (
                topAdventurers.gatherers.map((gatherer, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-dark-bg rounded text-xs">
                    <div>
                      <div className="font-arcade text-white text-xs">{gatherer.characterName}</div>
                      <div className="text-gray-400 text-xs">by {gatherer.username}</div>
                    </div>
                    <div className="text-neon-green font-arcade text-xs">
                      {gatherer.totalGathers || 0}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-xs py-4">No gatherers yet</div>
              )}
            </div>
          </div>

          {/* Master Destroyer */}
          <div className="arcade-panel">
            <h4 className="font-arcade text-lg text-neon-pink mb-3 text-center">
              ⚔️ MASTER DESTROYER
            </h4>
            <div className="space-y-2">
              {topAdventurers.minionDestroyers.length > 0 ? (
                topAdventurers.minionDestroyers.map((destroyer, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-dark-bg rounded text-xs">
                    <div>
                      <div className="font-arcade text-white text-xs">{destroyer.characterName}</div>
                      <div className="text-gray-400 text-xs">by {destroyer.username}</div>
                    </div>
                    <div className="text-neon-pink font-arcade text-xs">
                      {destroyer.totalMinionBattles || 0}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-xs py-4">No destroyers yet</div>
              )}
            </div>
          </div>

          {/* Master Brawler */}
          <div className="arcade-panel">
            <h4 className="font-arcade text-lg text-neon-blue mb-3 text-center">
              👑 MASTER BRAWLER
            </h4>
            <div className="space-y-2">
              {topAdventurers.bossKillers.length > 0 ? (
                topAdventurers.bossKillers.map((brawler, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-dark-bg rounded text-xs">
                    <div>
                      <div className="font-arcade text-white text-xs">{brawler.characterName}</div>
                      <div className="text-gray-400 text-xs">by {brawler.username}</div>
                    </div>
                    <div className="text-neon-blue font-arcade text-xs">
                      {brawler.totalBosses || 0}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-400 text-xs py-4">No brawlers yet</div>
              )}
            </div>
          </div>
        </div>
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
