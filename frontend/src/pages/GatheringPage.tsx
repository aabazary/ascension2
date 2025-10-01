import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';

interface Character {
  _id: string;
  name: string;
  currentTier: number;
}

const GatheringPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const character = location.state?.character as Character;
  
  const [selectedTier, setSelectedTier] = useState(character?.currentTier || 0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [shaking, setShaking] = useState(false);
  const [clickable, setClickable] = useState(false);
  const [successCount, setSuccessCount] = useState(0);
  const [missCount, setMissCount] = useState(0);
  const [feedback, setFeedback] = useState<'success' | 'miss' | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [gameResult, setGameResult] = useState<any>(null);
  const [gatheringConfig, setGatheringConfig] = useState<any>(null);
  
  const buttonClicks = useRef<Array<{ clicked: boolean; clickTime?: number }>>([]);
  const startTime = useRef(0);
  const currentRound = useRef(0);
  const windowTimeout = useRef<any>(null);
  const currentButtonClicked = useRef(false);
  const successCountRef = useRef(0);
  const missCountRef = useRef(0);

  useEffect(() => {
    if (!character) {
      navigate('/dashboard');
      return;
    }
    fetchGatheringConfig();
  }, [character, navigate]);

  const fetchGatheringConfig = async () => {
    try {
      const response = await api.get('/gathering/config');
      if (response.data.success) {
        setGatheringConfig(response.data.config);
      }
    } catch (error) {
      console.error('Failed to fetch gathering config:', error);
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameEnded(false);
    setSuccessCount(0);
    setMissCount(0);
    setFeedback(null);
    buttonClicks.current = [];
    startTime.current = Date.now();
    currentRound.current = 0;
    successCountRef.current = 0;
    missCountRef.current = 0;
    
    // Start first round
    setTimeout(() => showNextButton(), 1000);
  };

  const showNextButton = () => {
    if (!gatheringConfig) return;
    
    const config = gatheringConfig.tiers[selectedTier];
    const totalButtons = config.totalButtons;
    const requiredSuccess = Math.ceil(totalButtons * config.successThreshold);
    
    // Check if all rounds are complete
    if (currentRound.current >= totalButtons) {
      endGame();
      return;
    }
    
    // Check if player has succeeded (reached required success count) - end immediately
    if (successCountRef.current >= requiredSuccess) {
      // Fill remaining rounds with placeholder (not clicked) to meet expected button count
      while (buttonClicks.current.length < totalButtons) {
        buttonClicks.current.push({ clicked: false });
      }
      endGame();
      return;
    }
    
    // Check if player has failed (3 misses) - end immediately
    if (missCountRef.current >= 3) {
      // Fill remaining rounds with misses to meet expected button count
      while (buttonClicks.current.length < totalButtons) {
        buttonClicks.current.push({ clicked: false });
      }
      endGame();
      return;
    }
    
    // Show the clickable window
    setShaking(true);
    setClickable(true);
    currentButtonClicked.current = false; // Reset for this round
    
    // Close window after duration
    windowTimeout.current = setTimeout(() => {
      if (!currentButtonClicked.current) {
        // Window closed without click = miss
        handleMiss();
      }
      setClickable(false);
      setShaking(false);
      currentRound.current++;
      
      // Show next button after delay
      setTimeout(() => showNextButton(), 1000);
    }, config.buttonWindow);
  };

  const handleEggClick = () => {
    if (!isPlaying) {
      return;
    }
    
    if (!clickable) {
      // Clicking outside the active window = penalty miss (but doesn't count as a round)
      const newMissCount = missCountRef.current + 1;
      missCountRef.current = newMissCount;
      setMissCount(newMissCount);
      setFeedback('miss');
      setTimeout(() => setFeedback(null), 500);
      
      // Check if player failed due to spam clicking
      if (newMissCount >= 3) {
        const config = gatheringConfig.tiers[selectedTier];
        // Fill remaining rounds to meet expected button count
        while (buttonClicks.current.length < config.totalButtons) {
          buttonClicks.current.push({ clicked: false });
        }
        // End game after showing feedback
        setTimeout(() => endGame(), 600);
      }
      return;
    }

    // Success!
    currentButtonClicked.current = true; // Mark as clicked
    const clickTime = Date.now() - startTime.current;
    buttonClicks.current.push({ clicked: true, clickTime });
    
    const newSuccessCount = successCountRef.current + 1;
    successCountRef.current = newSuccessCount;
    setSuccessCount(newSuccessCount);
    setClickable(false);
    setShaking(false);
    setFeedback('success');
    setTimeout(() => setFeedback(null), 500);
    
    // Clear the window timeout since they clicked
    if (windowTimeout.current) {
      clearTimeout(windowTimeout.current);
    }
    
    currentRound.current++;
    
    // Check if we've reached required success immediately (don't wait for state update)
    const config = gatheringConfig.tiers[selectedTier];
    const requiredSuccess = Math.ceil(config.totalButtons * config.successThreshold);
    
    if (newSuccessCount >= requiredSuccess) {
      // Fill remaining rounds to meet expected button count
      while (buttonClicks.current.length < config.totalButtons) {
        buttonClicks.current.push({ clicked: false });
      }
      // End game immediately
      setTimeout(() => endGame(), 500);
    } else {
      // Show next button
      setTimeout(() => showNextButton(), 1000);
    }
  };

  const handleMiss = () => {
    buttonClicks.current.push({ clicked: false });
    const newMissCount = missCountRef.current + 1;
    missCountRef.current = newMissCount;
    setMissCount(newMissCount);
    setFeedback('miss');
    setTimeout(() => setFeedback(null), 500);
    
    // Check if we've failed immediately (3 misses)
    if (newMissCount >= 3) {
      const config = gatheringConfig.tiers[selectedTier];
      // Fill remaining rounds to meet expected button count
      while (buttonClicks.current.length < config.totalButtons) {
        buttonClicks.current.push({ clicked: false });
      }
    }
  };

  const endGame = async () => {
    setIsPlaying(false);
    setClickable(false);
    setShaking(false);
    setGameEnded(true);

    const endTime = Date.now();
    const timeSpent = endTime - startTime.current;

    // Submit to backend
    try {
      const response = await api.post('/gathering/perform', {
        characterId: character._id,
        tier: selectedTier,
        gatheringAttempt: {
          buttonClicks: buttonClicks.current,
          timeSpent,
          startTime: startTime.current,
          endTime,
        },
      });

      setGameResult(response.data);
    } catch (error: any) {
      console.error('Failed to complete gathering:', error);
      setGameResult({
        success: false,
        message: error.response?.data?.message || 'Failed to complete gathering',
        successfulClicks: successCount,
        requiredClicks: gatheringConfig ? Math.ceil(gatheringConfig.tiers[selectedTier].totalButtons * gatheringConfig.tiers[selectedTier].successThreshold) : 0,
      });
    }
  };

  const resetGame = () => {
    setGameEnded(false);
    setGameResult(null);
    setSuccessCount(0);
    setMissCount(0);
    buttonClicks.current = [];
    currentRound.current = 0;
  };

  if (!character) {
    return null;
  }

  const config = gatheringConfig?.tiers[selectedTier];

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
          <h1 className="font-arcade text-xl neon-text">ASCENSION</h1>
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="arcade-button"
        >
          DASHBOARD
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="font-arcade text-3xl neon-text mb-2">
              GATHERING RITUAL
            </h2>
            <p className="text-gray-400">Character: {character.name}</p>
            <div className="h-1 w-32 mx-auto mt-4 bg-gradient-to-r from-neon-green to-neon-blue rounded-full"></div>
          </div>

          {/* Tier Selection */}
          <div className="arcade-panel mb-8">
            <h3 className="font-arcade text-sm text-neon-green mb-4 text-center">
              SELECT TIER
            </h3>
            <div className="flex gap-2 justify-center">
              {[0, 1, 2, 3, 4, 5].map((tier) => (
                <button
                  key={tier}
                  onClick={() => !isPlaying && tier <= character.currentTier && setSelectedTier(tier)}
                  disabled={tier > character.currentTier || isPlaying}
                  className={`px-4 py-2 font-arcade text-xs rounded-lg transition-all ${
                    selectedTier === tier
                      ? 'bg-neon-green text-dark-bg shadow-neon'
                      : tier <= character.currentTier
                      ? 'bg-dark-bg border border-dark-border hover:border-neon-green'
                      : 'bg-dark-bg border border-dark-border opacity-30 cursor-not-allowed'
                  }`}
                >
                  T{tier}
                </button>
              ))}
            </div>
            {config && (
              <div className="mt-4 text-center text-sm text-gray-400">
                <p>Total Buttons: {config.totalButtons} | Success Needed: {Math.ceil(config.totalButtons * config.successThreshold)} | Window: {config.buttonWindow}ms | Max Misses: 3</p>
              </div>
            )}
          </div>

          {/* Game Window */}
          <div className="arcade-panel mb-8">
            <div className="relative aspect-video bg-dark-bg rounded-lg border-2 border-dark-border overflow-hidden">
              {/* Game Area */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying && !gameEnded ? (
                  <div className="text-center">
                    <div className="text-6xl mb-4">🥚</div>
                    <p className="text-gray-400 mb-6">Click the dragon egg when it shakes!</p>
                    <button onClick={startGame} className="arcade-button">
                      START GATHERING
                    </button>
                  </div>
                ) : gameEnded && gameResult ? (
                  <div className="text-center">
                    <div className={`text-6xl mb-4 ${gameResult.success ? 'text-neon-green' : 'text-red-500'}`}>
                      {gameResult.success ? '✓' : '✗'}
                    </div>
                    <h3 className={`font-arcade text-2xl mb-4 ${gameResult.success ? 'text-neon-green' : 'text-red-500'}`}>
                      {gameResult.success ? 'SUCCESS!' : 'FAILED'}
                    </h3>
                    {gameResult.success ? (
                      <div className="space-y-2 mb-6">
                        <p className="text-gray-400">Resources Gained:</p>
                        <p className="font-arcade text-3xl text-neon-yellow">
                          {gameResult.resourcesGained || 0}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2 mb-6">
                        <p className="text-gray-400">
                          Successful Clicks: {successCount} | Misses: {missCount}
                        </p>
                        <p className="text-sm text-red-400">
                          {gameResult.message || 'Not enough successful clicks'}
                        </p>
                      </div>
                    )}
                    <button onClick={resetGame} className="arcade-button">
                      TRY AGAIN
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Dragon Egg */}
                    <button
                      onClick={handleEggClick}
                      className={`relative transition-all duration-100 ${
                        shaking ? 'animate-shake' : ''
                      }`}
                    >
                      <div className="text-9xl">🥚</div>
                    </button>

                    {/* Feedback */}
                    {feedback && (
                      <div className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 font-arcade text-4xl animate-bounce ${
                        feedback === 'success' ? 'text-neon-green' : 'text-red-500'
                      }`}>
                        {feedback === 'success' ? '+1' : 'MISS'}
                      </div>
                    )}

                    {/* Score */}
                    <div className="absolute bottom-4 left-4 font-arcade text-sm">
                      <div className="text-neon-green">Success: {successCount}</div>
                      <div className="text-red-500">Misses: {missCount}/3</div>
                      <div className="text-gray-400 mt-2">
                        Round: {currentRound.current + 1}/{config?.totalButtons || 0}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="arcade-panel">
            <h3 className="font-arcade text-sm text-neon-purple mb-4 text-center">
              HOW TO PLAY
            </h3>
            <div className="text-sm text-gray-400 space-y-2">
              <p>• Watch the dragon egg carefully</p>
              <p>• Click the egg ONLY when it shakes</p>
              <p>• Clicking at wrong time = MISS</p>
              <p>• Not clicking when shaking = MISS</p>
              <p>• Get {config ? Math.ceil(config.totalButtons * config.successThreshold) : 3} successes before 3 misses to win!</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GatheringPage;
