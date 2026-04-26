const mongoose = require('mongoose');
const DoctorProfile = require('./models/DoctorProfile');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected');
  try {
    const body = {
      fullName: 'Test Doctor',
      gender: 'Male',
      dob: new Date(),
      mobile: '1234567890',
      email: 'test@doctor.com',
      registrationNumber: 'REG123',
      degree: 'MBBS',
      specialization: 'General',
      experienceYears: "",
      hospitalName: 'Test Hospital',
      consultationFee: "",
      languages: '["English"]',
      bio: 'Test bio',
      days: '["Mon"]',
      morningStart: '09:00',
      morningEnd: '12:00',
      eveningStart: '17:00',
      eveningEnd: '20:00',
      consultationMode: 'Both',
      clinicAddress: 'Test Address',
      city: 'Test City',
      state: 'Test State',
      pincode: '123456',
      user: new mongoose.Types.ObjectId()
    };
    
    // Parse JSON-stringified arrays (languages, days from stepper)
    ['languages', 'days'].forEach(key => {
      if (typeof body[key] === 'string') {
        try { body[key] = JSON.parse(body[key]); } catch { body[key] = []; }
      }
    });

    const availability = {
      days:         body.days         || [],
      morningStart: body.morningStart || '',
      morningEnd:   body.morningEnd   || '',
      eveningStart: body.eveningStart || '',
      eveningEnd:   body.eveningEnd   || '',
    };
    ['days','morningStart','morningEnd','eveningStart','eveningEnd'].forEach(k => delete body[k]);
    body.availability = availability;

    body.documents = {};
    body.documents.degreeCertificate = 'url';

    const profile = await DoctorProfile.findOneAndUpdate(
      { user: body.user },
      { $set: body },
      { new: true, upsert: true, runValidators: false }
    );
    console.log('Success:', profile);
  } catch (err) {
    console.error('Error:', err);
  }
  process.exit(0);
});
