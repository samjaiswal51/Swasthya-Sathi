// backend/middleware/uploadMiddleware.js

const multer = require('multer');

// Store the file in memory as a Buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // Aligned allowed types with the frontend component (MedicalDocuments.jsx)
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/jpg',
    'text/plain' // Added to support .txt files as per frontend
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    // Provide a clear error message if the file type is wrong
    cb(new Error(`Unsupported file type. Please upload a JPG, PNG, or TXT file.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 1024 * 1024 * 5, // Matched frontend limit of 5 MB
  }
});

module.exports = upload;