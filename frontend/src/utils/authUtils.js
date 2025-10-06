// Shared authentication utilities

/**
 * Standard logout handler that clears caches and navigates to home
 * @param {Function} navigate - React Router navigate function
 * @param {Function} clearAllCaches - Function to clear all caches
 */
export const handleLogout = async (navigate, clearAllCaches) => {
  try {
    const { default: api } = await import('./api');
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout failed:', error);
  } finally {
    // Always clear session and navigate, even if logout API fails
    sessionStorage.removeItem('user');
    if (clearAllCaches) {
      clearAllCaches();
    }
    navigate('/');
  }
};

/**
 * Standard profile update handler
 * @param {Object} updatedUserData - Updated user data
 * @param {Function} setUserData - Function to update user data state
 */
export const handleProfileUpdated = (updatedUserData, setUserData) => {
  setUserData(updatedUserData);
  sessionStorage.setItem('user', JSON.stringify(updatedUserData));
};

/**
 * Fetch user data from API
 * @param {Function} setUserData - Function to update user data state
 * @param {Function} navigate - React Router navigate function
 */
export const fetchUserData = async (setUserData, navigate) => {
  try {
    const { default: api } = await import('./api');
    const response = await api.get('/auth/me');
    if (response.data.success) {
      setUserData(response.data.user);
    }
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    if (navigate) {
      navigate('/');
    }
  }
};
