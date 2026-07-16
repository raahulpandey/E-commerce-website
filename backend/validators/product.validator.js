const { body } = require('express-validator');
const { validate } = require('./auth.validator');

const createProductValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Product title is required')
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3–200 characters'),

  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('discountedPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Discounted price must be a non-negative number')
    .custom((value, { req }) => {
      if (parseFloat(value) >= parseFloat(req.body.price)) {
        throw new Error('Discounted price must be less than the original price');
      }
      return true;
    }),

  body('category')
    .trim()
    .notEmpty().withMessage('Category is required'),

  body('brand')
    .optional()
    .trim(),

  body('stock')
    .notEmpty().withMessage('Stock is required')
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),

  body('images.*')
    .optional()
    .isURL().withMessage('Each image must be a valid URL'),

  validate,
];

const updateProductValidator = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 }).withMessage('Title must be 3–200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 }).withMessage('Description cannot exceed 5000 characters'),

  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('Price must be a non-negative number'),

  body('discountedPrice')
    .optional()
    .isFloat({ min: 0 }).withMessage('Discounted price must be a non-negative number'),

  body('stock')
    .optional()
    .isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),

  body('images')
    .optional()
    .isArray().withMessage('Images must be an array'),

  body('images.*')
    .optional()
    .isURL().withMessage('Each image must be a valid URL'),

  validate,
];

module.exports = { createProductValidator, updateProductValidator };
