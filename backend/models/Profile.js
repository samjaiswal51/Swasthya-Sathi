// backend/models/Profile.js

const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    // Link to the User model (for authentication)
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // This creates the connection to the User model
      unique: true, // Each user can have only one profile
    },

    // Section for Personal Information
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other'],
    },
    contactNumber: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },

    // Section for Health Profile
    bloodGroup: {
      type: String,
      trim: true,
    },
    allergies: [
      {
        type: String,
        trim: true,
      },
    ],

    // Section for Emergency Contacts
    emergencyContacts: [
      {
        name: { type: String, required: true, trim: true },
        relationship: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
      },
    ],
  },
  {
    // Automatically adds createdAt and updatedAt fields for profile history
    timestamps: true,
  }
);

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;