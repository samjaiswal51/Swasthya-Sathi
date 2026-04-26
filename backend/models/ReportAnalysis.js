const mongoose = require('mongoose');

const reportAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  originalFileName: {
    type: String,
    required: true
  },
  extractedText: {
    type: String
  },
  aiSummary: {
    type: String,
    required: true
  },
  abnormalValues: [{
    parameter: String,
    value: String,
    status: {
      type: String,
      enum: ['Normal', 'High', 'Low', 'Unknown']
    }
  }],
  riskLevel: {
    type: String,
    enum: ['Normal', 'Mild Concern', 'Needs Attention', 'Unknown'],
    default: 'Unknown'
  },
  recommendedDoctor: {
    type: String,
    default: 'General Physician'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('ReportAnalysis', reportAnalysisSchema);
