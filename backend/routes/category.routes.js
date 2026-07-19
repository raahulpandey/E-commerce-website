const express = require('express');
const router = express.Router();
const { getAllCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.get('/', getAllCategories);
router.get('/:slug', getCategoryBySlug);
router.post('/', protect, adminOnly, upload.single('image'), createCategory);
router.put('/:id', protect, adminOnly, upload.single('image'), updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
