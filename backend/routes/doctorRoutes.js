const express = require('express');
const router = express.Router();
const { createOrUpdateProfile, getCurrentDoctorProfile, getAllDoctors } = require('../controllers/doctorController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      res.status(403);
      throw new Error('You do not have permission to perform this action.');
    }
    next();
  };
};

router
  .route('/')
  .get(protect, getAllDoctors); // Route to get all approved doctors with search functionality

router
  .route('/profile')
  .post(protect, restrictTo('doctor'), upload.single('profilePicture'), createOrUpdateProfile)
  .get(protect, restrictTo('doctor'), getCurrentDoctorProfile);

module.exports = router;