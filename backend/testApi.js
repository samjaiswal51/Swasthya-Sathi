const jwt = require('jsonwebtoken');
require('dotenv').config();

async function testSubmit() {
  const fakeToken = jwt.sign(
    { user: { id: '60d0fe4f5311236168a109ca', role: 'doctor' } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const formData = new FormData();
  formData.append('fullName', 'Dr. John Doe');
  formData.append('gender', 'Male');
  formData.append('dob', '1980-01-01');
  formData.append('mobile', '9876543210');
  formData.append('email', 'johndoe@test.com');
  formData.append('registrationNumber', 'REG123');
  formData.append('degree', 'MBBS');
  formData.append('specialization', 'General Physician');
  formData.append('experienceYears', '5');
  formData.append('hospitalName', 'City Hospital');
  formData.append('consultationFee', '500');
  formData.append('languages', '["English"]');
  formData.append('bio', 'Hello');
  formData.append('days', '["Mon"]');
  formData.append('morningStart', '10:00');
  formData.append('morningEnd', '12:00');
  formData.append('eveningStart', '');
  formData.append('eveningEnd', '');
  formData.append('consultationMode', 'Both');
  formData.append('clinicAddress', '123 St');
  formData.append('city', 'City');
  formData.append('state', 'State');
  formData.append('pincode', '123456');

  try {
    console.log('Sending request...');
    const res = await fetch('http://localhost:5000/api/doctor/profile', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${fakeToken}`
      },
      body: formData
    });
    
    const data = await res.json();
    if (!res.ok) {
      console.error('API Error Response:', res.status, data);
    } else {
      console.log('Success!', data);
    }
  } catch (err) {
    console.error('Request Error:', err.message);
  }
}

testSubmit();
