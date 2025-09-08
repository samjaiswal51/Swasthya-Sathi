const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User'); 
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');
const asyncHandler = require('express-async-handler');

// @desc    Create or update a doctor's profile
// @route   POST /api/doctor/profile
// @access  Private (Doctor)
exports.createOrUpdateProfile = asyncHandler(async (req, res) => {
  const {
    fullName,
    gender,
    contactNumber,
    licenseNumber,
    specialization,
    qualifications,
    yearsOfExperience,
    clinicName,
    clinicAddress,
    consultationFees,
    availability
  } = req.body;

  const profileData = {
    user: req.user.id,
    fullName,
    gender,
    contactNumber,
    licenseNumber,
    specialization,
    qualifications: Array.isArray(qualifications) ? qualifications : JSON.parse(qualifications || '[]'),
    yearsOfExperience,
    clinicName,
    clinicAddress,
    consultationFees,
    availability: Array.isArray(availability) ? availability : JSON.parse(availability || '[]'),
  };

  if (req.file) {
    try {
      const result = await uploadToCloudinary(req.file.buffer, {
        folder: 'swasthya-sathi-doctors',
        public_id: `doctor_${req.user.id}_profile`,
      });
      profileData.profilePicture = result.secure_url;
    } catch (error) {
      res.status(500);
      throw new Error('Failed to upload profile picture.');
    }
  }

  const profile = await DoctorProfile.findOneAndUpdate(
    { user: req.user.id },
    { $set: profileData },
    { new: true, upsert: true, runValidators: true }
  ).populate('user', ['name', 'email']);

  res.status(200).json({
    message: 'Profile updated successfully!',
    profile,
  });
});

// @desc    Get the current doctor's profile
// @route   GET /api/doctor/profile
// @access  Private (Doctor)
exports.getCurrentDoctorProfile = asyncHandler(async (req, res) => {
  const profile = await DoctorProfile.findOne({ user: req.user.id }).populate('user', ['name', 'email']);

  if (!profile) {
    res.status(404);
    throw new Error('Profile not found. Please create your profile.');
  }

  res.status(200).json(profile);
});

// @desc    Get all approved doctors with optional search
// @route   GET /api/doctor
// @access  Private
exports.getAllDoctors = asyncHandler(async (req, res) => {
  const { search } = req.query;

  // IMPORTANT: Only fetch doctors with 'Approved' status
  const query = { verificationStatus: 'Approved' };

  // If search term exists, add it to the query
  if (search) {
    const searchRegex = new RegExp(search, 'i'); // Case-insensitive regex
    query.$or = [
      { fullName: { $regex: searchRegex } },
      { specialization: { $regex: searchRegex } },
    ];
  }

  const doctors = await DoctorProfile.find(query)
    .populate('user', 'name email')
    .select('fullName profilePicture specialization yearsOfExperience');

  res.status(200).json(doctors);
});