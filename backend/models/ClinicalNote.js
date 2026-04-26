const mongoose = require('mongoose');

const clinicalNoteSchema = new mongoose.Schema({
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
  sourceRequestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UpdateRequest'
  },
  diagnosis: {
    type: String,
    trim: true
  },
  prescriptions: [{
    medicineName: String,
    dose: String,
    frequency: String,
    duration: String
  }],
  advice: {
    type: String,
    trim: true
  },
  notes: {
    type: String,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('ClinicalNote', clinicalNoteSchema);
