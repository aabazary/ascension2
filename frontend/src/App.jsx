import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import GatheringPage from './pages/GatheringPage';
import BattlePage from './pages/BattlePage';
import ResetPassword from './pages/ResetPassword';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if user is authenticated (check localStorage for user data)
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
    if (user) {
      setUserData(JSON.parse(user));
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
                }
              }
    } catch (error) {
      console.error('Failed to fetch user data:', error);
    }
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage setIsAuthenticated={setIsAuthenticated} userData={userData} setUserData={setUserData} />} 
        />
        <Route 
          path="/dashboard" 
          element={isAuthenticated ? <Dashboard setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/" />} 
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
          path="/reset-password" 
          element={<ResetPassword />} 
        />
      </Routes>
    </Router>
  );
}

export default App;
