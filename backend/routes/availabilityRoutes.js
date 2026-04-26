const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

// Doctor endpoints
router.post('/add', [auth, role('doctor')], availabilityController.addAvailability);
router.put('/edit/:id', [auth, role('doctor')], availabilityController.editAvailability);
router.delete('/:id', [auth, role('doctor')], availabilityController.deleteAvailability);
router.get('/my', [auth, role('doctor')], availabilityController.getMyAvailability);

// Public / Patient endpoint
router.get('/doctor/:id', auth, availabilityController.getDoctorAvailability);

module.exports = router;
