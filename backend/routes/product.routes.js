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
const { cacheControl } = require('../middleware/cache.middleware');
const {
  createProductValidator,
  updateProductValidator,
} = require('../validators/product.validator');

// Public routes — cache for 5 minutes (products don't change often)
// NOTE: /categories must be BEFORE /:id to avoid being treated as an ObjectId
router.get('/categories', cacheControl(300), getCategories);
router.get('/', cacheControl(300), getAllProducts);
router.get('/:id', cacheControl(60), getProductById);

// Admin-only routes (no caching)
router.post('/', protect, adminOnly, ...createProductValidator, createProduct);
router.put('/:id', protect, adminOnly, ...updateProductValidator, updateProduct);
router.delete('/:id', protect, adminOnly, deleteProduct);

module.exports = router;
