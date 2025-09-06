// backend/controllers/reminderController.js

const Reminder = require('../models/reminderModel');
const asyncHandler = require('express-async-handler');

const getReminders = asyncHandler(async (req, res) => {
  const reminders = await Reminder.find({ user: req.user.id }).sort({ createdAt: -1 });
  res.status(200).json(reminders);
});

const createReminder = asyncHandler(async (req, res) => {
  const { medicationName, dosage, times, daysOfWeek } = req.body;

  if (!medicationName || !times || times.length === 0 || !daysOfWeek || daysOfWeek.length === 0) {
    res.status(400);
    throw new Error('Medication name, times, and at least one day of the week are required.');
  }

  const reminder = await Reminder.create({
    user: req.user.id,
    medicationName,
    dosage,
    times,
    daysOfWeek,
  });

  res.status(201).json(reminder);
});

const deleteReminder = asyncHandler(async (req, res) => {
  const reminder = await Reminder.findById(req.params.id);

  if (!reminder) {
    res.status(404);
    throw new Error('Reminder not found.');
  }

  if (reminder.user.toString() !== req.user.id) {
    res.status(401);
    throw new Error('User not authorized to delete this reminder.');
  }

  await reminder.deleteOne();

  res.status(200).json({ id: req.params.id, message: 'Reminder deleted successfully.' });
});

module.exports = {
  getReminders,
  createReminder,
  deleteReminder,
};