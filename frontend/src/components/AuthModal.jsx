import { useState } from 'react';
import api from '../utils/api';

const AuthModal = ({ isOpen, onClose, onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (showForgotPassword) {
        const response = await api.post('/password-reset/request', {
          email: formData.email,
        });

        if (response.data.success) {
          setMessage('Password reset email sent! Check your inbox.');
          setShowForgotPassword(false);
        } else {
          setError(response.data.message || 'Failed to send reset email');
        }
      } else if (isLogin) {
        const response = await api.post('/auth/login', {
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
          onAuthSuccess();
          onClose();
        } else {
          setError(response.data.message || 'Login failed');
        }
      } else {
        const response = await api.post('/auth/register', {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });

        if (response.data.success) {
          sessionStorage.setItem('user', JSON.stringify(response.data.user));
          onAuthSuccess();
          onClose();
        } else {
          setError(response.data.message || 'Registration failed');
        }
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setShowForgotPassword(false);
    setError('');
    setMessage('');
    setFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_API_URL || '/api';
    window.location.href = `${backendUrl}/auth/google`;
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setError('');
    setMessage('');
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setError('');
    setMessage('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="arcade-panel max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-arcade text-xl text-neon-green">
            {showForgotPassword ? 'FORGOT PASSWORD' : (isLogin ? 'LOGIN' : 'REGISTER')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {showForgotPassword ? (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
                placeholder="Enter your email address"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {isLogin ? 'Email' : 'Username'}
                </label>
                <input
                  type={isLogin ? 'email' : 'text'}
                  name={isLogin ? 'email' : 'username'}
                  value={isLogin ? formData.email : formData.username}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
                />
              </div>

              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
                />
              </div>
            </>
          )}

          {error && (
            <div className="text-red-400 text-sm text-center">{error}</div>
          )}

          {message && (
            <div className="text-green-400 text-sm text-center">{message}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full arcade-button py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'LOADING...' : (showForgotPassword ? 'SEND RESET EMAIL' : (isLogin ? 'LOGIN' : 'REGISTER'))}
          </button>
        </form>

        {/* Google OAuth Button */}
        {!showForgotPassword && (
          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-bg text-gray-400">Or continue with</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="w-full mt-4 flex items-center justify-center px-4 py-2 border border-gray-600 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        )}

        <div className="mt-4 text-center space-y-2">
          {showForgotPassword ? (
            <button
              onClick={handleBackToLogin}
              className="text-neon-blue hover:text-neon-pink transition-colors text-sm"
            >
              Back to Login
            </button>
          ) : (
            <>
              <button
                onClick={toggleMode}
                className="text-neon-blue hover:text-neon-pink transition-colors text-sm block"
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
              </button>
              {isLogin && (
                <button
                  onClick={handleForgotPassword}
                  className="text-gray-400 hover:text-gray-300 transition-colors text-sm block"
                >
                  Forgot your password?
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
