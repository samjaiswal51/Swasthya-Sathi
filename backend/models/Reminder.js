const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicineName: {
    type: String,
    required: true,
    trim: true
  },
  dose: {
    type: String,
    trim: true
  },
  purpose: {
    type: String,
    trim: true
  },
  frequency: {
    type: String,
    enum: ['Once Daily', 'Twice Daily', 'Thrice Daily', 'Weekly', 'Custom'],
    required: true
  },
  times: [{
    type: String, // Stored as "HH:MM AM/PM"
    required: true
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  mealTiming: {
    type: String,
    enum: ['Before Meal', 'After Meal', 'Empty Stomach', 'With Food', 'Any Time'],
    default: 'Any Time'
  },
  notes: {
    type: String,
    trim: true
  },
  waterReminder: {
    type: Boolean,
    default: false
  },
  repeatUntilTaken: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'paused'],
    default: 'active'
  },
  takenHistory: [{
    date: {
      type: Date,
      required: true
    },
    scheduledTime: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Taken', 'Skipped', 'Late'],
      required: true
    },
    actionTakenAt: {
      type: Date,
      default: Date.now
    }
  }],
  snoozedCount: {
    type: Number,
    default: 0
  },
  skippedCount: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Reminder', reminderSchema);
