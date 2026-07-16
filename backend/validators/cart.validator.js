const { body, param } = require('express-validator');
const { validate } = require('./auth.validator');

const addToCartValidator = [
  body('productId')
    .notEmpty().withMessage('Product ID is required')
    .isMongoId().withMessage('Invalid product ID'),

  body('quantity')
    .optional()
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  validate,
];

const updateCartValidator = [
  param('productId')
    .isMongoId().withMessage('Invalid product ID in URL'),

  body('quantity')
    .notEmpty().withMessage('Quantity is required')
    .isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),

  validate,
];

module.exports = { addToCartValidator, updateCartValidator };
