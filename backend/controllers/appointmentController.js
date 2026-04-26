const Appointment = require('../models/Appointment');
const Availability = require('../models/Availability');
const Notification = require('../models/Notification'); // Used existing Notification model if exists, otherwise we just log it or handle it. Wait, I should make sure it doesn't crash if Notification model has different structure. Let's just create notifications.

// Utility to generate time slots
const generateTimeSlots = (startTime, endTime, interval) => {
  const slots = [];
  let current = new Date(`2000-01-01T${startTime}:00`);
  const end = new Date(`2000-01-01T${endTime}:00`);

  while (current < end) {
    const hours = String(current.getHours()).padStart(2, '0');
    const mins = String(current.getMinutes()).padStart(2, '0');
    slots.push(`${hours}:${mins}`);
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
};

// 1. Get Available Slots for a Doctor on a specific Date
exports.getDoctorSlots = async (req, res) => {
  try {
    const { id } = req.params; // doctorId
    const { date } = req.query; // YYYY-MM-DD

    if (!date) return res.status(400).json({ message: 'Date is required' });

    // Find Doctor Availability
    const availability = await Availability.findOne({ doctorId: id });
    if (!availability) return res.status(404).json({ message: 'Doctor availability not set' });

    // Determine day of week (e.g. 'Mon', 'Tue')
    const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const dayConfig = availability.availableDays.find(d => d.day === dayOfWeek);

    if (!dayConfig || !dayConfig.isOpen) {
      return res.json({ slots: [], message: 'Doctor is not available on this day' });
    }

    // Generate all potential slots
    const allSlots = generateTimeSlots(dayConfig.startTime, dayConfig.endTime, availability.slotDuration);

    // Fetch existing appointments to filter out booked/reserved slots
    // 5-minute reservation logic:
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    
    const bookedAppointments = await Appointment.find({
      doctorId: id,
      date: date,
      $or: [
        { appointmentStatus: 'confirmed' },
        { appointmentStatus: 'completed' },
        { paymentStatus: 'paid' },
        // If pending, it's reserved for 5 minutes
        { paymentStatus: 'pending', createdAt: { $gte: fiveMinsAgo } }
      ]
    });

    const bookedTimes = bookedAppointments.map(app => app.time);
    const availableSlots = allSlots.filter(slot => !bookedTimes.includes(slot));

    res.json({
      slots: availableSlots,
      fee: availability.consultationFee,
      consultationType: availability.consultationType
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 2. Book an Appointment (Temporarily Reserve Slot)
exports.bookAppointment = async (req, res) => {
  try {
    const { doctorId, date, time, fee, consultationType } = req.body;
    const patientId = req.user.id;

    // Check Double Booking
    const fiveMinsAgo = new Date(Date.now() - 5 * 60 * 1000);
    const existing = await Appointment.findOne({
      doctorId,
      date,
      time,
      $or: [
        { appointmentStatus: 'confirmed' },
        { paymentStatus: 'paid' },
        { paymentStatus: 'pending', createdAt: { $gte: fiveMinsAgo } }
      ]
    });

    if (existing) {
      return res.status(400).json({ message: 'Slot is no longer available' });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      time,
      fee,
      consultationType: consultationType === 'Both' ? 'Online' : consultationType,
      paymentId: req.body.paymentId,
      paymentStatus: 'paid',
      appointmentStatus: 'pending_approval' 
    });
    
    await appointment.save();

    // Fetch User details for names in Payment record
    const User = require('../models/User');
    const patientUser = await User.findById(patientId);
    const doctorUser = await User.findById(doctorId);

    // Create Payment Record
    const Payment = require('../models/Payment');
    const payment = new Payment({
      transactionId: req.body.paymentId, // from fake payment frontend
      appointmentId: appointment._id,
      patientId: patientId,
      patientName: patientUser ? patientUser.name : 'Patient',
      doctorId: doctorId,
      doctorName: doctorUser ? doctorUser.name : 'Doctor',
      amount: fee,
      platformFee: 0,
      doctorNetAmount: fee,
      paymentMethod: 'fake_payment',
      status: 'paid',
      consultationType: consultationType === 'Both' ? 'Online' : consultationType,
      date,
      timeSlot: time
    });
    await payment.save();

    // Mark the slot as booked in the Availability document
    const Availability = require('../models/Availability');
    await Availability.updateOne(
      { doctorId, date, "slots.time": time },
      { $set: { "slots.$.booked": true, "slots.$.bookedBy": patientId } }
    );

    // Send notifications if Notification model exists
    try {
      const NotificationModel = require('../models/Notification');
      if (NotificationModel) {
        await NotificationModel.create({
          userId: doctorId,
          type: 'booking',
          title: 'New Appointment Request',
          message: `New paid appointment requested for ${date} at ${time}. Please approve or reject.`,
          link: '/doctor-dashboard/appointments'
        });
        await NotificationModel.create({
          userId: patientId,
          type: 'booking',
          title: 'Appointment Pending Approval',
          message: `Your appointment for ${date} at ${time} is pending doctor approval.`,
          link: '/patient-dashboard/appointments'
        });
      }
    } catch(e) { console.error('Notification error', e); }

    res.status(201).json({ message: 'Appointment booked successfully', appointment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 3. Get Patient Appointments
exports.getPatientAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ patientId: req.user.id })
      .populate('doctorId', 'name email')
      .sort({ date: -1, time: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 4. Get Doctor Appointments
exports.getDoctorAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({ doctorId: req.user.id })
      .populate('patientId', 'name email')
      .sort({ date: -1, time: -1 });
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 5. Cancel Appointment
exports.cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    
    // Ensure owner
    if (appointment.patientId.toString() !== req.user.id && appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.appointmentStatus = 'cancelled';
    await appointment.save();

    // Release the slot
    const Availability = require('../models/Availability');
    await Availability.updateOne(
      { doctorId: appointment.doctorId, date: appointment.date, "slots.time": appointment.time },
      { $set: { "slots.$.booked": false, "slots.$.bookedBy": null } }
    );

    // Update Payment to refunded
    const Payment = require('../models/Payment');
    await Payment.findOneAndUpdate(
      { appointmentId: appointment._id },
      { $set: { status: 'refunded' } }
    );

    // Send Notification
    try {
      const NotificationModel = require('../models/Notification');
      if (NotificationModel) {
        await NotificationModel.create({
          userId: appointment.patientId,
          type: 'booking',
          title: 'Appointment Cancelled & Refunded',
          message: `Your appointment for ${appointment.date} at ${appointment.time} was cancelled. Rs. ${appointment.fee} has been refunded to your source account.`,
          link: '/patient-dashboard/payments'
        });
      }
    } catch(e) { console.error('Notification error', e); }

    res.json({ message: 'Appointment cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 6. Complete Appointment
exports.completeAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.appointmentStatus = 'completed';
    await appointment.save();

    // Release the slot so it can be booked again (as requested)
    const Availability = require('../models/Availability');
    await Availability.updateOne(
      { doctorId: appointment.doctorId, date: appointment.date, "slots.time": appointment.time },
      { $set: { "slots.$.booked": false, "slots.$.bookedBy": null } }
    );

    res.json({ message: 'Appointment marked as completed and slot freed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 7. Approve Appointment
exports.approveAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    if (appointment.appointmentStatus !== 'pending_approval') {
      return res.status(400).json({ message: 'Appointment is not pending approval' });
    }

    appointment.appointmentStatus = 'confirmed';
    await appointment.save();

    try {
      const NotificationModel = require('../models/Notification');
      if (NotificationModel) {
        await NotificationModel.create({
          userId: appointment.patientId,
          type: 'booking',
          title: 'Appointment Approved',
          message: `Your appointment for ${appointment.date} at ${appointment.time} has been approved by the doctor.`,
          link: '/patient-dashboard/appointments'
        });
      }
    } catch(e) { console.error('Notification error', e); }

    res.json({ message: 'Appointment approved successfully', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// 8. Reject Appointment
exports.rejectAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: 'Not found' });
    
    if (appointment.doctorId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    appointment.appointmentStatus = 'cancelled';
    await appointment.save();

    // Release the slot
    const Availability = require('../models/Availability');
    await Availability.updateOne(
      { doctorId: appointment.doctorId, date: appointment.date, "slots.time": appointment.time },
      { $set: { "slots.$.booked": false, "slots.$.bookedBy": null } }
    );

    // Update Payment to refunded
    const Payment = require('../models/Payment');
    await Payment.findOneAndUpdate(
      { appointmentId: appointment._id },
      { $set: { status: 'refunded' } }
    );

    try {
      const NotificationModel = require('../models/Notification');
      if (NotificationModel) {
        await NotificationModel.create({
          userId: appointment.patientId,
          type: 'booking',
          title: 'Appointment Cancelled & Refunded',
          message: `Your appointment request for ${appointment.date} at ${appointment.time} was cancelled by the doctor. Rs. ${appointment.fee} has been refunded to your source account.`,
          link: '/patient-dashboard/payments'
        });
      }
    } catch(e) { console.error('Notification error', e); }

    res.json({ message: 'Appointment rejected', appointment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
