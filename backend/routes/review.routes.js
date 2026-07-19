const express = require('express');
const router = express.Router({ mergeParams: true }); // mergeParams to get :productId
const { getProductReviews, addReview, updateReview, deleteReview, adminDeleteReview } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');

// /api/v1/products/:productId/reviews
router.get('/', getProductReviews);
router.post('/', protect, addReview);

// /api/v1/reviews/:id
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.delete('/admin/:id', protect, adminOnly, adminDeleteReview);

module.exports = router;
