const express = require('express');
const router = express.Router();
const connectionController = require('../controllers/connectionController');
const auth = require('../middleware/authMiddleware');

// Base route: /api/connections

// Fetching lists
router.get('/my-patients', auth, connectionController.getMyPatients);
router.get('/my-doctors', auth, connectionController.getMyDoctors);

// Actions
router.post('/request', auth, connectionController.requestConnection);
router.put('/:id/approve', auth, connectionController.approveConnection);
router.put('/:id/reject', auth, connectionController.rejectConnection);
router.put('/:id/end', auth, connectionController.endConnection);

module.exports = router;
