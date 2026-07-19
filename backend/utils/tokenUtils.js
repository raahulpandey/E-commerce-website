const jwt = require('jsonwebtoken');

/**
 * Generates a signed JWT access token.
 * @param {Object} payload - Data to embed (userId, role)
 * @returns {string} Signed JWT string
 */
const generateAccessToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_ACCESS_EXPIRY || '15m',
  });
};

/**
 * Generates a signed JWT refresh token with longer expiry.
 * @param {Object} payload - Data to embed (userId)
 * @returns {string} Signed JWT string
 */
const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRY || '7d',
  });
};

/**
 * Verifies a JWT token and returns the decoded payload.
 * @param {string} token
 * @param {string} secret
 * @returns {Object} Decoded payload
 */
const verifyToken = (token, secret) => {
  return jwt.verify(token, secret);
};

/**
 * Cookie options for HttpOnly JWT storage.
 * Secure flag is toggled based on environment.
 */
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: 15 * 60 * 1000, // 15 minutes in ms
};

const refreshCookieOptions = {
  ...cookieOptions,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  cookieOptions,
  refreshCookieOptions,
};
