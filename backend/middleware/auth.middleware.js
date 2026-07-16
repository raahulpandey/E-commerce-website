const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');
const { verifyToken } = require('../utils/tokenUtils');
const User = require('../models/user.model');

/**
 * Protects routes by verifying the JWT access token.
 * Token is read from HttpOnly cookie first, then Authorization header (Bearer).
 * Attaches the authenticated user to req.user.
 */
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Try cookie-based token
  if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }
  // 2. Fallback: Authorization header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    throw new ApiError(401, 'Access denied. No token provided.');
  }

  // Verify token
  let decoded;
  try {
    decoded = verifyToken(token, process.env.JWT_SECRET);
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Token expired. Please log in again.');
    }
    throw new ApiError(401, 'Invalid token.');
  }

  // Fetch user and verify still active
  const user = await User.findById(decoded.userId).select('-password -refreshToken').lean();

  if (!user) {
    throw new ApiError(401, 'User belonging to this token no longer exists.');
  }

  if (!user.isActive) {
    throw new ApiError(403, 'Your account has been deactivated. Contact support.');
  }

  req.user = user;
  next();
});

module.exports = { protect };
