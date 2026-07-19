const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/ApiResponse');
const ApiError = require('../utils/ApiError');
const { uploadToCloudinary, uploadManyToCloudinary, deleteFromCloudinary } = require('../utils/cloudinary');

/**
 * POST /api/v1/upload/single
 * Upload one image and return its URL.
 */
const uploadSingle = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'No image file provided.');

  const result = await uploadToCloudinary(req.file.buffer, 'ecommerce/general');
  res.status(200).json(new ApiResponse(200, result, 'Image uploaded successfully.'));
});

/**
 * POST /api/v1/upload/multiple
 * Upload up to 5 images and return their URLs.
 */
const uploadMultiple = asyncHandler(async (req, res) => {
  if (!req.files || req.files.length === 0) throw new ApiError(400, 'No image files provided.');
  if (req.files.length > 5) throw new ApiError(400, 'Maximum 5 images allowed per upload.');

  const results = await uploadManyToCloudinary(
    req.files.map((f) => f.buffer),
    'ecommerce/products'
  );

  res.status(200).json(new ApiResponse(200, { images: results }, 'Images uploaded successfully.'));
});

/**
 * DELETE /api/v1/upload
 * Delete an image from Cloudinary by publicId.
 */
const deleteImage = asyncHandler(async (req, res) => {
  const { publicId } = req.body;
  if (!publicId) throw new ApiError(400, 'publicId is required.');

  await deleteFromCloudinary(publicId);
  res.status(200).json(new ApiResponse(200, {}, 'Image deleted.'));
});

module.exports = { uploadSingle, uploadMultiple, deleteImage };
