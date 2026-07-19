const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const reviewService = require('../services/review.service');

const getProductReviews = asyncHandler(async (req, res) => {
  const result = await reviewService.getProductReviews(req.params.productId, req.query);
  res.status(200).json(new ApiResponse(200, result, 'Reviews fetched.'));
});

const addReview = asyncHandler(async (req, res) => {
  const review = await reviewService.addReview(req.params.productId, req.user._id, req.body);
  res.status(201).json(new ApiResponse(201, { review }, 'Review added.'));
});

const updateReview = asyncHandler(async (req, res) => {
  const review = await reviewService.updateReview(req.params.id, req.user._id, req.body);
  res.status(200).json(new ApiResponse(200, { review }, 'Review updated.'));
});

const deleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, req.user._id);
  res.status(200).json(new ApiResponse(200, {}, 'Review deleted.'));
});

const adminDeleteReview = asyncHandler(async (req, res) => {
  await reviewService.deleteReview(req.params.id, null, true);
  res.status(200).json(new ApiResponse(200, {}, 'Review deleted by admin.'));
});

module.exports = { getProductReviews, addReview, updateReview, deleteReview, adminDeleteReview };
