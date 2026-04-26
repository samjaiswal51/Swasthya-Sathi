const DoctorProfile = require('../models/DoctorProfile');
const User = require('../models/User');
const Complaint = require('../models/Complaint');

// ─────────────────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────────────────

// @route  GET /api/admin/dashboard-stats
exports.getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalDoctors,
      totalPatients,
      pendingDoctors,
      openComplaints,
    ] = await Promise.all([
      User.countDocuments({ role: { $ne: 'admin' } }),
      User.countDocuments({ role: 'doctor' }),
      User.countDocuments({ role: 'patient' }),
      DoctorProfile.countDocuments({ verificationStatus: 'pending' }),
      Complaint.countDocuments({ status: 'open' }),
    ]);

    // Today registrations
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const todayRegistrations = await User.countDocuments({ createdAt: { $gte: startOfDay } });

    res.json({
      totalUsers,
      totalDoctors,
      totalPatients,
      todayRegistrations,
      pendingDoctors,
      suspendedUsers: 0, // placeholder — add isSuspended field to User if needed
      openComplaints,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────
// DOCTOR VERIFICATION
// ─────────────────────────────────────────────────────

// @route  GET /api/admin/doctors/pending
exports.getPendingDoctors = async (req, res) => {
  try {
    const pendingDoctors = await DoctorProfile.find({ verificationStatus: 'pending' })
      .populate('user', 'name email createdAt');
    res.json(pendingDoctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/admin/doctors/all
exports.getAllDoctorProfiles = async (req, res) => {
  try {
    const doctors = await DoctorProfile.find()
      .populate('user', 'name email createdAt')
      .sort({ createdAt: -1 });
    res.json(doctors);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PATCH /api/admin/doctor/:id/approve
exports.approveDoctor = async (req, res) => {
  try {
    const doctor = await DoctorProfile.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    doctor.verificationStatus = 'approved';
    doctor.rejectionReason = '';
    doctor.verifiedAt = new Date();
    await doctor.save();
    res.json({ message: 'Doctor approved successfully', doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PATCH /api/admin/doctor/:id/reject
exports.rejectDoctor = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) return res.status(400).json({ message: 'Rejection reason is required' });
    const doctor = await DoctorProfile.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    doctor.verificationStatus = 'rejected';
    doctor.rejectionReason = reason;
    await doctor.save();
    res.json({ message: 'Doctor rejected successfully', doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────
// USER MANAGEMENT
// ─────────────────────────────────────────────────────

// @route  GET /api/admin/users?role=patient|doctor|family
exports.getUsers = async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PATCH /api/admin/user/:id/suspend
exports.suspendUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isSuspended = true;
    await user.save();
    res.json({ message: 'User suspended successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PATCH /api/admin/user/:id/activate
exports.activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isSuspended = false;
    await user.save();
    res.json({ message: 'User activated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  DELETE /api/admin/delete/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Optionally delete related documents like DoctorProfile, etc.
    if (user.role === 'doctor') {
      await DoctorProfile.findOneAndDelete({ user: user._id });
    }
    
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────
// ANALYTICS
// ─────────────────────────────────────────────────────

// @route  GET /api/admin/analytics
exports.getAnalytics = async (req, res) => {
  try {
    // Last 7 days daily signups
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const start = new Date();
      start.setDate(start.getDate() - i);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setHours(23, 59, 59, 999);
      const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });
      days.push({
        date: start.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }),
        signups: count,
      });
    }

    // Monthly growth (last 6 months)
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const start = new Date(d.getFullYear(), d.getMonth(), 1);
      const end = new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
      const count = await User.countDocuments({ createdAt: { $gte: start, $lte: end } });
      months.push({
        month: start.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        users: count,
      });
    }

    const activeDoctors = await DoctorProfile.countDocuments({ verificationStatus: 'approved' });
    const activePatients = await User.countDocuments({ role: 'patient' });

    res.json({ dailySignups: days, monthlyGrowth: months, activeDoctors, activePatients });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ─────────────────────────────────────────────────────
// COMPLAINTS
// ─────────────────────────────────────────────────────

// @route  GET /api/admin/payments
exports.getPayments = async (req, res) => {
  try {
    const Appointment = require('../models/Appointment');
    const payments = await Appointment.find({ paymentStatus: 'paid' })
      .populate('patientId', 'name email')
      .populate('doctorId', 'name email')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/admin/complaints
exports.getComplaints = async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .populate('reporter', 'name email')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PATCH /api/admin/complaint/:id/resolve
exports.resolveComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status: 'resolved' },
      { new: true }
    );
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint resolved', complaint });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  DELETE /api/admin/complaint/:id
exports.deleteComplaint = async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: 'Complaint deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
