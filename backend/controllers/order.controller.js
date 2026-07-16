const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const orderService = require('../services/order.service');

/**
 * POST /api/v1/orders
 * User: Place an order from cart
 */
const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod } = req.body;
  const order = await orderService.createOrder(req.user._id, { shippingAddress, paymentMethod });
  res.status(201).json(new ApiResponse(201, { order }, 'Order placed successfully.'));
});

/**
 * GET /api/v1/orders
 * User: Get own orders with pagination
 */
const getUserOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getUserOrders(req.user._id, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Orders fetched successfully.'));
});

/**
 * GET /api/v1/orders/:id
 * User: Get a specific order (ownership validated in service)
 */
const getOrderById = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, { order }, 'Order fetched successfully.'));
});

/**
 * PATCH /api/v1/orders/:id/cancel
 * User: Cancel a pending order
 */
const cancelOrder = asyncHandler(async (req, res) => {
  const order = await orderService.cancelOrder(
    req.params.id,
    req.user._id,
    req.body.reason
  );
  res.status(200).json(new ApiResponse(200, { order }, 'Order cancelled successfully.'));
});

// ===================== ADMIN CONTROLLERS =====================

/**
 * GET /api/v1/orders/admin/all
 * Admin: Get all orders
 */
const getAllOrders = asyncHandler(async (req, res) => {
  const result = await orderService.getAllOrders(req.query);
  res.status(200).json(new ApiResponse(200, result, 'All orders fetched successfully.'));
});

/**
 * GET /api/v1/orders/admin/stats
 * Admin: Get order statistics
 */
const getOrderStats = asyncHandler(async (req, res) => {
  const stats = await orderService.getOrderStats();
  res.status(200).json(new ApiResponse(200, { stats }, 'Order stats fetched successfully.'));
});

/**
 * PATCH /api/v1/orders/admin/:id/status
 * Admin: Update order status
 */
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await orderService.updateOrderStatus(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { order }, 'Order status updated.'));
});

/**
 * DELETE /api/v1/orders/admin/:id
 * Admin: Delete an order
 */
const deleteOrder = asyncHandler(async (req, res) => {
  await orderService.deleteOrder(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, 'Order deleted successfully.'));
});

/**
 * GET /api/v1/orders/admin/:id
 * Admin: Get any order by ID
 */
const getOrderByIdAdmin = asyncHandler(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id, null, true);
  res.status(200).json(new ApiResponse(200, { order }, 'Order fetched successfully.'));
});

module.exports = {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
  deleteOrder,
  getOrderByIdAdmin,
};
