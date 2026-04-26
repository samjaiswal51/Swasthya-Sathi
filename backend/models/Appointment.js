const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
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
  date: { 
    type: String, 
    required: true // YYYY-MM-DD
  },
  time: { 
    type: String, 
    required: true // HH:mm
  },
  fee: { 
    type: Number, 
    required: true 
  },
  consultationType: { 
    type: String, 
    enum: ['Online', 'Offline'], 
    required: true 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  appointmentStatus: { 
    type: String, 
    enum: ['pending_approval', 'confirmed', 'cancelled', 'completed'], 
    default: 'pending_approval' 
  },
  paymentId: {
    type: String // To store fake payment transaction ID
  }
}, { timestamps: true });

// Prevent double booking at the database level for the same doctor, date, and time
// Wait, we can't easily unique compound index if paymentStatus is failed/cancelled we might want to allow re-booking.
// So we just index them for fast lookups.
appointmentSchema.index({ doctorId: 1, date: 1, time: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
