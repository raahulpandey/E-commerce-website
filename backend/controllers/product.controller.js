const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const productService = require('../services/product.service');

/**
 * GET /api/v1/products
 * Public: List, search, filter, sort, and paginate products
 */
const getAllProducts = asyncHandler(async (req, res) => {
  const result = await productService.getAllProducts(req.query);
  res.status(200).json(new ApiResponse(200, result, 'Products fetched successfully.'));
});

/**
 * GET /api/v1/products/categories
 * Public: Get all unique categories with product count
 */
const getCategories = asyncHandler(async (req, res) => {
  const categories = await productService.getCategories();
  res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched successfully.'));
});

/**
 * GET /api/v1/products/:id
 * Public: Get a single product
 */
const getProductById = asyncHandler(async (req, res) => {
  const product = await productService.getProductById(req.params.id);
  res.status(200).json(new ApiResponse(200, { product }, 'Product fetched successfully.'));
});

/**
 * POST /api/v1/products
 * Admin: Create a new product
 */
const createProduct = asyncHandler(async (req, res) => {
  const product = await productService.createProduct(req.body, req.user._id);
  res.status(201).json(new ApiResponse(201, { product }, 'Product created successfully.'));
});

/**
 * PUT /api/v1/products/:id
 * Admin: Update an existing product
 */
const updateProduct = asyncHandler(async (req, res) => {
  const product = await productService.updateProduct(req.params.id, req.body);
  res.status(200).json(new ApiResponse(200, { product }, 'Product updated successfully.'));
});

/**
 * DELETE /api/v1/products/:id
 * Admin: Soft-delete a product
 */
const deleteProduct = asyncHandler(async (req, res) => {
  await productService.deleteProduct(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, 'Product deleted successfully.'));
});

module.exports = {
  getAllProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
