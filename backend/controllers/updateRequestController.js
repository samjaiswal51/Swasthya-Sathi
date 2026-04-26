const UpdateRequest = require('../models/UpdateRequest');
const ClinicalNote = require('../models/ClinicalNote');
const PatientProfile = require('../models/PatientProfile');
const Notification = require('../models/Notification');
const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');

// @route   POST /api/update-requests
// @desc    Doctor creates an update request
// @access  Private (Doctor)
exports.createRequest = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Only doctors can request record updates' });
    }

    const { patientId, type, changes, priority } = req.body;

    const doctorProfile = await DoctorProfile.findOne({ user: req.user.id });
    const doctorUser = await User.findById(req.user.id);
    const doctorName = doctorProfile?.fullName || `Dr. ${doctorUser.name}`;

    const newRequest = new UpdateRequest({
      patientId,
      doctorId: req.user.id,
      doctorName,
      type,
      changes,
      priority: priority || 'Normal'
    });

    await newRequest.save();

    // Create Notification for Patient
    await Notification.create({
      userId: patientId,
      type: 'update_request',
      title: 'Medical Record Update Request',
      message: `${doctorName} wants to update your medical record (${type}). Please review and approve.`,
      link: '/patient-dashboard/medical-updates'
    });

    res.status(201).json(newRequest);
  } catch (err) {
    console.error('Error creating update request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/update-requests/patient
// @desc    Get all requests for logged-in patient
// @access  Private (Patient)
exports.getPatientRequests = async (req, res) => {
  try {
    const requests = await UpdateRequest.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Error fetching patient requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/update-requests/patients/search
// @desc    Doctor searches for patients to send update requests
// @access  Private (Doctor)
exports.searchPatients = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    const { query } = req.query;
    if (!query) return res.json([]);

    const users = await User.find({
      role: 'patient',
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { email: { $regex: query, $options: 'i' } }
      ]
    }).select('-password').limit(10);

    res.json(users);
  } catch (err) {
    console.error('Error searching patients:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/update-requests/doctor
// @desc    Get all requests sent by logged-in doctor
// @access  Private (Doctor)
exports.getDoctorRequests = async (req, res) => {
  try {
    const requests = await UpdateRequest.find({ doctorId: req.user.id }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    console.error('Error fetching doctor requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/update-requests/:id
// @desc    Get single request
// @access  Private
exports.getRequestById = async (req, res) => {
  try {
    const request = await UpdateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });
    
    if (request.patientId.toString() !== req.user.id && request.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }
    
    res.json(request);
  } catch (err) {
    console.error('Error fetching request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/update-requests/:id/approve
// @desc    Patient approves request
// @access  Private (Patient)
exports.approveRequest = async (req, res) => {
  try {
    const request = await UpdateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    request.status = 'approved';
    request.reviewedAt = new Date();
    await request.save();

    // 1. Update PatientProfile directly
    let patientProfile = await PatientProfile.findOne({ user: req.user.id });
    if (!patientProfile) {
      patientProfile = new PatientProfile({ user: req.user.id });
    }

    if (request.changes.diagnosis) {
      if (!patientProfile.diseases.includes(request.changes.diagnosis)) {
        patientProfile.diseases.push(request.changes.diagnosis);
      }
    }
    
    if (request.changes.allergies) {
      if (!patientProfile.allergies.includes(request.changes.allergies)) {
        patientProfile.allergies.push(request.changes.allergies);
      }
    }

    // Since medications is a single string in the schema, we'll append to it
    if (request.changes.prescriptions && request.changes.prescriptions.length > 0) {
      const prescString = request.changes.prescriptions.map(p => `${p.medicineName} (${p.dose})`).join(', ');
      patientProfile.medications = patientProfile.medications 
        ? `${patientProfile.medications}, ${prescString}` 
        : prescString;
    }

    await patientProfile.save();

    // 2. Create ClinicalNote for historical tracking
    await ClinicalNote.create({
      patientId: req.user.id,
      doctorId: request.doctorId,
      doctorName: request.doctorName,
      sourceRequestId: request._id,
      diagnosis: request.changes.diagnosis,
      prescriptions: request.changes.prescriptions,
      advice: request.changes.advice,
      notes: request.changes.notes
    });

    // 3. Notify Doctor
    await Notification.create({
      userId: request.doctorId,
      type: 'update_approved',
      title: 'Update Request Approved',
      message: `Your medical record update request for patient was approved.`,
      link: '/doctor-dashboard/sent-requests' // Optional future route
    });

    res.json({ message: 'Request approved and records updated successfully', request });
  } catch (err) {
    console.error('Error approving request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/update-requests/:id/reject
// @desc    Patient rejects request
// @access  Private (Patient)
exports.rejectRequest = async (req, res) => {
  try {
    const { reason } = req.body;
    const request = await UpdateRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Request not found' });

    if (request.patientId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: `Request is already ${request.status}` });
    }

    request.status = 'rejected';
    request.patientResponseNote = reason;
    request.reviewedAt = new Date();
    await request.save();

    // Notify Doctor
    await Notification.create({
      userId: request.doctorId,
      type: 'update_rejected',
      title: 'Update Request Rejected',
      message: `Your medical record update request was rejected. ${reason ? 'Reason: ' + reason : ''}`,
      link: '/doctor-dashboard/sent-requests'
    });

    res.json({ message: 'Request rejected', request });
  } catch (err) {
    console.error('Error rejecting request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/update-requests/patient/clinical-notes
// @desc    Get all clinical notes (approved history) for the logged-in patient
// @access  Private (Patient)
exports.getClinicalNotes = async (req, res) => {
  try {
    const notes = await ClinicalNote.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error('Error fetching clinical notes:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
