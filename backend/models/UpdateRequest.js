const mongoose = require('mongoose');

const updateRequestSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['Diagnosis', 'Prescription', 'Notes', 'Advice', 'Allergy Update', 'Test Recommendation', 'Other'],
    required: true
  },
  changes: {
    diagnosis: { type: String, trim: true },
    prescriptions: [{
      medicineName: { type: String, required: true },
      dose: { type: String, required: true },
      frequency: { type: String, required: true },
      duration: { type: String, required: true }
    }],
    advice: { type: String, trim: true },
    notes: { type: String, trim: true },
    allergies: { type: String, trim: true },
    tests: { type: String, trim: true }
  },
  priority: {
    type: String,
    enum: ['Normal', 'Important', 'Urgent'],
    default: 'Normal'
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'expired'],
    default: 'pending'
  },
  patientResponseNote: {
    type: String,
    trim: true
  },
  reviewedAt: {
    type: Date
  },
  expiresAt: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
  }
}, { timestamps: true });

module.exports = mongoose.model('UpdateRequest', updateRequestSchema);
