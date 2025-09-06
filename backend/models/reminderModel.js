// backend/models/reminderModel.js

const mongoose = require('mongoose');

const reminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  medicationName: {
    type: String,
    required: [true, 'Please add a medication name'],
  },
  dosage: {
    type: String,
    default: '',
  },
  times: {
    type: [String],
    required: [true, 'Please add at least one reminder time'],
    validate: {
        validator: function(v) {
            return v.every(time => /^([01]\d|2[0-3]):([0-5]\d)$/.test(time));
        },
        message: props => `${props.value} contains an invalid time format. Use HH:MM.`
    }
  },
  daysOfWeek: {
    type: [Number],
    required: [true, 'Please select at least one day of the week.'],
    validate: {
        validator: function(v) {
            return v.length > 0 && v.every(day => day >= 0 && day <= 6);
        },
        message: 'Please provide at least one valid day of the week (0-6).'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Reminder', reminderSchema);