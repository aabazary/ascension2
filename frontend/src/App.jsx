import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import GatheringPage from './pages/GatheringPage';
import BattlePage from './pages/BattlePage';
import BossBattlePage from './pages/BossBattlePage';
import UpgradeStore from './pages/UpgradeStore';
import ResetPassword from './pages/ResetPassword';
import { clearAllCaches } from './utils/cacheUtils';
import { CharacterProvider } from './contexts/CharacterContext';

function App() {
  // Initialize authentication state from sessionStorage (more secure)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Initialize authentication state from sessionStorage
    const user = sessionStorage.getItem('user');
    
    if (user) {
      try {
        const parsedUser = JSON.parse(user);
        setIsAuthenticated(true);
        setUserData(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setIsAuthenticated(false);
        setUserData(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserData(null);
    }
    
    setIsInitialized(true);

    // Handle OAuth redirect
    const urlParams = new URLSearchParams(window.location.search);
    const authStatus = urlParams.get('auth');
    const error = urlParams.get('error');

    if (authStatus === 'success') {
      // OAuth login successful, fetch user data
      fetchUserData();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (error === 'oauth_failed') {
      console.error('OAuth login failed');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }

  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      });
              if (response.ok) {
                const data = await response.json();
                if (data.success) {
                  sessionStorage.setItem('user', JSON.stringify(data.user));
                  setUserData(data.user);
                  setIsAuthenticated(true);
                  clearAllCaches(); // Clear caches on login to ensure fresh data
                }
              }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  // Show loading screen while initializing authentication state
  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Initializing...</p>
        </div>
      </div>
    );
  }

  // Force sync userData from sessionStorage if it's null but sessionStorage has data
  const sessionUser = sessionStorage.getItem('user');
  if (sessionUser && !userData) {
    try {
      const parsedUser = JSON.parse(sessionUser);
      setUserData(parsedUser);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Error parsing user data:', error);
    }
  }

  return (
    <CharacterProvider userData={userData}>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={<LandingPage setIsAuthenticated={setIsAuthenticated} userData={userData} setUserData={setUserData} />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated && userData ? <Dashboard key={userData?._id || userData?.id || 'no-user'} setIsAuthenticated={setIsAuthenticated} userData={userData} setUserData={setUserData} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/gathering" 
            element={isAuthenticated ? <GatheringPage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/battle" 
            element={isAuthenticated ? <BattlePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/boss-battle" 
            element={isAuthenticated ? <BossBattlePage /> : <Navigate to="/" />} 
          />
          <Route 
            path="/upgrade-store" 
            element={isAuthenticated ? <UpgradeStore userData={userData} onProfileUpdated={setUserData} /> : <Navigate to="/" />} 
          />
          <Route 
            path="/reset-password" 
            element={<ResetPassword />} 
          />
        </Routes>
      </Router>
    </CharacterProvider>
  );
}

export default App;
