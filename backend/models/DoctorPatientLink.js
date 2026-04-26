const mongoose = require('mongoose');

const doctorPatientLinkSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  patientName: {
    type: String,
    required: true
  },
  initiatedBy: {
    type: String,
    enum: ['doctor', 'patient'],
    required: true
  },
  relationStatus: {
    type: String,
    enum: ['pending', 'active', 'rejected', 'ended', 'blocked'],
    default: 'pending'
  },
  firstConnectedAt: {
    type: Date
  },
  lastConsultationAt: {
    type: Date
  },
  notes: {
    type: String,
    trim: true
  }
}, { timestamps: true });

// Ensure a doctor and patient can only have one active/pending link at a time
doctorPatientLinkSchema.index({ doctorId: 1, patientId: 1 }, { unique: true });

module.exports = mongoose.model('DoctorPatientLink', doctorPatientLinkSchema);
