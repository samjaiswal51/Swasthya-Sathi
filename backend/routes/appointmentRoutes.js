const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');

router.post('/book', [auth, role('patient')], appointmentController.bookAppointment);
router.get('/patient', [auth, role('patient')], appointmentController.getPatientAppointments);
router.get('/doctor', [auth, role('doctor')], appointmentController.getDoctorAppointments);
router.patch('/:id/cancel', auth, appointmentController.cancelAppointment);
router.patch('/:id/complete', [auth, role('doctor')], appointmentController.completeAppointment);
router.patch('/:id/approve', [auth, role('doctor')], appointmentController.approveAppointment);
router.patch('/:id/reject', [auth, role('doctor')], appointmentController.rejectAppointment);

module.exports = router;
