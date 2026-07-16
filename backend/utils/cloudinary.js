const cloudinary = require('cloudinary').v2;

// Configure from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a buffer to Cloudinary.
 * Returns the secure URL and public_id.
 */
const uploadToCloudinary = (buffer, folder = 'ecommerce') => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [
          { width: 1200, crop: 'limit' }, // Max width 1200px
          { quality: 'auto:good' },
          { fetch_format: 'auto' },
        ],
      },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Delete an image from Cloudinary by its public_id.
 */
const deleteFromCloudinary = async (publicId) => {
  if (!publicId) return;
  return cloudinary.uploader.destroy(publicId);
};

/**
 * Upload multiple buffers concurrently.
 */
const uploadManyToCloudinary = (buffers, folder = 'ecommerce') =>
  Promise.all(buffers.map((buf) => uploadToCloudinary(buf, folder)));

module.exports = { uploadToCloudinary, deleteFromCloudinary, uploadManyToCloudinary };
