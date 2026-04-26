const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  transactionId: { 
    type: String, 
    required: true, 
    unique: true 
  },
  appointmentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Appointment', 
    required: true 
  },
  patientId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  patientName: { 
    type: String, 
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
  amount: { 
    type: Number, 
    required: true 
  },
  platformFee: { 
    type: Number, 
    default: 0 
  },
  doctorNetAmount: { 
    type: Number, 
    required: true 
  },
  paymentMethod: { 
    type: String, 
    default: 'fake_payment' // e.g., 'razorpay', 'stripe' in future
  },
  status: { 
    type: String, 
    enum: ['paid', 'failed', 'refunded'], 
    default: 'paid' 
  },
  consultationType: { 
    type: String, 
    required: true 
  },
  date: { 
    type: String, 
    required: true // YYYY-MM-DD
  },
  timeSlot: { 
    type: String, 
    required: true 
  }
}, { timestamps: true });

// Index for fast analytics and history retrieval
paymentSchema.index({ patientId: 1 });
paymentSchema.index({ doctorId: 1, createdAt: -1 });
paymentSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Payment', paymentSchema);
