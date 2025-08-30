// backend/routes/patientRoutes.js

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
    getPatientProfile,
    updatePatientProfile,
    uploadDocument,
    getDocuments,
    getDocument,
    viewDocument, // Add this new function
    deleteDocument
} = require('../controllers/patientController');

// Profile routes
router.route('/profile')
    .get(protect, getPatientProfile)
    .post(protect, updatePatientProfile);

// Document list and upload routes
router.route('/documents')
    .get(protect, getDocuments)
    .post(protect, upload.single('document'), uploadDocument);

// Single document routes
router.route('/documents/:id')
    .get(protect, getDocument)
    .delete(protect, deleteDocument);

// ADD THIS NEW ROUTE FOR VIEWING
router.route('/documents/:id/view')
    .get(protect, viewDocument);

module.exports = router;