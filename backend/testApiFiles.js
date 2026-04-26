const jwt = require('jsonwebtoken');
const fs = require('fs');
require('dotenv').config();

async function testSubmitWithFile() {
  const fakeToken = jwt.sign(
    { user: { id: '60d0fe4f5311236168a109ca', role: 'doctor' } },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  const formData = new FormData();
  formData.append('fullName', 'Dr. John Doe');
  
  // Create a dummy text file
  fs.writeFileSync('dummy.jpg', 'dummy image content');
  const fileBlob = new Blob([fs.readFileSync('dummy.jpg')], { type: 'image/jpeg' });
  
  formData.append('degreeCertificate', fileBlob, 'dummy.jpg');
  formData.append('licenseCertificate', fileBlob, 'dummy.jpg');
  formData.append('idProof', fileBlob, 'dummy.jpg');

  try {
    const res = await fetch('http://localhost:5000/api/doctor/profile', {
      method: 'POST',
      headers: { Authorization: `Bearer ${fakeToken}` },
      body: formData
    });
    
    const text = await res.text();
    console.log('HTTP Status:', res.status);
    console.log('Response Body:', text.substring(0, 500));
  } catch (err) {
    console.error('Fetch Error:', err.message);
  } finally {
    fs.unlinkSync('dummy.jpg');
  }
}

testSubmitWithFile();
