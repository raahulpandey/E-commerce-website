const express = require('express');
const router = express.Router();

const {
  getAllProducts,
  getCategories,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/product.controller');

const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const {
  createProductValidator,
  updateProductValidator,
} = require('../validators/product.validator');

// Public routes
// NOTE: /categories must be registered BEFORE /:id to prevent 'categories' being treated as an ID
router.get('/categories', getCategories);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/', protect, adminOnly, ...createProductValidator, createProduct);
router.put('/:id', protect, adminOnly, ...updateProductValidator, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
