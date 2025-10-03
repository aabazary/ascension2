import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

// Register new user
const register = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!username || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Username, email, and password are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'User already exists with this email or username'
    });
  }

  // Create new user
  const user = new User({
    username,
    email,
    password
  });

  await user.save();

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Store refresh token
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  await user.save();

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.status(201).json({
    success: true,
    message: 'User created successfully',
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

// Login user
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  // Find user
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }

  // Clean expired tokens
  user.cleanExpiredTokens();

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Store refresh token
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  user.lastLogin = new Date();
  await user.save();

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: user._id,
      username: user.username,
      email: user.email
    }
  });
});

// Refresh token
const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'No refresh token provided'
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Check if refresh token exists in user's tokens
    const tokenExists = user.refreshTokens.some(token => token.token === refreshToken);
    if (!tokenExists) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Set new access token cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });

    res.json({
      success: true,
      message: 'Token refreshed successfully'
    });
  } catch (error) {
    // Token verification failed (expired, invalid, etc.)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

// Logout user
const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.cookies;
  
  if (refreshToken) {
    // Remove refresh token from user's tokens
    await User.findByIdAndUpdate(req.user.userId, {
      $pull: { refreshTokens: { token: refreshToken } }
    });
  }

  // Clear cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.json({
    success: true,
    message: 'Logout successful'
  });
});

// Get current user
const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId)
    .populate('characters')
    .select('-password -refreshTokens');

  res.json({
    success: true,
    user
  });
});

// Google OAuth callback
const googleCallback = asyncHandler(async (req, res) => {
  const { user } = req;
  
  if (!user) {
    return res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?error=oauth_failed`);
  }

  // Generate tokens
  const accessToken = jwt.sign(
    { userId: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  // Store refresh token
  user.refreshTokens.push({
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });
  user.lastLogin = new Date();
  await user.save();

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 15 * 60 * 1000
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  // Redirect to frontend with success
  res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}?auth=success`);
});

// Update user profile
const updateProfile = asyncHandler(async (req, res) => {
  const { username, profilePicture } = req.body;
  const userId = req.user.userId;

  // Validation
  if (username && (username.length < 3 || username.length > 20)) {
    return res.status(400).json({
      success: false,
      message: 'Username must be between 3 and 20 characters'
    });
  }

  // Check if username is already taken (if changing username)
  if (username) {
    const existingUser = await User.findOne({ 
      username: username, 
      _id: { $ne: userId } 
    });
    
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Username is already taken'
      });
    }
  }

  // Update user
  const updateData = {};
  if (username) updateData.username = username;
  if (profilePicture !== undefined) updateData.profilePicture = profilePicture;

  const user = await User.findByIdAndUpdate(
    userId,
    updateData,
    { new: true, select: '-password -refreshTokens' }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    message: 'Profile updated successfully',
    user
  });
});

export default {
  register,
  login,
  refresh,
  logout,
  getCurrentUser,
  googleCallback,
  updateProfile
};
