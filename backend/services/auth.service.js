const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const { generateAccessToken, generateRefreshToken } = require('../utils/tokenUtils');

/**
 * Register a new user.
 * Password hashing is handled by the User model pre-save hook.
 */
const register = async ({ name, email, password, phone }) => {
  // Check duplicate email
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    throw new ApiError(409, 'An account with this email already exists.');
  }

  const user = await User.create({ name, email, password, phone });
  return user.toPublicJSON();
};

/**
 * Authenticate user and return JWT tokens.
 */
const login = async ({ email, password }) => {
  // Explicitly select password field (excluded by default via `select: false`)
  const user = await User.findOne({ email }).select('+password');

  if (!user || !user.isActive) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password.');
  }

  const payload = { userId: user._id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken({ userId: user._id });

  // Persist refresh token hash in DB for rotation
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  return { user: user.toPublicJSON(), accessToken, refreshToken };
};

/**
 * Revoke refresh token on logout.
 */
const logout = async (userId) => {
  await User.findByIdAndUpdate(userId, { $unset: { refreshToken: '' } });
};

/**
 * Get user profile by ID.
 */
const getProfile = async (userId) => {
  const user = await User.findById(userId).lean();
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

/**
 * Update user profile fields (name, phone, address).
 * Does NOT allow email or password changes here.
 */
const updateProfile = async (userId, updateData) => {
  const allowedFields = ['name', 'phone', 'address'];
  const filteredData = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filteredData[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(userId, filteredData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!user) throw new ApiError(404, 'User not found.');
  return user;
};

/**
 * Change password with current-password verification.
 */
const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found.');

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw new ApiError(400, 'Current password is incorrect.');
  }

  user.password = newPassword;
  await user.save();
};

module.exports = { register, login, logout, getProfile, updateProfile, changePassword };
