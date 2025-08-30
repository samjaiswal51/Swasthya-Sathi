// backend/utils/cloudinaryUploader.js

const cloudinary = require('../config/cloudinaryConfig');

/**
 * Uploads a file buffer to Cloudinary with proper resource type handling.
 * @param {Buffer} fileBuffer - The buffer of the file to upload.
 * @param {object} options - Options for the Cloudinary uploader.
 * @returns {Promise<object>} A promise that resolves with the Cloudinary upload result.
 */
const uploadToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    // Default options for document uploads
    const defaultOptions = {
      resource_type: 'auto', // Let Cloudinary auto-detect the resource type
      folder: 'swasthya-sathi-documents',
      use_filename: true,
      unique_filename: true,
      overwrite: false,
      invalidate: true, // Invalidate CDN cache for immediate availability
      access_mode: 'public', // Ensure public access
      ...options
    };

    console.log('Cloudinary upload options:', defaultOptions);

    // Create upload stream
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
          secure_url: result.secure_url,
          resource_type: result.resource_type,
          format: result.format,
          bytes: result.bytes
        });

        // Ensure the URL is secure (HTTPS)
        result.secure_url = result.secure_url.replace('http://', 'https://');
        
        resolve(result);
      }
    );

    // Handle stream errors
    uploadStream.on('error', (error) => {
      console.error('Upload stream error:', error);
      reject(error);
    });

    // Write the buffer to the stream
    uploadStream.end(fileBuffer);
  });
};

/**
 * Generate a clean download URL for a document
 * @param {string} publicId - The public ID of the document in Cloudinary
 * @param {string} resourceType - The resource type (image/raw)
 * @param {string} originalFileName - The original filename for proper download
 * @returns {string} Clean download URL
 */
const generateDownloadUrl = (publicId, resourceType = 'raw', originalFileName = '') => {
  try {
    // Generate clean URL without attachment flags
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