const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

/**
 * Get or create a cart for the given user.
 * Populates product details for each item.
 */
const getCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId })
    .populate({
      path: 'items.product',
      select: 'title images price discountedPrice stock isActive',
    });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

/**
 * Add a product to the cart or increase its quantity if already present.
 * Validates stock availability before adding.
 */
const addToCart = async (userId, { productId, quantity = 1 }) => {
  // Validate product existence and stock
  const product = await Product.findOne({ _id: productId, isActive: true }).lean();
  if (!product) throw new ApiError(404, 'Product not found.');
  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} unit(s) available in stock.`);
  }

  const effectivePrice =
    product.discountedPrice && product.discountedPrice < product.price
      ? product.discountedPrice
      : product.price;

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (existingItemIndex > -1) {
    // Product already in cart — update quantity
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (newQty > product.stock) {
      throw new ApiError(400, `Cannot add ${quantity} more. Only ${product.stock} units available.`);
    }
    cart.items[existingItemIndex].quantity = newQty;
    cart.items[existingItemIndex].price = effectivePrice; // Refresh price snapshot
  } else {
    // New item
    cart.items.push({ product: productId, quantity, price: effectivePrice });
  }

  await cart.save();
  return getCart(userId); // Return populated cart
};

/**
 * Update the quantity of a specific item in the cart.
 */
const updateCartItem = async (userId, productId, quantity) => {
  // Validate stock
  const product = await Product.findById(productId).select('stock isActive').lean();
  if (!product || !product.isActive) throw new ApiError(404, 'Product not found.');
  if (product.stock < quantity) {
    throw new ApiError(400, `Only ${product.stock} unit(s) available.`);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found.');

  const itemIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId
  );

  if (itemIndex === -1) {
    throw new ApiError(404, 'Product not found in cart.');
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  return getCart(userId);
};

/**
 * Remove a specific product from the cart.
 */
const removeFromCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new ApiError(404, 'Cart not found.');

  const initialLength = cart.items.length;
  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  );

  if (cart.items.length === initialLength) {
    throw new ApiError(404, 'Product not found in cart.');
  }

  await cart.save();
  return getCart(userId);
};

/**
 * Clear all items from the user's cart.
 */
const clearCart = async (userId) => {
  await Cart.findOneAndUpdate(
    { user: userId },
    { items: [] },
    { upsert: true }
  );
};

module.exports = { getCart, addToCart, updateCartItem, removeFromCart, clearCart };
