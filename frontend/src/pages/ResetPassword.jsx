import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../utils/api';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [tokenValid, setTokenValid] = useState(null);

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link');
      return;
    }

    // Validate token
    const validateToken = async () => {
      try {
        const response = await api.get(`/password-reset/validate/${token}`);
        if (response.data.success) {
          setTokenValid(true);
        } else {
          setTokenValid(false);
          setError('Invalid or expired reset link');
        }
      } catch (error) {
        setTokenValid(false);
        setError('Invalid or expired reset link');
      }
    };

    validateToken();
  }, [token]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/password-reset/reset', {
        token,
        newPassword: formData.newPassword
      });

      if (response.data.success) {
        setMessage('Password reset successfully! You can now login with your new password.');
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        setError(response.data.message || 'Failed to reset password');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (tokenValid === null) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-green mx-auto mb-4"></div>
          <p className="text-gray-400">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (tokenValid === false) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="arcade-panel max-w-md w-full mx-4 text-center">
          <h2 className="font-arcade text-xl text-red-500 mb-4">INVALID LINK</h2>
          <p className="text-gray-400 mb-6">This password reset link is invalid or has expired.</p>
          <button
            onClick={() => navigate('/')}
            className="arcade-button px-6 py-3"
          >
            GO TO HOME
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center">
      <div className="arcade-panel max-w-md w-full mx-4">
        <div className="text-center mb-6">
          <h2 className="font-arcade text-xl text-neon-green mb-2">RESET PASSWORD</h2>
          <p className="text-gray-400 text-sm">Enter your new password below</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              New Password
            </label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
              placeholder="Enter new password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:border-neon-pink focus:outline-none"
              placeholder="Confirm new password"
            />
          </div>

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
            {loading ? 'RESETTING...' : 'RESET PASSWORD'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => navigate('/')}
            className="text-neon-blue hover:text-neon-pink transition-colors text-sm"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
