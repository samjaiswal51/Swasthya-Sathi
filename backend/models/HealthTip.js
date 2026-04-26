const mongoose = require('mongoose');

const healthTipSchema = new mongoose.Schema({
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  doctorName: {
    type: String,
    required: true
  },
  specialization: {
    type: String,
    default: 'General Physician'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    enum: [
      'Diabetes', 'Heart Care', 'Skin Care', 'Seasonal Flu',
      'Mental Health', 'Nutrition', 'Women Care', 'Child Health', 'General Health'
    ],
    default: 'General Health'
  },
  thumbnail: {
    type: String,
    default: ''
  },
  summary: {
    type: String,
    maxLength: 300
  },
  content: {
    type: String,
    required: true
  },
  tags: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['published', 'draft'],
    default: 'draft'
  },
  viewsCount: {
    type: Number,
    default: 0
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  saves: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}, { timestamps: true });

module.exports = mongoose.model('HealthTip', healthTipSchema);
