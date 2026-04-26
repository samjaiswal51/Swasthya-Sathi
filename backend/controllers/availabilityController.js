const Availability = require('../models/Availability');

// Utility to generate time slots
const generateTimeSlots = (startTime, endTime) => {
  const slots = [];
  let current = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);

  while (current < end) {
    const startStr = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
    current.setHours(current.getHours() + 1);
    const endStr = `${String(current.getHours()).padStart(2, '0')}:${String(current.getMinutes()).padStart(2, '0')}`;
    slots.push({ time: `${startStr}-${endStr}`, booked: false, bookedBy: null });
  }
  return slots;
};

// @route  POST /api/doctor/availability/add
exports.addAvailability = async (req, res) => {
  try {
    const { date, startTime, endTime, mode, feePerHour } = req.body;
    
    // Generate slots (1 hour each)
    const slots = generateTimeSlots(startTime, endTime);

    const availability = new Availability({
      doctorId: req.user.id,
      date,
      startTime,
      endTime,
      mode,
      feePerHour,
      slots
    });

    await availability.save();
    res.status(201).json({ message: 'Availability added successfully', availability });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Availability already exists for this date. Please edit it instead.' });
    }
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  PUT /api/doctor/availability/edit/:id
exports.editAvailability = async (req, res) => {
  try {
    const { startTime, endTime, mode, feePerHour } = req.body;
    
    const availability = await Availability.findById(req.params.id);
    if (!availability) return res.status(404).json({ message: 'Not found' });
    if (availability.doctorId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    // Check if any slot is already booked, if so, we shouldn't allow changing time that affects booked slots.
    // For simplicity, we just regenerate slots and KEEP booked slots if they still fit, or block edit.
    const hasBooked = availability.slots.some(s => s.booked);
    if (hasBooked) {
      // In a real app we'd carefully merge slots. For now, if there's a booked slot, we just update mode/fee, not time.
      if (availability.startTime !== startTime || availability.endTime !== endTime) {
        return res.status(400).json({ message: 'Cannot change timings because some slots are already booked.' });
      }
    } else {
      availability.startTime = startTime;
      availability.endTime = endTime;
      availability.slots = generateTimeSlots(startTime, endTime);
    }

    availability.mode = mode;
    availability.feePerHour = feePerHour;

    await availability.save();
    res.json({ message: 'Availability updated successfully', availability });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  DELETE /api/doctor/availability/:id
exports.deleteAvailability = async (req, res) => {
  try {
    const availability = await Availability.findById(req.params.id);
    if (!availability) return res.status(404).json({ message: 'Not found' });
    if (availability.doctorId.toString() !== req.user.id) return res.status(403).json({ message: 'Unauthorized' });

    const hasBooked = availability.slots.some(s => s.booked);
    if (hasBooked) {
      return res.status(400).json({ message: 'Cannot delete availability because some slots are already booked.' });
    }

    await availability.deleteOne();
    res.json({ message: 'Availability deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/doctor/availability/my
exports.getMyAvailability = async (req, res) => {
  try {
    const availability = await Availability.find({ doctorId: req.user.id }).sort({ date: 1 });
    res.json(availability);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// @route  GET /api/doctor/:id/availability
exports.getDoctorAvailability = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const availability = await Availability.find({ 
      doctorId: req.params.id,
      date: { $gte: today } // Only future dates
    }).sort({ date: 1 });
    
    res.json(availability);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
