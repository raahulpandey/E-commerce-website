const ApiError = require('../utils/ApiError');
const { ROLES } = require('../config/constants');

/**
 * Middleware factory for role-based access control.
 * Must be used AFTER the `protect` middleware (requires req.user).
 *
 * @param {...string} roles - Allowed roles (e.g., 'admin', 'user')
 * @returns {Function} Express middleware
 *
 * Usage: router.delete('/:id', protect, authorize(ROLES.ADMIN), handler)
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Authentication required.'));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(
          403,
          `Access denied. Required role(s): [${roles.join(', ')}]. Your role: ${req.user.role}`
        )
      );
    }

    next();
  };
};

/**
 * Shorthand for admin-only routes.
 */
const adminOnly = authorize(ROLES.ADMIN);

module.exports = { authorize, adminOnly };
