const express = require('express');
const router = express.Router();
const {
  uploadAndSummarize,
  getDocumentsForUser,
  getDocumentById,
  deleteDocument,
} = require('../controllers/pdfDocument.controller');
const { protect } = require('../middleware/authMiddleware');
const pdfUpload = require('../middleware/pdfUploadMiddleware'); // IMPORT THE NEW MIDDLEWARE

// Apply the 'protect' middleware to all routes in this file
router.use(protect);

// Route to upload a new PDF and generate its summary
// APPLY THE MIDDLEWARE TO THIS ROUTE
router.post('/upload', pdfUpload.single('document'), uploadAndSummarize);

// Route to get all documents for the logged-in user
router.get('/', getDocumentsForUser);

// Routes for a single document by its ID
router
  .route('/:id')
  .get(getDocumentById) // Get details of a specific document
  .delete(deleteDocument); // Delete a specific document

module.exports = router;
