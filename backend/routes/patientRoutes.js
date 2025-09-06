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
    viewDocument,
    deleteDocument,
    // Import new controllers
    getSwasthyaCard,
    getScanProfile,
    getPatientBySwasthyaId
} = require('../controllers/patientController');

// --- Swasthya Card Routes ---

// 1. Private Route for the logged-in patient to view their own card
router.get('/profile/swasthya-card', protect, getSwasthyaCard);

// 2. Public Route for QR Code scanning (uses patient's MongoDB ID)
router.get('/scan/:patientId', getScanProfile);

// 3. Public Route for emergency access via 6-digit Card ID
router.get('/swasthya-id/:swasthyaId', getPatientBySwasthyaId);


// --- Profile Routes ---
router.route('/profile')
    .get(protect, getPatientProfile)
    .post(protect, updatePatientProfile);

// --- Document Routes ---
router.route('/documents')
    .get(protect, getDocuments)
    .post(protect, upload.single('document'), uploadDocument);

router.route('/documents/:id')
    .get(protect, getDocument)
    .delete(protect, deleteDocument);

router.route('/documents/:id/view')
    .get(protect, viewDocument);

module.exports = router;
