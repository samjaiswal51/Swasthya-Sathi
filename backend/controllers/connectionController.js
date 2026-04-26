const DoctorPatientLink = require('../models/DoctorPatientLink');
const User = require('../models/User');
const DoctorProfile = require('../models/DoctorProfile');
const PatientProfile = require('../models/PatientProfile');
const Notification = require('../models/Notification');

// @route   POST /api/connections/request
// @desc    Request a connection (Doctor or Patient)
// @access  Private
exports.requestConnection = async (req, res) => {
  try {
    const { targetUserId } = req.body;
    const initiatorId = req.user.id;
    const initiatorRole = req.user.role;

    if (!targetUserId) {
      return res.status(400).json({ message: 'Target user ID is required.' });
    }

    if (initiatorId === targetUserId) {
      return res.status(400).json({ message: 'Cannot connect with yourself.' });
    }

    let doctorId, patientId, doctorName, patientName;

    const targetUser = await User.findById(targetUserId);
    const initiatorUser = await User.findById(initiatorId);

    if (!targetUser) return res.status(404).json({ message: 'Target user not found.' });
    if (!initiatorUser) return res.status(404).json({ message: 'Initiator user not found.' });

    if (initiatorRole === 'doctor' && targetUser.role === 'patient') {
      doctorId = initiatorId;
      patientId = targetUserId;
      
      const docProfile = await DoctorProfile.findOne({ user: doctorId });
      doctorName = docProfile?.fullName || `Dr. ${initiatorUser.name}`;
      patientName = targetUser.name;

    } else if (initiatorRole === 'patient' && targetUser.role === 'doctor') {
      patientId = initiatorId;
      doctorId = targetUserId;

      const docProfile = await DoctorProfile.findOne({ user: doctorId });
      doctorName = docProfile?.fullName || `Dr. ${targetUser.name}`;
      patientName = initiatorUser.name;

    } else {
      return res.status(400).json({ message: 'Invalid connection request roles.' });
    }

    // Check if relationship already exists
    let link = await DoctorPatientLink.findOne({ doctorId, patientId });

    if (link) {
      if (link.relationStatus === 'active') {
        return res.status(400).json({ message: 'You are already connected.' });
      } else if (link.relationStatus === 'pending') {
        return res.status(400).json({ message: 'A connection request is already pending.' });
      } else if (link.relationStatus === 'blocked') {
        return res.status(403).json({ message: 'Connection blocked.' });
      } else {
        // If rejected or ended, we can allow re-request
        link.relationStatus = 'pending';
        link.initiatedBy = initiatorRole;
        await link.save();
      }
    } else {
      // Create new link
      link = await DoctorPatientLink.create({
        doctorId,
        patientId,
        doctorName,
        patientName,
        initiatedBy: initiatorRole
      });
    }

    // Notify the target user
    await Notification.create({
      userId: targetUserId,
      type: 'system',
      title: 'New Connection Request',
      message: `${initiatorRole === 'doctor' ? doctorName : patientName} wants to connect with you.`,
      link: initiatorRole === 'doctor' ? '/patient-dashboard/my-doctors' : '/doctor-dashboard/patients'
    });

    res.status(201).json(link);
  } catch (err) {
    console.error('Error requesting connection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/connections/:id/approve
// @desc    Approve a connection request
// @access  Private
exports.approveConnection = async (req, res) => {
  try {
    const link = await DoctorPatientLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Connection not found.' });

    // Ensure the approver is the TARGET of the request
    const isTarget = (req.user.role === 'doctor' && req.user.id === link.doctorId.toString() && link.initiatedBy === 'patient') ||
                     (req.user.role === 'patient' && req.user.id === link.patientId.toString() && link.initiatedBy === 'doctor');

    if (!isTarget) {
      return res.status(403).json({ message: 'Unauthorized to approve this request.' });
    }

    link.relationStatus = 'active';
    link.firstConnectedAt = new Date();
    await link.save();

    // Notify initiator
    const approverUser = await User.findById(req.user.id);
    const initiatorId = link.initiatedBy === 'doctor' ? link.doctorId : link.patientId;
    await Notification.create({
      userId: initiatorId,
      type: 'system',
      title: 'Connection Approved',
      message: `${approverUser.name} approved your connection request.`
    });

    res.json(link);
  } catch (err) {
    console.error('Error approving connection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/connections/:id/reject
// @desc    Reject a connection request
// @access  Private
exports.rejectConnection = async (req, res) => {
  try {
    const link = await DoctorPatientLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Connection not found.' });

    link.relationStatus = 'rejected';
    await link.save();

    res.json({ message: 'Connection rejected.' });
  } catch (err) {
    console.error('Error rejecting connection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   PUT /api/connections/:id/end
// @desc    End an active connection
// @access  Private
exports.endConnection = async (req, res) => {
  try {
    const link = await DoctorPatientLink.findById(req.params.id);
    if (!link) return res.status(404).json({ message: 'Connection not found.' });

    // Allow either party to end
    if (req.user.id !== link.doctorId.toString() && req.user.id !== link.patientId.toString()) {
      return res.status(403).json({ message: 'Unauthorized.' });
    }

    link.relationStatus = 'ended';
    await link.save();

    res.json({ message: 'Connection ended.' });
  } catch (err) {
    console.error('Error ending connection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/connections/my-patients
// @desc    Get all connected/pending patients for a doctor
// @access  Private (Doctor)
exports.getMyPatients = async (req, res) => {
  try {
    if (req.user.role !== 'doctor') return res.status(403).json({ message: 'Unauthorized' });

    const connections = await DoctorPatientLink.find({
      doctorId: req.user.id,
      relationStatus: { $in: ['active', 'pending'] }
    }).sort({ updatedAt: -1 });

    // Populate patient profile photo or basic info if needed. We'll fetch basic users.
    const populatedConnections = await Promise.all(connections.map(async (conn) => {
      const patient = await User.findById(conn.patientId).select('name email');
      return { ...conn._doc, patientDetails: patient };
    }));

    res.json(populatedConnections);
  } catch (err) {
    console.error('Error fetching patients:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route   GET /api/connections/my-doctors
// @desc    Get all connected/pending doctors for a patient
// @access  Private (Patient)
exports.getMyDoctors = async (req, res) => {
  try {
    if (req.user.role !== 'patient') return res.status(403).json({ message: 'Unauthorized' });

    const connections = await DoctorPatientLink.find({
      patientId: req.user.id,
      relationStatus: { $in: ['active', 'pending'] }
    }).sort({ updatedAt: -1 });

    const populatedConnections = await Promise.all(connections.map(async (conn) => {
      const doctorProfile = await DoctorProfile.findOne({ user: conn.doctorId });
      return { ...conn._doc, doctorDetails: doctorProfile };
    }));

    res.json(populatedConnections);
  } catch (err) {
    console.error('Error fetching doctors:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
