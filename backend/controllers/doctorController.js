const DoctorProfile = require('../models/DoctorProfile');

exports.getProfile = async (req, res) => {
  try {
    const profile = await DoctorProfile.findOne({ user: req.user.id }).populate('user', 'name email');
    if (!profile) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.upsertProfile = async (req, res) => {
  try {
    const body = { ...req.body };

    // Check if there is an existing profile that is pending
    const existingProfile = await DoctorProfile.findOne({ user: req.user.id });
    if (existingProfile && existingProfile.verificationStatus === 'pending') {
      return res.status(400).json({ message: 'A verification request is already pending. Please wait for admin approval.' });
    }

    // Parse JSON-stringified arrays (languages, days from stepper)
    ['languages', 'days'].forEach(key => {
      if (typeof body[key] === 'string') {
        try { body[key] = JSON.parse(body[key]); } catch { body[key] = []; }
      }
    });

    // Reconstruct nested availability object from flat keys
    const availability = {
      days:         body.days         || [],
      morningStart: body.morningStart || '',
      morningEnd:   body.morningEnd   || '',
      eveningStart: body.eveningStart || '',
      eveningEnd:   body.eveningEnd   || '',
    };
    // Remove flat availability keys from root
    ['days','morningStart','morningEnd','eveningStart','eveningEnd'].forEach(k => delete body[k]);
    body.availability = availability;

    // Handle uploaded files from Local Multer Storage
    const baseUrl = `${req.protocol}://${req.get('host')}/uploads/doctors/`;
    
    // Initialize documents to preserve existing ones or start fresh
    let existingDocs = {};
    if (existingProfile && existingProfile.documents) {
      existingDocs = { 
        degreeCertificate: existingProfile.documents.degreeCertificate,
        licenseCertificate: existingProfile.documents.licenseCertificate,
        idProof: existingProfile.documents.idProof
      };
    }
    body.documents = existingDocs;

    if (req.files) {
      if (req.files.profilePhoto) {
        body.profilePhoto = baseUrl + req.files.profilePhoto[0].filename;
      }
      if (req.files.degreeCertificate)  body.documents.degreeCertificate  = baseUrl + req.files.degreeCertificate[0].filename;
      if (req.files.licenseCertificate) body.documents.licenseCertificate = baseUrl + req.files.licenseCertificate[0].filename;
      if (req.files.idProof)            body.documents.idProof            = baseUrl + req.files.idProof[0].filename;
    }

    if (existingProfile) {
      // If rejected, updating means they want to resubmit, so send to pending.
      // Otherwise (approved), keep it as is.
      if (existingProfile.verificationStatus === 'rejected') {
        body.verificationStatus = 'pending';
        body.rejectionReason = '';
      } else {
        body.verificationStatus = existingProfile.verificationStatus;
      }
    } else {
      body.verificationStatus = 'pending';
    }

    body.isProfileComplete  = true;
    body.user               = req.user.id;

    // upsert: true → create if doesn't exist; new: true → return updated doc
    const profile = await DoctorProfile.findOneAndUpdate(
      { user: req.user.id },
      { $set: body },
      { new: true, upsert: true, runValidators: false }
    ).populate('user', 'name email');

    const statusCode = profile.createdAt === profile.updatedAt ? 201 : 200;
    res.status(statusCode).json(profile);
  } catch (err) {
    console.error('Upsert Error:', err);
    res.status(500).json({ message: err.message || 'Server error', details: err });
  }
};


exports.getApprovedDoctors = async (req, res) => {
  try {
    const { search, specialization, mode, minExp, maxFee, sort } = req.query;
    const query = { verificationStatus: 'approved' };

    // Text search across name and specialization
    if (search) {
      query.$or = [
        { fullName:       { $regex: search, $options: 'i' } },
        { specialization: { $regex: search, $options: 'i' } },
        { hospitalName:   { $regex: search, $options: 'i' } },
        { degree:         { $regex: search, $options: 'i' } },
      ];
    }
    if (specialization && specialization !== 'All') {
      query.specialization = { $regex: specialization, $options: 'i' };
    }
    if (mode && mode !== 'All') {
      query.consultationMode = mode;
    }
    if (minExp) {
      query.experienceYears = { $gte: Number(minExp) };
    }
    if (maxFee) {
      query.consultationFee = { ...query.consultationFee, $lte: Number(maxFee) };
    }

    let dbQuery = DoctorProfile.find(query)
      .populate('user', 'name email')
      .select('-documents');

    // Sorting
    if (sort === 'experience')   dbQuery = dbQuery.sort({ experienceYears: -1 });
    else if (sort === 'fee_asc') dbQuery = dbQuery.sort({ consultationFee: 1 });
    else if (sort === 'fee_desc')dbQuery = dbQuery.sort({ consultationFee: -1 });
    else if (sort === 'newest')  dbQuery = dbQuery.sort({ createdAt: -1 });
    else                         dbQuery = dbQuery.sort({ createdAt: -1 });

    const doctors = await dbQuery;
    res.json(doctors);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getDoctorById = async (req, res) => {
  try {
    // Determine if the passed ID is a User ID or a Profile ID.
    // Usually, frontend passes User ID for doctor interactions.
    let doctor = await DoctorProfile.findOne({ user: req.params.id })
      .populate('user', 'name email')
      .select('-documents');
      
    if (!doctor) {
      // Fallback: try finding by Profile ID just in case
      doctor = await DoctorProfile.findById(req.params.id)
        .populate('user', 'name email')
        .select('-documents');
    }

    if (!doctor || doctor.verificationStatus !== 'approved') {
      return res.status(404).json({ message: 'Doctor not found or not approved' });
    }
    res.json(doctor);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Doctor not found' });
    }
    res.status(500).send('Server error');
  }
};
