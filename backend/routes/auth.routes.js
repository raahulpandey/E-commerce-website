const express = require('express');
const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
} = require('../controllers/auth.controller');

const { protect } = require('../middleware/auth.middleware');
const { authLimiter } = require('../middleware/rateLimit.middleware');

const {
  registerValidator,
  loginValidator,
  changePasswordValidator,
  updateProfileValidator,
} = require('../validators/auth.validator');

// Public routes (rate-limited)
router.post('/register', authLimiter, ...registerValidator, register);
router.post('/login', authLimiter, ...loginValidator, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/logout', protect, logout);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, ...updateProfileValidator, updateProfile);
router.put('/change-password', protect, ...changePasswordValidator, changePassword);

module.exports = router;
