const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const auth = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Local disk storage for patient profile photos
const uploadDir = path.join(__dirname, '../uploads/patients');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `patient_${req.user?.id || 'unknown'}_${Date.now()}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = ['.jpg', '.jpeg', '.png', '.webp'];
    if (allowed.includes(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  }
});

// @route   GET api/patient/profile
// @desc    Get current user's profile
// @access  Private
router.get('/', auth, profileController.getProfile);

// @route   POST api/patient/profile
// @desc    Create or update user profile
// @access  Private
router.post('/', auth, upload.single('profilePhoto'), profileController.upsertProfile);

// @route   GET api/patient/profile/swasthya-card
// @desc    Get Swasthya Card info (creates missing fields)
// @access  Private
router.get('/swasthya-card', auth, profileController.getSwasthyaCard);

// @route   POST api/patient/profile/swasthya-card/refresh
// @desc    Refresh QR token (invalidate previous one)
// @access  Private
router.post('/swasthya-card/refresh', auth, profileController.refreshQr);

// @route   POST api/patient/profile/favorite-doctor/:doctorId
// @desc    Toggle favorite doctor
// @access  Private
router.post('/favorite-doctor/:doctorId', auth, profileController.toggleFavoriteDoctor);

// @route   GET api/patient/profile/favorites
// @desc    Get favorite doctors list
// @access  Private
router.get('/favorites', auth, profileController.getFavoriteDoctors);

module.exports = router;
