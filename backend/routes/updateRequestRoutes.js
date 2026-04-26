const express = require('express');
const router = express.Router();
const updateRequestController = require('../controllers/updateRequestController');
const auth = require('../middleware/authMiddleware');
const requireActiveConnection = require('../middleware/connectionMiddleware');

// Base route: /api/update-requests

// Creation (Doctor only) - Requires Active Connection
router.post('/', auth, requireActiveConnection, updateRequestController.createRequest);

// Retrieval
router.get('/patients/search', auth, updateRequestController.searchPatients);
router.get('/patient', auth, updateRequestController.getPatientRequests);
router.get('/patient/clinical-notes', auth, updateRequestController.getClinicalNotes);
// Doctor's sent requests
router.get('/doctor', auth, updateRequestController.getDoctorRequests);

// Single request
router.get('/:id', auth, updateRequestController.getRequestById);

// Approval / Rejection (Patient only)
router.put('/:id/approve', auth, updateRequestController.approveRequest);
router.put('/:id/reject', auth, updateRequestController.rejectRequest);

module.exports = router;
