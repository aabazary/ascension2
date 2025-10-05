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
  // Initialize authentication state from localStorage to prevent redirect on refresh
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = localStorage.getItem('user');
    return !!user;
  });
  const [userData, setUserData] = useState(() => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    // Check if user is authenticated (check localStorage for user data)
    const user = localStorage.getItem('user');
    // Only update state if it's different from initial state
    if (user && !isAuthenticated) {
      setIsAuthenticated(true);
      setUserData(JSON.parse(user));
    } else if (!user && isAuthenticated) {
      setIsAuthenticated(false);
      setUserData(null);
    }

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
                  localStorage.setItem('user', JSON.stringify(data.user));
                  setUserData(data.user);
                  setIsAuthenticated(true);
                  clearAllCaches(); // Clear caches on login to ensure fresh data
                }
              }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <CharacterProvider>
      <Router>
        <Routes>
          <Route 
            path="/" 
            element={<LandingPage setIsAuthenticated={setIsAuthenticated} userData={userData} setUserData={setUserData} />} 
          />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} userData={userData} setUserData={setUserData} /> : <Navigate to="/" />} 
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
