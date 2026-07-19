const express = require('express');
const router = express.Router();

const {
  createOrder,
  getUserOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  getOrderStats,
  updateOrderStatus,
  deleteOrder,
  getOrderByIdAdmin,
} = require('../controllers/order.controller');

const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const {
  createOrderValidator,
  updateOrderStatusValidator,
} = require('../validators/order.validator');

// All order routes require authentication
router.use(protect);

// ===================== ADMIN ROUTES (registered first to avoid /:id conflicts) =====================
router.get('/admin/all', adminOnly, getAllOrders);
router.get('/admin/stats', adminOnly, getOrderStats);
router.get('/admin/:id', adminOnly, getOrderByIdAdmin);
router.patch('/admin/:id/status', adminOnly, updateOrderStatusValidator, updateOrderStatus);
router.delete('/admin/:id', adminOnly, deleteOrder);

// ===================== USER ROUTES =====================
router.post('/', createOrderValidator, createOrder);
router.get('/', getUserOrders);
router.get('/:id', getOrderById);
router.patch('/:id/cancel', cancelOrder);

module.exports = router;
