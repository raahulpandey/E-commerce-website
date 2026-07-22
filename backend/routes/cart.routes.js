const express = require('express');
const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require('../controllers/cart.controller');

const { protect } = require('../middleware/auth.middleware');
const {
  addToCartValidator,
  updateCartValidator,
} = require('../validators/cart.validator');

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/', ...addToCartValidator, addToCart);
router.patch('/:productId', ...updateCartValidator, updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

module.exports = router;
