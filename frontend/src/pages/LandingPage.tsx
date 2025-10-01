import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModal from '../components/AuthModal';

interface LandingPageProps {
  setIsAuthenticated: (value: boolean) => void;
}

interface HighScore {
  username: string;
  totalWins: number;
  currentTier: number;
}

const LandingPage = ({ setIsAuthenticated }: LandingPageProps) => {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [highScores, setHighScores] = useState<HighScore[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch high scores from API
    // For now, using mock data
    setHighScores([
      { username: 'DragonSlayer', totalWins: 150, currentTier: 5 },
      { username: 'MageKing', totalWins: 120, currentTier: 4 },
      { username: 'ElementMaster', totalWins: 95, currentTier: 4 },
      { username: 'ShadowCaster', totalWins: 78, currentTier: 3 },
      { username: 'ArcaneWizard', totalWins: 65, currentTier: 3 },
    ]);
  }, []);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="p-6 flex justify-between items-center border-b-2 border-dark-border">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center shadow-neon">
            <span className="text-2xl">🔮</span>
          </div>
          <h1 className="font-arcade text-xl neon-text">ASCENSION</h1>
        </div>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="arcade-button"
        >
          LOGIN / SIGN UP
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="font-arcade text-4xl md:text-6xl neon-text mb-6 animate-pulse-neon">
            THE ELEMENTAL TRIAL
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            Battle through the depths of your subconscious. Master the elements. 
            Defeat the dragons. Face your inner shadow.
          </p>
          <p className="text-2xl text-neon-pink font-arcade mt-8 animate-flicker">
            CAN YOU ASCEND?
          </p>
        </div>

        {/* High Scores */}
        <div className="max-w-4xl mx-auto">
          <div className="arcade-panel">
            <h3 className="font-arcade text-2xl text-center mb-8 flex items-center justify-center gap-3">
              <span className="text-neon-yellow text-3xl">🏆</span>
              <span className="neon-text">TOP MAGES</span>
              <span className="text-neon-yellow text-3xl">🏆</span>
            </h3>

            <div className="space-y-3">
              {/* Table Header */}
              <div className="grid grid-cols-4 gap-4 px-4 py-2 border-b-2 border-neon-blue/30 font-arcade text-xs text-neon-blue">
                <div>RANK</div>
                <div>MAGE</div>
                <div className="text-center">WINS</div>
                <div className="text-center">TIER</div>
              </div>

              {/* Scores */}
              {highScores.map((score, index) => (
                <div
                  key={index}
                  className="score-card grid grid-cols-4 gap-4 items-center"
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-arcade text-lg ${
                      index === 0 ? 'text-neon-yellow' :
                      index === 1 ? 'text-gray-300' :
                      index === 2 ? 'text-neon-orange' :
                      'text-gray-400'
                    }`}>
                      #{index + 1}
                    </span>
                  </div>
                  <div className="font-arcade text-sm text-white truncate">
                    {score.username}
                  </div>
                  <div className="text-center">
                    <span className="text-neon-green font-bold text-lg">
                      {score.totalWins}
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="px-3 py-1 rounded-full bg-gradient-to-r from-neon-purple to-neon-pink font-arcade text-xs">
                      T{score.currentTier}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center">
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="arcade-button"
              >
                JOIN THE TRIAL
              </button>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
          <div className="arcade-panel text-center">
            <div className="text-4xl mb-3">⚔️</div>
            <h4 className="font-arcade text-sm text-neon-purple mb-2">BATTLE DRAGONS</h4>
            <p className="text-sm text-gray-400">Face elemental dragons and prove your might</p>
          </div>
          <div className="arcade-panel text-center">
            <div className="text-4xl mb-3">✨</div>
            <h4 className="font-arcade text-sm text-neon-blue mb-2">UPGRADE GEAR</h4>
            <p className="text-sm text-gray-400">Enhance your equipment to gain power</p>
          </div>
          <div className="arcade-panel text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h4 className="font-arcade text-sm text-neon-pink mb-2">MASTER ELEMENTS</h4>
            <p className="text-sm text-gray-400">Collect resources and ascend through tiers</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="p-6 border-t-2 border-dark-border text-center text-gray-500 text-sm">
        <p>© 2025 ASCENSION - The Elemental Trial</p>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;

