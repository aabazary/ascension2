import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import GatheringPage from './pages/GatheringPage';
import BattlePage from './pages/BattlePage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is authenticated (check localStorage for user data)
    const user = localStorage.getItem('user');
    setIsAuthenticated(!!user);
  }, []);

  return (
    <Router>
      <Routes>
        <Route 
          path="/" 
          element={<LandingPage setIsAuthenticated={setIsAuthenticated} />} 
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
      </Routes>
    </Router>
  );
}

export default App;

