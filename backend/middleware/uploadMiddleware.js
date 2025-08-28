// backend/middleware/uploadMiddleware.js

const multer = require('multer');

// Store the file in memory as a Buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  console.log('File filter check:', {
    filename: file.originalname,
    mimetype: file.mimetype,
    size: file.size
  });

  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/jpeg',
    'image/png',
    'image/jpg',
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    console.log('✅ File type allowed:', file.mimetype);
    cb(null, true);
  } else {
    console.log('❌ File type rejected:', file.mimetype);
    cb(new Error(`Unsupported file type: ${file.mimetype}. Please upload PDF, DOC, DOCX, JPG, or PNG.`), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 1024 * 1024 * 10, // 10 MB file size limit
    files: 1 // Only allow 1 file at a time
  }
});

// Error handling middleware for multer
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File too large. Maximum size allowed is 10MB.' 
      });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Too many files. Only 1 file allowed at a time.' 
      });
    }
  }
  
  if (err.message.includes('Unsupported file type')) {
    return res.status(400).json({ 
      message: err.message 
    });
  }
  
  next(err);
};

module.exports = upload;
module.exports.handleMulterError = handleMulterError;