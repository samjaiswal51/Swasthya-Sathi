// backend/config/cloudinaryConfig.js

const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Ensure .env file is loaded

// Configure Cloudinary with credentials from .env file
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Force HTTPS URLs
});

// Validate configuration
const validateConfig = () => {
  const { cloud_name, api_key, api_secret } = cloudinary.config();
  
  if (!cloud_name || !api_key || !api_secret) {
    console.error('❌ Cloudinary configuration missing! Please check your .env file.');
    console.error('Required variables: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET');
    return false;
  }
  
  console.log('✅ Cloudinary configuration loaded successfully');
  console.log(`Cloud Name: ${cloud_name}`);
  return true;
};

// Function to generate optimized URL for documents with better browser compatibility
const getOptimizedDocumentUrl = (publicId, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'auto',
      secure: true,
      sign_url: false, // Disable URL signing for public access
      type: 'upload',
      ...options
    };
    
    return cloudinary.url(publicId, defaultOptions);
  } catch (error) {
    console.error('Error generating optimized URL:', error);
    return null;
  }
};

// Function to generate PDF viewing URL with proper headers
const getPdfViewUrl = (publicId, options = {}) => {
  try {
    const pdfOptions = {
      resource_type: 'raw',
      secure: true,
      sign_url: false, // Critical: no signing for PDFs
      type: 'upload',
      format: 'pdf',
      flags: 'immutable_cache',
      ...options
    };
    
    return cloudinary.url(publicId, pdfOptions);
  } catch (error) {
    console.error('Error generating PDF view URL:', error);
    return null;
  }
};

// Function to generate image URL with optimization
const getImageUrl = (publicId, options = {}) => {
  try {
    const imageOptions = {
      resource_type: 'image',
      secure: true,
      sign_url: false,
      quality: 'auto',
      fetch_format: 'auto',
      ...options
    };
    
    return cloudinary.url(publicId, imageOptions);
  } catch (error) {
    console.error('Error generating image URL:', error);
    return null;
  }
};

// Function to generate signed URL (for enhanced security when needed)
const getSignedDocumentUrl = (publicId, options = {}) => {
  try {
    const defaultOptions = {
      resource_type: 'auto',
      sign_url: true,
      type: 'upload',
      secure: true,
      expires_at: Math.round(Date.now() / 1000) + 3600, // 1 hour expiry
      ...options
    };
    
    return cloudinary.url(publicId, defaultOptions);
  } catch (error) {
    console.error('Error generating signed URL:', error);
    return null;
  }
};

// Function to generate URL based on document type
const getDocumentUrl = (publicId, mimeType, resourceType, options = {}) => {
  try {
    if (mimeType && mimeType.startsWith('image/')) {
      return getImageUrl(publicId, options);
    } else if (mimeType === 'application/pdf') {
      return getPdfViewUrl(publicId, options);
    } else {
      // For other document types
      return getOptimizedDocumentUrl(publicId, {
        resource_type: resourceType || 'raw',
        ...options
      });
    }
  } catch (error) {
    console.error('Error generating document URL:', error);
    return cloudinary.url(publicId, {
      resource_type: resourceType || 'raw',
      secure: true,
      sign_url: false
    });
  }
};

// Function to check if a resource exists
const checkResourceExists = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });
    return result ? true : false;
  } catch (error) {
    console.error('Resource check failed:', error);
    return false;
  }
};

// Function to get resource info
const getResourceInfo = async (publicId, resourceType = 'raw') => {
  try {
    const result = await cloudinary.api.resource(publicId, {
      resource_type: resourceType
    });
    return result;
  } catch (error) {
    console.error('Failed to get resource info:', error);
    return null;
  }
};

// Validate on import
validateConfig();

module.exports = cloudinary;
module.exports.getOptimizedDocumentUrl = getOptimizedDocumentUrl;
module.exports.getSignedDocumentUrl = getSignedDocumentUrl;
module.exports.getPdfViewUrl = getPdfViewUrl;
module.exports.getImageUrl = getImageUrl;
module.exports.getDocumentUrl = getDocumentUrl;
module.exports.checkResourceExists = checkResourceExists;
module.exports.getResourceInfo = getResourceInfo;