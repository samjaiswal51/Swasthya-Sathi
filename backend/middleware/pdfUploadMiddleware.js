const multer = require('multer');

// Store the file in memory as a Buffer
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  // This filter only allows PDF files
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only PDF files are allowed for summarization.'), false);
  }
};

const pdfUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 1024 * 1024 * 10, // 10 MB file size limit
  }
});

module.exports = pdfUpload;
