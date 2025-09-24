import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { asyncHandler } from '../middleware/errorHandler.js';
import { sendPasswordResetEmail } from '../utils/emailService.js';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }
  
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No account found with that email address'
    });
  }
  
  const resetToken = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 3600000);
  
  await PasswordReset.findOneAndDelete({ userId: user._id });
  
  await PasswordReset.create({
    userId: user._id,
    token: resetToken,
    expiresAt
  });
  
  const emailResult = await sendPasswordResetEmail(email, resetToken);
  
  if (!emailResult.success) {
    return res.status(500).json({
      success: false,
      message: 'Failed to send reset email'
    });
  }
  
  res.json({
    success: true,
    message: 'Password reset email sent successfully'
  });
});

const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;
  
  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Token and new password are required'
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }
  
  const passwordReset = await PasswordReset.findOne({ 
    token, 
    used: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!passwordReset) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }
  
  const user = await User.findById(passwordReset.userId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Use findByIdAndUpdate to ensure the password is saved
  const updatedUser = await User.findByIdAndUpdate(
    user._id,
    { password: hashedPassword },
    { new: true }
  );
  
  passwordReset.used = true;
  await passwordReset.save();
  
  res.json({
    success: true,
    message: 'Password reset successfully'
  });
});

const validateResetToken = asyncHandler(async (req, res) => {
  const { token } = req.params;
  
  const passwordReset = await PasswordReset.findOne({ 
    token, 
    used: false,
    expiresAt: { $gt: new Date() }
  });
  
  if (!passwordReset) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }
  
  res.json({
    success: true,
    message: 'Token is valid'
  });
});

export default {
  requestPasswordReset,
  resetPassword,
  validateResetToken
};
