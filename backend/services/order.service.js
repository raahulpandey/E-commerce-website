const mongoose = require('mongoose');
const Order = require('../models/order.model');
const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const { ORDER_STATUS, PAGINATION } = require('../config/constants');

/**
 * Create a new order from the user's cart.
 *
 * Workflow:
 * 1. Load cart with populated product data
 * 2. Validate all items are in stock
 * 3. Snapshot item details (price, title, image)
 * 4. Deduct stock for each product (atomic $inc)
 * 5. Save order with initial status history
 * 6. Clear the user's cart
 * 7. Return order summary
 */
const createOrder = async (userId, { shippingAddress, paymentMethod = 'cod' }) => {
  // 1. Load cart
  const cart = await Cart.findOne({ user: userId }).populate({
    path: 'items.product',
    select: 'title price discountedPrice stock isActive images',
  });

  if (!cart || cart.items.length === 0) {
    throw new ApiError(400, 'Your cart is empty. Add products before placing an order.');
  }

  // 2. Validate stock for all items simultaneously
  const stockErrors = [];
  for (const item of cart.items) {
    const product = item.product;
    if (!product || !product.isActive) {
      stockErrors.push(`A product in your cart is no longer available.`);
      continue;
    }
    if (product.stock < item.quantity) {
      stockErrors.push(
        `Insufficient stock for "${product.title}". Available: ${product.stock}, Requested: ${item.quantity}`
      );
    }
  }

  if (stockErrors.length > 0) {
    throw new ApiError(400, 'Stock validation failed', stockErrors);
  }

  // 3. Build order items (price snapshot)
  const orderItems = cart.items.map((item) => {
    const product = item.product;
    const effectivePrice =
      product.discountedPrice && product.discountedPrice < product.price
        ? product.discountedPrice
        : product.price;

    return {
      product: product._id,
      title: product.title,
      price: effectivePrice,
      quantity: item.quantity,
      image: product.images?.[0] || '',
    };
  });

  // 4. Calculate total
  const totalAmount = parseFloat(
    orderItems
      .reduce((sum, item) => sum + item.price * item.quantity, 0)
      .toFixed(2)
  );

  // 5. Deduct stock atomically for each product
  const stockUpdates = orderItems.map((item) =>
    Product.findByIdAndUpdate(item.product, {
      $inc: { stock: -item.quantity },
    })
  );
  await Promise.all(stockUpdates);

  // 6. Create order
  const order = await Order.create({
    user: userId,
    items: orderItems,
    shippingAddress,
    totalAmount,
    paymentMethod,
    statusHistory: [{ status: ORDER_STATUS.PENDING, note: 'Order placed' }],
  });

  // 7. Clear cart
  await Cart.findOneAndUpdate({ user: userId }, { items: [] });

  return order;
};

/**
 * Get all orders for the authenticated user with pagination.
 */
const getUserOrders = async (userId, query) => {
  const page = Math.max(parseInt(query.page) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT, 50);
  const skip = (page - 1) * limit;

  const filter = { user: userId };
  if (query.status) filter.status = query.status;

  const [orders, total] = await Promise.all([
    Order.find(filter)
      .select('-statusHistory -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      limit,
    },
  };
};

/**
 * Get a specific order by ID — validates ownership.
 */
const getOrderById = async (orderId, userId, isAdmin = false) => {
  const filter = { _id: orderId };
  if (!isAdmin) filter.user = userId; // Users can only see their own orders

  const order = await Order.findOne(filter)
    .populate('user', 'name email phone')
    .lean();

  if (!order) throw new ApiError(404, 'Order not found.');
  return order;
};

/**
 * Cancel an order (User can only cancel PENDING orders).
 */
const cancelOrder = async (orderId, userId, reason = '') => {
  const order = await Order.findOne({ _id: orderId, user: userId });
  if (!order) throw new ApiError(404, 'Order not found.');

  if (order.status !== ORDER_STATUS.PENDING) {
    throw new ApiError(
      400,
      `Cannot cancel an order with status "${order.status}". Only pending orders can be cancelled.`
    );
  }

  // Restore stock
  const stockRestores = order.items.map((item) =>
    Product.findByIdAndUpdate(item.product, { $inc: { stock: item.quantity } })
  );
  await Promise.all(stockRestores);

  order.status = ORDER_STATUS.CANCELLED;
  order.cancelledAt = new Date();
  order.cancellationReason = reason;
  order.statusHistory.push({
    status: ORDER_STATUS.CANCELLED,
    note: reason || 'Cancelled by user',
  });

  await order.save();
  return order;
};

// ===================== ADMIN SERVICES =====================

/**
 * Get all orders (Admin) with pagination and optional status filter.
 */
const getAllOrders = async (query) => {
  const page = Math.max(parseInt(query.page) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT, 100);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query.status) filter.status = query.status;

  // Aggregation pipeline for rich admin view with user info
  const [orders, total] = await Promise.all([
    Order.find(filter)
      .populate('user', 'name email phone')
      .select('-statusHistory -__v')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    Order.countDocuments(filter),
  ]);

  return {
    orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total,
      limit,
    },
  };
};

/**
 * Update order status (Admin only).
 */
const updateOrderStatus = async (orderId, { status, note }) => {
  const order = await Order.findById(orderId);
  if (!order) throw new ApiError(404, 'Order not found.');

  order.status = status;
  order.statusHistory.push({ status, note });

  if (status === ORDER_STATUS.DELIVERED) {
    order.isDelivered = true;
    order.deliveredAt = new Date();
  }

  await order.save();
  return order;
};

/**
 * Delete an order (Admin hard delete).
 */
const deleteOrder = async (orderId) => {
  const order = await Order.findByIdAndDelete(orderId);
  if (!order) throw new ApiError(404, 'Order not found.');
};

/**
 * Get order statistics using aggregation pipeline (Admin).
 */
const getOrderStats = async () => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalRevenue: { $sum: '$totalAmount' },
      },
    },
    { $sort: { count: -1 } },
  ]);

  const totalRevenue = await Order.aggregate([
    { $match: { status: { $ne: ORDER_STATUS.CANCELLED } } },
    { $group: { _id: null, revenue: { $sum: '$totalAmount' } } },
  ]);

  return {
    byStatus: stats,
    totalRevenue: totalRevenue[0]?.revenue || 0,
  };
};

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderStats,
};
