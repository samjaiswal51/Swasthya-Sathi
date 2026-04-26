const express = require('express');
const router = express.Router();
const reportAnalyzerController = require('../controllers/reportAnalyzerController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');

// Memory storage keeps the file in a Buffer so we can pass it directly to pdf-parse / tesseract
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDFs and Images are allowed'), false);
    }
  }
});

router.post('/upload', auth, upload.single('report'), reportAnalyzerController.uploadAndAnalyze);
router.get('/history', auth, reportAnalyzerController.getHistory);
router.get('/:id', auth, reportAnalyzerController.getAnalysis);
router.delete('/:id', auth, reportAnalyzerController.deleteAnalysis);

module.exports = router;
