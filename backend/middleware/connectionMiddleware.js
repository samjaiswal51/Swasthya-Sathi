const DoctorPatientLink = require('../models/DoctorPatientLink');

/**
 * Middleware to check if an active relationship exists between a doctor and patient.
 * It dynamically determines the roles based on the authenticated user.
 */
const requireActiveConnection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    // Determine the target ID based on the request body, query, or params.
    // For example, if doctor is requesting update, patientId is in req.body.
    // If fetching patient details, patientId might be in req.params.
    let targetId = req.body.patientId || req.query.patientId || req.params.patientId || req.params.doctorId || req.body.doctorId;

    if (!targetId) {
      return res.status(400).json({ message: 'Target ID (patient or doctor) is required to verify connection.' });
    }

    let doctorId, patientId;

    if (role === 'doctor') {
      doctorId = userId;
      patientId = targetId;
    } else if (role === 'patient') {
      patientId = userId;
      doctorId = targetId;
    } else {
      return res.status(403).json({ message: 'Only doctors and patients have connection links.' });
    }

    const link = await DoctorPatientLink.findOne({
      doctorId,
      patientId,
      relationStatus: 'active'
    });

    if (!link) {
      return res.status(403).json({ 
        message: 'Unauthorized access. A verified and active connection is required between the doctor and patient to perform this action.' 
      });
    }

    // Attach link to request for convenience in downstream controllers
    req.connectionLink = link;
    next();
  } catch (err) {
    console.error('Error verifying connection:', err);
    res.status(500).json({ message: 'Server error verifying relationship status.' });
  }
};

module.exports = requireActiveConnection;
