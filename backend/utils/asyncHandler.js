/**
 * Higher-order function that wraps async route handlers.
 * Eliminates repetitive try/catch blocks in every controller.
 *
 * @param {Function} fn - Async controller function (req, res, next)
 * @returns {Function} Express middleware with error forwarding
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
