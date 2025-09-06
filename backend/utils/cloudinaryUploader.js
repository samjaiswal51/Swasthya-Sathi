// backend/utils/cloudinaryUploader.js

const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');

/**
 * Uploads a file buffer to Cloudinary using a stream.
 * This is a more robust method for handling buffers from multer's memoryStorage.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {object} options - Options for the Cloudinary uploader.
 * @returns {Promise<object>} A promise that resolves with the Cloudinary upload result.
 */
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const defaultOptions = {
      resource_type: 'auto',
      folder: 'swasthya-sathi-documents',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      invalidate: true,
      ...options
    };

    console.log('Cloudinary upload options:', defaultOptions);

    const uploadStream = cloudinary.uploader.upload_stream(
      defaultOptions,
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          return reject(error);
        }
        if (!result) {
          console.error('Cloudinary upload failed: No result returned');
          return reject(new Error('Upload failed: No result returned'));
        }

        console.log('Cloudinary upload successful:', {
          public_id: result.public_id,
          secure_url: result.secure_url
        });
        
        resolve(result);
      }
    );

    // Use streamifier to create a readable stream from the buffer and pipe it to Cloudinary
    streamifier.createReadStream(fileBuffer).pipe(uploadStream);
  });
};


/**
 * Generate a clean download URL for a document
 * @param {string} publicId - The public ID of the document in Cloudinary
 * @param {string} resourceType - The resource type (image/raw)
 * @returns {string} Clean download URL
 */
const generateDownloadUrl = (publicId, resourceType = 'raw') => {
  try {
    return cloudinary.url(publicId, {
      resource_type: resourceType,
      secure: true,
      sign_url: false
    });
  } catch (error) {
    console.error('Error generating download URL:', error);
    return null;
  }
};

/**
 * Generate a clean view URL for a document
 * @param {string} publicId - The public ID of the document in Cloudinary
 * @param {string} resourceType - The resource type (image/raw)
 * @returns {string} Clean view URL
 */
const generateViewUrl = (publicId, resourceType = 'raw') => {
  try {
    if (resourceType === 'image') {
      return cloudinary.url(publicId, {
        resource_type: 'image',
        secure: true,
        quality: 'auto',
        fetch_format: 'auto'
      });
    } else {
      return cloudinary.url(publicId, {
        resource_type: 'raw',
        secure: true
      });
    }
  } catch (error) {
    console.error('Error generating view URL:', error);
    return null;
  }
};

module.exports = { 
  uploadToCloudinary,
  generateDownloadUrl,
  generateViewUrl
};