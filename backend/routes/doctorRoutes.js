const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const appointmentController = require('../controllers/appointmentController');
const auth = require('../middleware/authMiddleware');
const role = require('../middleware/roleMiddleware');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads/doctors');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage, limits: { fileSize: 10000000 } }); // 10MB limit

const cpUpload = upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'degreeCertificate', maxCount: 1 },
  { name: 'licenseCertificate', maxCount: 1 },
  { name: 'idProof', maxCount: 1 }
]);

// @route   GET api/doctor/profile
// @desc    Get current doctor's profile
// @access  Private (Doctor only)
router.get('/profile', [auth, role('doctor')], doctorController.getProfile);

const handleUpload = (req, res, next) => {
  cpUpload(req, res, function (err) {
    if (err) {
      console.error('Multer Upload Error:', err);
      return res.status(500).json({ message: 'File upload error', details: err.message });
    }
    next();
  });
};

// @route   POST/PUT api/doctor/profile
// @desc    Create or update doctor profile
// @access  Private (Doctor only)
router.post('/profile', [auth, role('doctor')], handleUpload, doctorController.upsertProfile);
router.put('/profile', [auth, role('doctor')], handleUpload, doctorController.upsertProfile);

// @route   GET api/doctor/list
// @desc    Get all approved doctors (for patients)
// @access  Private (Any authenticated user)
router.get('/list', auth, doctorController.getApprovedDoctors);

// @route   GET api/doctor/:id
// @desc    Get approved doctor by ID
// @access  Private
router.get('/:id', auth, doctorController.getDoctorById);

// @route   GET api/doctor/:id/slots
// @desc    Get available slots for a doctor on a specific date
// @access  Private
router.get('/:id/slots', auth, appointmentController.getDoctorSlots);

module.exports = router;
