const express = require('express');
const router = express.Router();
const { uploadSingle, uploadMultiple, deleteImage } = require('../controllers/upload.controller');
const { protect } = require('../middleware/auth.middleware');
const { adminOnly } = require('../middleware/role.middleware');
const upload = require('../middleware/upload.middleware');

router.post('/single', protect, upload.single('image'), uploadSingle);
router.post('/multiple', protect, adminOnly, upload.array('images', 5), uploadMultiple);
router.delete('/', protect, adminOnly, deleteImage);

module.exports = router;
