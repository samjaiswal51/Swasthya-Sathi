// backend/controllers/authController.js

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// A function to generate a JWT token (UPDATED: now includes email)
const generateToken = (id, role, email) => {
    return jwt.sign({ id, role, email }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
    // UPDATED: Destructure name from req.body
    const { name, email, password, role } = req.body;

    try {
        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create a new user with the specified role
        // UPDATED: Include name when creating the user
        user = await User.create({
            name,
            email,
            password,
            role,
        });

        // Generate a token for the new user (UPDATED: passing email)
        const token = generateToken(user._id, user.role, user.email);

        // Send back a success response with the token and user role
        res.status(201).json({
            message: 'Registration successful',
            token,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @desc    Authenticate a user and get token
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare the provided password with the stored hashed password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token (UPDATED: passing email)
        const token = generateToken(user._id, user.role, user.email);

        // Send back the token and user role for redirection on the frontend
        res.json({
            message: 'Login successful',
            token,
            role: user.role,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};
