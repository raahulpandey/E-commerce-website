const Order = require('../models/order.model');
const User = require('../models/user.model');
const Product = require('../models/product.model');
const { ORDER_STATUS } = require('../config/constants');

/**
 * Admin dashboard analytics using MongoDB aggregation pipelines.
 * Returns revenue, order counts, user stats, and top products.
 */
const getDashboardStats = async () => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);

  const [
    orderStats,
    revenueThisMonth,
    revenueLastMonth,
    userStats,
    productStats,
    topProducts,
    recentOrders,
    ordersByStatus,
    revenueByDay,
  ] = await Promise.all([
    // Total orders + revenue
    Order.aggregate([
      { $match: { status: { $ne: ORDER_STATUS.CANCELLED } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$totalAmount' },
          avgOrderValue: { $avg: '$totalAmount' },
        },
      },
    ]),

    // Revenue this month
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          status: { $ne: ORDER_STATUS.CANCELLED },
        },
      },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]),

    // Revenue last month
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
          status: { $ne: ORDER_STATUS.CANCELLED },
        },
      },
      { $group: { _id: null, revenue: { $sum: '$totalAmount' }, count: { $sum: 1 } } },
    ]),

    // User stats
    User.aggregate([
      {
        $group: {
          _id: null,
          totalUsers: { $sum: 1 },
          activeUsers: { $sum: { $cond: ['$isActive', 1, 0] } },
        },
      },
    ]),

    // Product stats
    Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: { $sum: { $cond: ['$isActive', 1, 0] } },
          outOfStock: { $sum: { $cond: [{ $eq: ['$stock', 0] }, 1, 0] } },
        },
      },
    ]),

    // Top 5 products by revenue
    Order.aggregate([
      { $match: { status: { $ne: ORDER_STATUS.CANCELLED } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          title: { $first: '$items.title' },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
    ]),

    // Latest 5 orders
    Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(5)
      .select('totalAmount status createdAt items')
      .lean(),

    // Orders by status
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),

    // Revenue last 30 days (for chart)
    Order.aggregate([
      {
        $match: {
          createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
          status: { $ne: ORDER_STATUS.CANCELLED },
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]),
  ]);

  const thisMonth = revenueThisMonth[0] || { revenue: 0, count: 0 };
  const lastMonth = revenueLastMonth[0] || { revenue: 0, count: 0 };
  const revenueGrowth =
    lastMonth.revenue > 0
      ? (((thisMonth.revenue - lastMonth.revenue) / lastMonth.revenue) * 100).toFixed(1)
      : 0;

  return {
    overview: {
      totalOrders: orderStats[0]?.totalOrders || 0,
      totalRevenue: parseFloat((orderStats[0]?.totalRevenue || 0).toFixed(2)),
      avgOrderValue: parseFloat((orderStats[0]?.avgOrderValue || 0).toFixed(2)),
      totalUsers: userStats[0]?.totalUsers || 0,
      activeUsers: userStats[0]?.activeUsers || 0,
      totalProducts: productStats[0]?.totalProducts || 0,
      outOfStock: productStats[0]?.outOfStock || 0,
    },
    monthlyComparison: {
      thisMonth: { revenue: thisMonth.revenue, orders: thisMonth.count },
      lastMonth: { revenue: lastMonth.revenue, orders: lastMonth.count },
      revenueGrowth: parseFloat(revenueGrowth),
    },
    topProducts,
    recentOrders,
    ordersByStatus,
    revenueByDay,
  };
};

module.exports = { getDashboardStats };
