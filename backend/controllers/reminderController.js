const Reminder = require('../models/Reminder');
const User = require('../models/User');

// @desc    Create a new reminder
// @route   POST /api/patient/reminders
// @access  Private
exports.createReminder = async (req, res) => {
  try {
    const { 
      medicineName, dose, purpose, frequency, times, 
      startDate, endDate, mealTiming, notes, waterReminder, repeatUntilTaken 
    } = req.body;

    const newReminder = new Reminder({
      user: req.user.id,
      medicineName,
      dose,
      purpose,
      frequency,
      times,
      startDate,
      endDate,
      mealTiming,
      notes,
      waterReminder,
      repeatUntilTaken
    });

    await newReminder.save();
    res.status(201).json(newReminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error creating reminder' });
  }
};

// @desc    Get all reminders for a user
// @route   GET /api/patient/reminders
// @access  Private
exports.getReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reminders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a reminder
// @route   PUT /api/patient/reminders/:id
// @access  Private
exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: req.body },
      { returnDocument: 'after' }
    );

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    res.json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating reminder' });
  }
};

// @desc    Delete a reminder
// @route   DELETE /api/patient/reminders/:id
// @access  Private
exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    await Reminder.deleteOne({ _id: req.params.id });
    res.json({ message: 'Reminder removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Record an action (Taken, Skipped, Snoozed)
// @route   PATCH /api/patient/reminders/:id/action
// @access  Private
exports.recordAction = async (req, res) => {
  try {
    const { action, scheduledTime, date } = req.body;
    
    const reminder = await Reminder.findOne({ _id: req.params.id, user: req.user.id });
    if (!reminder) return res.status(404).json({ message: 'Reminder not found' });

    if (action === 'Taken' || action === 'Skipped' || action === 'Late') {
      // Add to takenHistory
      reminder.takenHistory.push({
        date: date || new Date(),
        scheduledTime,
        status: action
      });
      
      if (action === 'Skipped') {
        reminder.skippedCount += 1;
      }
    } else if (action === 'Snoozed') {
      reminder.snoozedCount += 1;
      // In a real system, we might update a "nextSnoozeTime" field here.
    } else if (action === 'Paused') {
       reminder.status = reminder.status === 'active' ? 'paused' : 'active';
    }

    await reminder.save();
    res.json(reminder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error recording action' });
  }
};

// @desc    Subscribe to Web Push
// @route   POST /api/patient/reminders/subscribe
// @access  Private
exports.subscribePush = async (req, res) => {
  try {
    const subscription = req.body;
    
    // Save subscription to the User document
    await User.findByIdAndUpdate(req.user.id, { pushSubscription: subscription });
    
    res.status(201).json({ message: 'Push subscription saved.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error saving subscription' });
  }
};
