import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { TIER_THEMES } from '../utils/gatheringThemes';

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
  const currentTheme = TIER_THEMES[selectedTier];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="p-3 sm:p-6 flex justify-between items-center border-b-2 border-dark-border">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 sm:gap-4 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 sm:w-12 sm:h-12 bg-gradient-to-br from-neon-purple to-neon-pink rounded-lg flex items-center justify-center shadow-neon">
            <span className="text-lg sm:text-2xl">🔮</span>
          </div>
          <h1 className="font-arcade text-lg sm:text-xl neon-text">ASCENSION</h1>
        </button>
        <button
          onClick={() => navigate('/dashboard')}
          className="arcade-button text-xs sm:text-sm px-3 py-2 sm:px-4 sm:py-3"
        >
          <span className="hidden sm:inline">DASHBOARD</span>
          <span className="sm:hidden">DASH</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="font-arcade text-xl sm:text-2xl md:text-3xl neon-text mb-2">
              {currentTheme.name.toUpperCase()} DRAGON GATHERING
            </h2>
            <p className="text-gray-400 text-sm sm:text-base">Character: {character.name}</p>
            <div className={`h-1 w-24 sm:w-32 mx-auto mt-3 sm:mt-4 bg-gradient-to-r ${currentTheme.color} rounded-full ${currentTheme.glow}`}></div>
          </div>

          {/* Tier Selection */}
          <div className="arcade-panel mb-8">
            <h3 className="font-arcade text-sm text-neon-green mb-4 text-center">
              SELECT DRAGON TYPE
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3 justify-center">
              {[0, 1, 2, 3, 4, 5].map((tier) => {
                const theme = TIER_THEMES[tier];
                return (
                  <button
                    key={tier}
                    onClick={() => !isPlaying && tier <= character.currentTier && setSelectedTier(tier)}
                    disabled={tier > character.currentTier || isPlaying}
                    className={`relative px-3 py-3 font-arcade text-xs rounded-lg transition-all ${
                      selectedTier === tier
                        ? `bg-gradient-to-br ${theme.color} text-white ${theme.glow}`
                        : tier <= character.currentTier
                        ? 'bg-dark-bg border border-dark-border hover:border-opacity-50'
                        : 'bg-dark-bg border border-dark-border opacity-30 cursor-not-allowed'
                    }`}
                    title={tier > character.currentTier ? 'Locked' : theme.name}
                  >
                    <div className="text-2xl mb-1">{theme.egg}</div>
                    <div className="text-xs">T{tier}</div>
                    <div className="text-[10px] opacity-70">{theme.name}</div>
                  </button>
                );
              })}
            </div>
            {config && (
              <div className="mt-4 text-center text-xs sm:text-sm text-gray-400 px-2">
                <p className="break-words">Total Buttons: {config.totalButtons} | Success Needed: {Math.ceil(config.totalButtons * config.successThreshold)} | Window: {config.buttonWindow}ms | Max Misses: 3</p>
              </div>
            )}
          </div>

          {/* Game Window */}
          <div className="arcade-panel mb-8">
            <div className={`relative aspect-video bg-dark-bg rounded-lg border-2 ${currentTheme.borderColor} overflow-hidden ${shaking && isPlaying ? currentTheme.glow : ''}`}>
              {/* Game Area */}
              <div className="absolute inset-0 flex items-center justify-center">
                {!isPlaying && !gameEnded ? (
                  <div className="text-center p-4">
                    <div 
                      className={`text-4xl sm:text-6xl md:text-8xl mb-4 inline-block leading-[0] ${currentTheme.glow} filter drop-shadow-2xl`}
                      style={{ 
                        background: 'transparent',
                        padding: 0,
                        margin: '0 0 1rem 0',
                        border: 'none'
                      }}
                    >
                      {currentTheme.egg}
                    </div>
                    <p className="text-gray-400 mb-2 mt-4 text-sm sm:text-base">Click the {currentTheme.name} essence when it shakes!</p>
                    <p className="text-xs text-gray-500 mb-4 sm:mb-6 px-2">Don't click at the wrong time or you'll disturb the dragon!</p>
                    <button onClick={startGame} className="arcade-button text-sm sm:text-base px-4 py-2">
                      START GATHERING
                    </button>
                  </div>
                ) : gameEnded && gameResult ? (
                  <div className="text-center p-4">
                    <div className={`text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4 ${gameResult.success ? 'text-neon-green' : 'text-red-500'}`}>
                      {gameResult.success ? '✓' : '✗'}
                    </div>
                    <h3 className={`font-arcade text-lg sm:text-xl md:text-2xl mb-2 sm:mb-4 ${gameResult.success ? 'text-neon-green' : 'text-red-500'}`}>
                      {gameResult.success ? 'SUCCESS!' : 'FAILED'}
                    </h3>
                    {gameResult.success ? (
                      <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                        <p className="text-gray-400 text-sm sm:text-base">Resources Gained:</p>
                        <p className="font-arcade text-xl sm:text-2xl md:text-3xl text-neon-yellow">
                          {gameResult.resourcesGained || 0}
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-1 sm:space-y-2 mb-4 sm:mb-6">
                        <p className="text-gray-400 text-sm sm:text-base">
                          Successful Clicks: {successCount} | Misses: {missCount}
                        </p>
                        <p className="text-xs sm:text-sm text-red-400 px-2">
                          {gameResult.message || 'Not enough successful clicks'}
                        </p>
                      </div>
                    )}
                    <button onClick={resetGame} className="arcade-button text-sm sm:text-base px-4 py-2">
                      TRY AGAIN
                    </button>
                  </div>
                ) : (
                  <>
                    {/* Dragon Egg */}
                    <div
                      onClick={handleEggClick}
                      className={`cursor-pointer select-none text-[6rem] sm:text-[8rem] md:text-[10rem] leading-[0] inline-block ${
                        shaking ? 'animate-shake' : ''
                      } ${
                        clickable ? `${currentTheme.glow} scale-110 filter drop-shadow-2xl` : 'opacity-50 scale-100'
                      } transition-all duration-200`}
                      style={{ 
                        background: 'transparent',
                        padding: 0,
                        margin: 0,
                        border: 'none',
                        outline: 'none'
                      }}
                    >
                      {currentTheme.egg}
                    </div>

                    {/* Feedback */}
                    {feedback && (
                      <div className={`absolute top-1/3 left-1/2 transform -translate-x-1/2 font-arcade text-2xl sm:text-3xl md:text-4xl animate-bounce ${
                        feedback === 'success' ? 'text-neon-green' : 'text-red-500'
                      }`}>
                        {feedback === 'success' ? '+1' : 'MISS'}
                      </div>
                    )}

                    {/* Score */}
                    <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 font-arcade text-xs sm:text-sm">
                      <div className="text-neon-green">Success: {successCount}</div>
                      <div className="text-red-500">Misses: {missCount}/3</div>
                      <div className="text-gray-400 mt-1 sm:mt-2">
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
            <h3 className={`font-arcade text-xs sm:text-sm mb-3 sm:mb-4 text-center bg-gradient-to-r ${currentTheme.color} bg-clip-text text-transparent`}>
              HOW TO GATHER {currentTheme.name.toUpperCase()} ESSENCE
            </h3>
            <div className="text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-2 px-2">
              <p>• Watch the {currentTheme.name} essence carefully</p>
              <p>• Click ONLY when it shakes and glows bright</p>
              <p>• Clicking at wrong time = MISS (disturbs the dragon!)</p>
              <p>• Not clicking when shaking = MISS (opportunity lost!)</p>
              <p>• Get {config ? Math.ceil(config.totalButtons * config.successThreshold) : 3} successes before 3 misses to win!</p>
              <p className={`text-xs mt-2 sm:mt-3 pt-2 sm:pt-3 border-t ${currentTheme.borderColor} border-opacity-30`}>
                Each dragon type requires different timing. Higher tiers = faster reactions needed!
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default GatheringPage;
