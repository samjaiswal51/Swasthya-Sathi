const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true
  },
  date: { 
    type: String, 
    required: true // YYYY-MM-DD
  },
  startTime: { 
    type: String, 
    required: true // HH:mm
  },
  endTime: { 
    type: String, 
    required: true // HH:mm
  },
  mode: { 
    type: String, 
    enum: ['Online', 'Offline', 'Both'], 
    required: true 
  },
  feePerHour: { 
    type: Number, 
    required: true 
  },
  slots: [
    {
      time: { type: String, required: true }, // e.g. "10:00-11:00"
      booked: { type: Boolean, default: false },
      bookedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null }
    }
  ]
}, { timestamps: true });

// Prevent a doctor from having two separate availability configs for the same date
availabilitySchema.index({ doctorId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('Availability', availabilitySchema);
