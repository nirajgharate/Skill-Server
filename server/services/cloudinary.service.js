import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Cloudinary folder name (e.g., 'skill-server/profiles')
 * @param {string} publicId - Optional public ID for the image
 * @returns {Promise<Object>} - Upload response with secure_url
 */
export const uploadToCloudinary = async (filePath, folder = 'skill-server', publicId = null) => {
  try {
    const options = {
      folder,
      resource_type: 'auto', // Automatically detects file type
      quality: 'auto',
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(filePath, options);

    // Delete temp file if it exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      cloudinaryId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    // Clean up temp file on error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
};

/**
 * Upload Base64 image to Cloudinary
 * @param {string} base64Data - Base64 encoded image
 * @param {string} folder - Cloudinary folder name
 * @param {string} publicId - Optional public ID
 * @returns {Promise<Object>} - Upload response
 */
export const uploadBase64ToCloudinary = async (base64Data, folder = 'skill-server', publicId = null) => {
  try {
    const options = {
      folder,
      resource_type: 'auto',
      quality: 'auto',
    };

    if (publicId) {
      options.public_id = publicId;
    }

    const result = await cloudinary.uploader.upload(base64Data, options);

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
      cloudinaryId: result.public_id,
    };
  } catch (error) {
    console.error('Cloudinary Base64 upload error:', error);
    throw new Error(`Cloudinary Base64 upload failed: ${error.message}`);
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} publicId - Public ID of image to delete
 * @returns {Promise<Object>} - Deletion response
 */
export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      message: 'Image deleted successfully',
      result,
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error(`Cloudinary delete failed: ${error.message}`);
  }
};

/**
 * Get Cloudinary image optimization URL
 * @param {string} publicId - Public ID of image
 * @param {Object} options - Optimization options
 * @returns {string} - Optimized image URL
 */
export const getOptimizedImageUrl = (publicId, options = {}) => {
  const defaultOptions = {
    width: 400,
    height: 400,
    crop: 'fill',
    quality: 'auto',
    fetch_format: 'auto',
  };

  const finalOptions = { ...defaultOptions, ...options };

  return cloudinary.url(publicId, finalOptions);
};

export default {
  uploadToCloudinary,
  uploadBase64ToCloudinary,
  deleteFromCloudinary,
  getOptimizedImageUrl,
};
