const express = require('express');
const router = express.Router();
const PatientProfile = require('../models/PatientProfile');

// @route   GET api/public/emergency/:token
// @desc    Get limited emergency medical summary via QR token
// @access  Public
router.get('/emergency/:token', async (req, res) => {
  try {
    const profile = await PatientProfile.findOne({ qrToken: req.params.token })
      .populate('user', 'name')
      .select('dob gender bloodGroup allergies diseases medications emergencyContact profilePhoto');

    if (!profile) {
      return res.status(404).json({ message: 'Emergency profile not found' });
    }

    // Update scan stats
    profile.scanCount = (profile.scanCount || 0) + 1;
    profile.lastScannedAt = new Date();
    await profile.save();

    // Calculate age
    let age = null;
    if (profile.dob) {
      const diff = Date.now() - new Date(profile.dob).getTime();
      age = Math.floor(diff / (1000 * 60 * 60 * 24 * 365.25));
    }

    res.json({
      fullName: profile.user?.name,
      profilePhoto: profile.profilePhoto,
      age,
      gender: profile.gender,
      bloodGroup: profile.bloodGroup,
      allergies: profile.allergies,
      diseases: profile.diseases,
      medications: profile.medications,
      emergencyContact: profile.emergencyContact
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
