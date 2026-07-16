const Review = require('../models/review.model');
const Order = require('../models/order.model');
const ApiError = require('../utils/ApiError');
const { PAGINATION } = require('../config/constants');

const getProductReviews = async (productId, query) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT, 50);
  const skip = (page - 1) * limit;

  const sort = query.sort === 'rating' ? { rating: -1 } : { createdAt: -1 };

  const [reviews, total] = await Promise.all([
    Review.find({ product: productId })
      .populate('user', 'name')
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean(),
    Review.countDocuments({ product: productId }),
  ]);

  // Rating distribution
  const distribution = await Review.aggregate([
    { $match: { product: require('mongoose').Types.ObjectId.createFromHexString(productId) } },
    { $group: { _id: '$rating', count: { $sum: 1 } } },
    { $sort: { _id: -1 } },
  ]);

  return {
    reviews,
    distribution,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
      limit,
    },
  };
};

const addReview = async (productId, userId, data) => {
  // Check if user already reviewed this product
  const existing = await Review.findOne({ product: productId, user: userId });
  if (existing) throw new ApiError(409, 'You have already reviewed this product.');

  // Check if verified purchase
  const hasPurchased = await Order.findOne({
    user: userId,
    'items.product': productId,
    status: 'delivered',
  }).lean();

  const review = await Review.create({
    ...data,
    product: productId,
    user: userId,
    isVerifiedPurchase: !!hasPurchased,
  });

  return review.populate('user', 'name');
};

const updateReview = async (reviewId, userId, data) => {
  const review = await Review.findOne({ _id: reviewId, user: userId });
  if (!review) throw new ApiError(404, 'Review not found or not authorized.');

  Object.assign(review, data);
  await review.save();
  return review.populate('user', 'name');
};

const deleteReview = async (reviewId, userId, isAdmin = false) => {
  const filter = isAdmin ? { _id: reviewId } : { _id: reviewId, user: userId };
  const review = await Review.findOneAndDelete(filter);
  if (!review) throw new ApiError(404, 'Review not found or not authorized.');
};

module.exports = { getProductReviews, addReview, updateReview, deleteReview };
