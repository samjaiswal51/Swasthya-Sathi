const PatientProfile = require('../models/PatientProfile');
const { generateQrToken, generateCardId } = require('../services/qrService');

exports.getProfile = async (req, res) => {
  try {
    const profile = await PatientProfile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.upsertProfile = async (req, res) => {
  try {
    const profileData = { ...req.body };
    
    // Handle image uploaded via local multer diskStorage
    if (req.file && req.file.filename) {
      profileData.profilePhoto = `${req.protocol}://${req.get('host')}/uploads/patients/${req.file.filename}`;
    }

    // Convert comma-separated strings to arrays if needed, or handle array inputs
    if (profileData.allergies && typeof profileData.allergies === 'string') {
      profileData.allergies = profileData.allergies.split(',').map(item => item.trim()).filter(item => item);
    } else if (!profileData.allergies) {
      profileData.allergies = [];
    }

    if (profileData.diseases && typeof profileData.diseases === 'string') {
      profileData.diseases = profileData.diseases.split(',').map(item => item.trim()).filter(item => item);
    } else if (!profileData.diseases) {
      profileData.diseases = [];
    }
    
    // Handle nested address
    if (profileData.addressLine || profileData.city || profileData.state || profileData.pincode) {
        profileData.address = {
            line: profileData.addressLine || '',
            city: profileData.city || '',
            state: profileData.state || '',
            pincode: profileData.pincode || ''
        };
    }

    // Handle nested emergency contact
    if (profileData.emergencyName || profileData.emergencyRelation || profileData.emergencyMobile || profileData.emergencyAlternate) {
        profileData.emergencyContact = {
            name: profileData.emergencyName || '',
            relation: profileData.emergencyRelation || '',
            mobile: profileData.emergencyMobile || '',
            alternateMobile: profileData.emergencyAlternate || ''
        };
    }

    // Handle nested lifestyle
    if (profileData.smoker || profileData.alcohol) {
        profileData.lifestyle = {
            smoker: profileData.smoker || 'Non Smoker',
            alcohol: profileData.alcohol || 'No'
        };
    }

    let profile = await PatientProfile.findOne({ user: req.user.id });

    if (profile) {
      // Update
      profile = await PatientProfile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileData },
        { returnDocument: 'after' }
      ).populate('user', 'name email');
      return res.json(profile);
    }

    // Create
    profileData.user = req.user.id;
    if (!profileData.swasthyaCardId) profileData.swasthyaCardId = generateCardId();
    if (!profileData.qrToken) profileData.qrToken = generateQrToken();
    
    profile = new PatientProfile(profileData);
    await profile.save();
    
    await profile.populate('user', 'name email');
    res.status(201).json(profile);
  } catch (err) {
    console.error('Profile upsert error:', err);
    res.status(500).json({ message: err.message || 'Server error', details: String(err) });
  }
};

// @desc    Get Swasthya Card info (create if missing)
// @route   GET /api/patient/swasthya-card
// @access  Private
exports.getSwasthyaCard = async (req, res) => {
  try {
    let profile = await PatientProfile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    if (!profile.swasthyaCardId) profile.swasthyaCardId = generateCardId();
    if (!profile.qrToken) profile.qrToken = generateQrToken();
    await profile.save();
    res.json({
      swasthyaCardId: profile.swasthyaCardId,
      qrToken: profile.qrToken,
      profilePhoto: profile.profilePhoto,
      fullName: profile.user ? profile.user.name : null,
      bloodGroup: profile.bloodGroup,
      emergencyContact: profile.emergencyContact,
      dob: profile.dob,
      gender: profile.gender
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Refresh QR token (invalidate old)
// @route   POST /api/patient/swasthya-card/refresh
// @access  Private
exports.refreshQr = async (req, res) => {
  try {
    const profile = await PatientProfile.findOne({ user: req.user.id });
    if (!profile) return res.status(404).json({ message: 'Profile not found' });
    profile.qrToken = generateQrToken();
    await profile.save();
    res.json({ qrToken: profile.qrToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Toggle favorite doctor
// @route   POST /api/patient/profile/favorite-doctor/:doctorId
// @access  Private
exports.toggleFavoriteDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    let profile = await PatientProfile.findOne({ user: req.user.id });
    if (!profile) {
      profile = new PatientProfile({ user: req.user.id, favoriteDoctors: [] });
    }

    const isFav = profile.favoriteDoctors.includes(doctorId);
    if (isFav) {
      profile.favoriteDoctors = profile.favoriteDoctors.filter(id => id.toString() !== doctorId);
    } else {
      profile.favoriteDoctors.push(doctorId);
    }
    
    await profile.save();
    res.json({ favoriteDoctors: profile.favoriteDoctors });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get favorite doctors
// @route   GET /api/patient/profile/favorites
// @access  Private
exports.getFavoriteDoctors = async (req, res) => {
  try {
    const profile = await PatientProfile.findOne({ user: req.user.id })
      .populate({
        path: 'favoriteDoctors',
        populate: { path: 'user', select: 'name email' }
      });
      
    if (!profile) return res.json([]);
    res.json(profile.favoriteDoctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

