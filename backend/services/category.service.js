const Category = require('../models/category.model');
const ApiError = require('../utils/ApiError');

const getAllCategories = async (includeInactive = false) => {
  const filter = includeInactive ? {} : { isActive: true };
  return Category.find(filter).sort({ order: 1, name: 1 }).lean();
};

const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({ slug, isActive: true }).lean();
  if (!category) throw new ApiError(404, 'Category not found.');
  return category;
};

const createCategory = async (data) => {
  const category = await Category.create(data);
  return category;
};

const updateCategory = async (id, data) => {
  const category = await Category.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).lean();
  if (!category) throw new ApiError(404, 'Category not found.');
  return category;
};

const deleteCategory = async (id) => {
  const category = await Category.findByIdAndUpdate(
    id,
    { isActive: false },
    { new: true }
  ).lean();
  if (!category) throw new ApiError(404, 'Category not found.');
};

module.exports = { getAllCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
