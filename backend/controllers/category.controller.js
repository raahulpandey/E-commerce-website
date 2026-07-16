const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const categoryService = require('../services/category.service');
const { uploadToCloudinary } = require('../utils/cloudinary');

const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await categoryService.getAllCategories();
  res.status(200).json(new ApiResponse(200, { categories }, 'Categories fetched.'));
});

const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await categoryService.getCategoryBySlug(req.params.slug);
  res.status(200).json(new ApiResponse(200, { category }, 'Category fetched.'));
});

const createCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    const { url } = await uploadToCloudinary(req.file.buffer, 'ecommerce/categories');
    data.image = url;
  }

  const category = await categoryService.createCategory(data);
  res.status(201).json(new ApiResponse(201, { category }, 'Category created.'));
});

const updateCategory = asyncHandler(async (req, res) => {
  const data = { ...req.body };

  if (req.file) {
    const { url } = await uploadToCloudinary(req.file.buffer, 'ecommerce/categories');
    data.image = url;
  }

  const category = await categoryService.updateCategory(req.params.id, data);
  res.status(200).json(new ApiResponse(200, { category }, 'Category updated.'));
});

const deleteCategory = asyncHandler(async (req, res) => {
  await categoryService.deleteCategory(req.params.id);
  res.status(200).json(new ApiResponse(200, {}, 'Category deleted.'));
});

module.exports = { getAllCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
