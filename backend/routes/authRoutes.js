const express = require('express');
const { registerUser, loginUser } = require('../controllers/authController');

const router = express.Router();

// Define the registration route
router.post('/register', registerUser);

// Define the login route
router.post('/login', loginUser);

module.exports = router;