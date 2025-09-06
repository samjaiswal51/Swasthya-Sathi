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

    // Swasthya Card ID
    swasthyaCardId: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple documents to have a null value
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

// Mongoose Hook to auto-generate the Swasthya Card ID for new profiles
profileSchema.pre('save', async function (next) {
  // Check if it's a new document and swasthyaCardId is not set
  if (this.isNew && !this.swasthyaCardId) {
    let uniqueId;
    let idExists = true;
    // Loop until a unique ID is found
    while (idExists) {
      // Generate a 6-digit random number as a string
      uniqueId = Math.floor(100000 + Math.random() * 900000).toString();
      // Check if a profile with this ID already exists
      const existingProfile = await this.constructor.findOne({ swasthyaCardId: uniqueId });
      if (!existingProfile) {
        idExists = false;
      }
    }
    this.swasthyaCardId = uniqueId;
  }
  next();
});


const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
