const ApiError = require('../utils/ApiError');

/**
 * Global centralized error handler (4-argument Express middleware).
 * Must be registered LAST in app.js after all routes.
 *
 * Handles:
 *  - ApiError (our custom errors)
 *  - Mongoose ValidationError
 *  - Mongoose CastError (invalid ObjectId)
 *  - Mongoose Duplicate Key (11000)
 *  - JWT errors
 *  - Generic unexpected errors
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode || 500;

  // --- Mongoose: Invalid ObjectId ---
  if (err.name === 'CastError') {
    error = new ApiError(400, `Invalid ID format: ${err.value}`);
  }

  // --- Mongoose: Validation Error ---
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    error = new ApiError(422, 'Validation failed', messages);
  }

  // --- Mongoose: Duplicate Key ---
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue ? err.keyValue[field] : '';
    error = new ApiError(409, `Duplicate value: '${value}' already exists for ${field}.`);
  }

  // --- JWT errors ---
  if (err.name === 'JsonWebTokenError') {
    error = new ApiError(401, 'Invalid token. Please log in again.');
  }
  if (err.name === 'TokenExpiredError') {
    error = new ApiError(401, 'Token expired. Please log in again.');
  }

  // --- Standard response shape ---
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: error.message || 'Internal Server Error',
    errors: error.errors || [],
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

/**
 * Handles requests to undefined routes (404).
 */
const notFoundHandler = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

module.exports = { errorHandler, notFoundHandler };
