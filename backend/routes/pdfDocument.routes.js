const express = require('express');
const router = express.Router();
const {
  uploadAndSummarize,
  getDocumentsForUser,
  getDocumentById,
  deleteDocument,
} = require('../controllers/pdfDocument.controller');
const { protect } = require('../middleware/authMiddleware'); // Using your existing auth middleware

// Apply the 'protect' middleware to all routes in this file.
// This ensures only authenticated users can access these endpoints
// and populates `req.user` for the controllers.
router.use(protect);

// Route to upload a new PDF and generate its summary
router.post('/upload', uploadAndSummarize);

// Route to get all documents for the logged-in user
router.get('/', getDocumentsForUser);

// Routes for a single document by its ID
router
  .route('/:id')
  .get(getDocumentById) // Get details of a specific document
  .delete(deleteDocument); // Delete a specific document

module.exports = router;