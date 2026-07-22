const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const authService = require('../services/auth.service');
const { cookieOptions, refreshCookieOptions } = require('../utils/tokenUtils');

/**
 * POST /api/v1/auth/register
 */
const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const user = await authService.register({ name, email, password, phone });

  res.status(201).json(new ApiResponse(201, { user }, 'Account created successfully.'));
});

/**
 * POST /api/v1/auth/login
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, accessToken, refreshToken } = await authService.login({ email, password });

  res
    .cookie('accessToken', accessToken, cookieOptions)
    .cookie('refreshToken', refreshToken, refreshCookieOptions)
    .status(200)
    .json(
      new ApiResponse(200, { user, accessToken }, 'Logged in successfully.')
    );
});

/**
 * POST /api/v1/auth/logout
 */
const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user._id);

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json(new ApiResponse(200, {}, 'Logged out successfully.'));
});

/**
 * GET /api/v1/auth/profile
 */
const getProfile = asyncHandler(async (req, res) => {
  const user = await authService.getProfile(req.user._id);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile fetched successfully.'));
});

/**
 * PUT /api/v1/auth/profile
 */
const updateProfile = asyncHandler(async (req, res) => {
  const user = await authService.updateProfile(req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { user }, 'Profile updated successfully.'));
});

/**
 * PUT /api/v1/auth/change-password
 */
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await authService.changePassword(req.user._id, { currentPassword, newPassword });

  res
    .clearCookie('accessToken')
    .clearCookie('refreshToken')
    .status(200)
    .json(new ApiResponse(200, {}, 'Password changed. Please log in again.'));
});

/**
 * POST /api/v1/auth/forgot-password
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  // Always return success to prevent email enumeration
  res.status(200).json(new ApiResponse(200, {}, 'If that email exists, a reset link has been sent.'));
});

/**
 * POST /api/v1/auth/reset-password
 */
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.status(200).json(new ApiResponse(200, {}, 'Password reset successfully. Please log in.'));
});

module.exports = { register, login, logout, getProfile, updateProfile, changePassword, forgotPassword, resetPassword };
