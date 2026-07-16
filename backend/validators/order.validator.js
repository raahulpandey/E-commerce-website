const { body } = require('express-validator');
const { validate } = require('./auth.validator');
const { ORDER_STATUS } = require('../config/constants');

const createOrderValidator = [
  body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
  body('shippingAddress.street').trim().notEmpty().withMessage('Street is required'),
  body('shippingAddress.city').trim().notEmpty().withMessage('City is required'),
  body('shippingAddress.state').trim().notEmpty().withMessage('State is required'),
  body('shippingAddress.zipCode').trim().notEmpty().withMessage('Zip code is required'),
  body('shippingAddress.country').optional().trim(),

  body('paymentMethod')
    .optional()
    .isIn(['cod', 'online']).withMessage('Payment method must be cod or online'),

  validate,
];

const updateOrderStatusValidator = [
  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(Object.values(ORDER_STATUS))
    .withMessage(`Status must be one of: ${Object.values(ORDER_STATUS).join(', ')}`),

  body('note').optional().trim(),

  validate,
];

module.exports = { createOrderValidator, updateOrderStatusValidator };
