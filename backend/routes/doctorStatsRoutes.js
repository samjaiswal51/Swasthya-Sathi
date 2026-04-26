const express = require('express');
const router = express.Router();
const doctorStatsController = require('../controllers/doctorStatsController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Get all aggregated doctor stats
router.get('/', [auth, role('doctor')], doctorStatsController.getDoctorStats);

module.exports = router;
