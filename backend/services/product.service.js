const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const { PAGINATION } = require('../config/constants');

/**
 * Build a MongoDB filter query from URL query params.
 * Supports: search (text), category, brand, minPrice, maxPrice, inStock
 */
const buildProductFilter = (query) => {
  const filter = { isActive: true };

  if (query.search) {
    filter.$text = { $search: query.search };
  }

  if (query.category) {
    filter.category = query.category.toLowerCase();
  }

  if (query.brand) {
    filter.brand = { $regex: new RegExp(query.brand, 'i') };
  }

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = parseFloat(query.minPrice);
    if (query.maxPrice) filter.price.$lte = parseFloat(query.maxPrice);
  }

  if (query.inStock === 'true') {
    filter.stock = { $gt: 0 };
  }

  return filter;
};

/**
 * Build a MongoDB sort object from query params.
 * Supports: price_asc, price_desc, rating_desc, newest (default), relevance (text search)
 */
const buildProductSort = (sortBy, hasTextSearch) => {
  const sortMap = {
    price_asc: { price: 1 },
    price_desc: { price: -1 },
    rating_desc: { 'rating.average': -1 },
    newest: { createdAt: -1 },
    oldest: { createdAt: 1 },
  };

  // When doing a text search, default to text relevance score
  if (hasTextSearch && !sortBy) {
    return { score: { $meta: 'textScore' } };
  }

  return sortMap[sortBy] || { createdAt: -1 };
};

/**
 * Get all products with filtering, sorting, searching, and pagination.
 * Uses .lean() and .select() for maximum query performance.
 *
 * Performance target: ~30% faster than naive find().
 */
const getAllProducts = async (query) => {
  const page = Math.max(parseInt(query.page) || PAGINATION.DEFAULT_PAGE, 1);
  const limit = Math.min(
    parseInt(query.limit) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const skip = (page - 1) * limit;

  const filter = buildProductFilter(query);
  const sort = buildProductSort(query.sortBy, !!query.search);

  // Projection: exclude heavy description in list view
  const projection = '-description -__v';

  // Add text score projection for relevance sort
  let queryBuilder = Product.find(filter)
    .select(projection)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .lean(); // lean() returns plain JS objects, ~40% faster than Mongoose documents

  if (query.search) {
    queryBuilder = Product.find(filter, { score: { $meta: 'textScore' } })
      .select(projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();
  }

  // Run query and count in parallel for performance
  const [products, total] = await Promise.all([
    queryBuilder,
    Product.countDocuments(filter),
  ]);

  return {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get a single product by ID.
 */
const getProductById = async (id) => {
  const product = await Product.findOne({ _id: id, isActive: true }).lean();
  if (!product) throw new ApiError(404, 'Product not found.');
  return product;
};

/**
 * Create a new product (Admin).
 */
const createProduct = async (productData, adminId) => {
  const product = await Product.create({ ...productData, createdBy: adminId });
  return product;
};

/**
 * Update a product by ID (Admin).
 */
const updateProduct = async (id, updateData) => {
  const product = await Product.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();

  if (!product) throw new ApiError(404, 'Product not found.');
  return product;
};

/**
 * Soft-delete a product (Admin). Sets isActive = false instead of hard delete.
 * Preserves order history integrity.
 */
const deleteProduct = async (id) => {
  const product = await Product.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).lean();

  if (!product) throw new ApiError(404, 'Product not found.');
};

/**
 * Get unique categories using aggregation pipeline.
 * Cached-friendly: this rarely changes.
 */
const getCategories = async () => {
  const result = await Product.aggregate([
    { $match: { isActive: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $project: { category: '$_id', count: 1, _id: 0 } },
  ]);
  return result;
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
};
