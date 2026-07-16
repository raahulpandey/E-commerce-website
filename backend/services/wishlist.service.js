const Wishlist = require('../models/wishlist.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');

const getWishlist = async (userId) => {
  let wishlist = await Wishlist.findOne({ user: userId }).populate({
    path: 'products.product',
    select: 'title price discountedPrice images rating stock isActive',
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ user: userId, products: [] });
  }
  return wishlist;
};

const addToWishlist = async (userId, productId) => {
  const product = await Product.findOne({ _id: productId, isActive: true }).lean();
  if (!product) throw new ApiError(404, 'Product not found.');

  let wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) wishlist = new Wishlist({ user: userId, products: [] });

  const alreadyAdded = wishlist.products.some(
    (p) => p.product.toString() === productId
  );
  if (alreadyAdded) throw new ApiError(409, 'Product already in wishlist.');

  wishlist.products.push({ product: productId });
  await wishlist.save();

  return getWishlist(userId);
};

const removeFromWishlist = async (userId, productId) => {
  const wishlist = await Wishlist.findOne({ user: userId });
  if (!wishlist) throw new ApiError(404, 'Wishlist not found.');

  const initialLength = wishlist.products.length;
  wishlist.products = wishlist.products.filter(
    (p) => p.product.toString() !== productId
  );

  if (wishlist.products.length === initialLength) {
    throw new ApiError(404, 'Product not found in wishlist.');
  }

  await wishlist.save();
  return getWishlist(userId);
};

const clearWishlist = async (userId) => {
  await Wishlist.findOneAndUpdate({ user: userId }, { products: [] }, { upsert: true });
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, clearWishlist };
