const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const cartService = require('../services/cart.service');

/**
 * GET /api/v1/cart
 * User: Get current user's cart
 */
const getCart = asyncHandler(async (req, res) => {
  const cart = await cartService.getCart(req.user._id);
  res.status(200).json(new ApiResponse(200, { cart }, 'Cart fetched successfully.'));
});

/**
 * POST /api/v1/cart
 * User: Add item to cart
 */
const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const cart = await cartService.addToCart(req.user._id, { productId, quantity });
  res.status(200).json(new ApiResponse(200, { cart }, 'Item added to cart.'));
});

/**
 * PATCH /api/v1/cart/:productId
 * User: Update item quantity
 */
const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;
  const cart = await cartService.updateCartItem(req.user._id, productId, parseInt(quantity));
  res.status(200).json(new ApiResponse(200, { cart }, 'Cart item updated.'));
});

/**
 * DELETE /api/v1/cart/:productId
 * User: Remove a specific item from cart
 */
const removeFromCart = asyncHandler(async (req, res) => {
  const cart = await cartService.removeFromCart(req.user._id, req.params.productId);
  res.status(200).json(new ApiResponse(200, { cart }, 'Item removed from cart.'));
});

/**
 * DELETE /api/v1/cart
 * User: Clear entire cart
 */
const clearCart = asyncHandler(async (req, res) => {
  await cartService.clearCart(req.user._id);
  res.status(200).json(new ApiResponse(200, {}, 'Cart cleared successfully.'));
});

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
