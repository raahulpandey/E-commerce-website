const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const wishlistService = require('../services/wishlist.service');

const getWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.getWishlist(req.user._id);
  res.status(200).json(new ApiResponse(200, { wishlist }, 'Wishlist fetched.'));
});

const addToWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.addToWishlist(req.user._id, req.body.productId);
  res.status(200).json(new ApiResponse(200, { wishlist }, 'Added to wishlist.'));
});

const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await wishlistService.removeFromWishlist(req.user._id, req.params.productId);
  res.status(200).json(new ApiResponse(200, { wishlist }, 'Removed from wishlist.'));
});

const clearWishlist = asyncHandler(async (req, res) => {
  await wishlistService.clearWishlist(req.user._id);
  res.status(200).json(new ApiResponse(200, {}, 'Wishlist cleared.'));
});

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
