// backend/controllers/patientController.js

const asyncHandler = require('express-async-handler');
const Document = require('../models/Document');
const Profile = require('../models/Profile');
const { uploadToCloudinary } = require('../utils/cloudinaryUploader');
const cloudinary = require('../config/cloudinaryConfig');

// --- Swasthya Card Functions ---

// @desc    Get full Swasthya Card details for the logged-in patient
// @route   GET /api/patient/profile/swasthya-card
// @access  Private
const getSwasthyaCard = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        res.status(404);
        throw new Error('Patient profile not found.');
    }

    res.json({
        success: true,
        swasthyaCard: {
            patientId: profile._id, // Needed for QR code URL
            name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
            cardNumber: profile.swasthyaCardId,
            dob: profile.dateOfBirth,
            gender: profile.gender,
            bloodGroup: profile.bloodGroup,
            allergies: profile.allergies,
            emergencyContact: profile.emergencyContacts[0] || {}
        },
    });
});

// @desc    Get limited patient info for QR code scans
// @route   GET /api/patient/scan/:patientId
// @access  Public
const getScanProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findById(req.params.patientId).select('firstName lastName bloodGroup allergies');

    if (!profile) {
        res.status(404);
        throw new Error('Patient not found.');
    }

    res.json({
        name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
        bloodGroup: profile.bloodGroup,
        allergies: profile.allergies,
    });
});

// @desc    Get full patient info using the 6-digit Swasthya Card ID
// @route   GET /api/patient/swasthya-id/:swasthyaId
// @access  Public (for emergency services)
const getPatientBySwasthyaId = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ swasthyaCardId: req.params.swasthyaId });

    if (!profile) {
        res.status(404);
        throw new Error('Patient with this Swasthya Card ID not found.');
    }

    // Returns a more comprehensive profile for emergency use
    res.json(profile);
});


// ... (keep uploadDocument, getDocuments, getDocument, deleteDocument functions as they are) ...

// @desc    Redirect to a document's secure URL for viewing
// @route   GET /api/patient/documents/:id/view
// @access  Private
const viewDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);

    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }
    
    // Ensure the user is authorized to view this document
    if (document.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }

    // Generate a fresh, public URL from Cloudinary
    const viewUrl = cloudinary.url(document.cloudinary_id, {
        resource_type: document.resourceType || 'raw',
        secure: true,
    });

    // Redirect the user's browser to the document URL
    res.redirect(viewUrl);
});


// --- Functions to keep (no changes needed) ---

const uploadDocument = asyncHandler(async (req, res) => {
    if (!req.file) {
        res.status(400);
        throw new Error('Please upload a file.');
    }
    try {
        const resourceType = req.file.mimetype.startsWith('image/') ? 'image' : 'raw';
        const result = await uploadToCloudinary(req.file.buffer, {
            folder: 'swasthya-sathi-documents',
            resource_type: resourceType,
        });
        if (!result || !result.secure_url) {
            res.status(500);
            throw new Error('Cloudinary upload failed.');
        }
        const newDocument = new Document({
            user: req.user.id,
            fileName: req.file.originalname,
            fileURL: result.secure_url,
            fileType: req.body.fileType || 'Other',
            cloudinary_id: result.public_id,
            mimeType: req.file.mimetype,
            fileSize: req.file.size,
            resourceType: result.resource_type,
        });
        const savedDocument = await newDocument.save();
        res.status(201).json(savedDocument);
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500);
        throw new Error(`Upload failed: ${error.message}`);
    }
});

const getDocuments = asyncHandler(async (req, res) => {
    const documents = await Document.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(documents);
});

const getDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);
    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }
    if (document.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    const viewUrl = cloudinary.url(document.cloudinary_id, {
        resource_type: document.resourceType || 'raw',
        secure: true,
    });
    res.json({ ...document.toObject(), fileURL: viewUrl });
});

const deleteDocument = asyncHandler(async (req, res) => {
    const document = await Document.findById(req.params.id);
    if (!document) {
        res.status(404);
        throw new Error('Document not found');
    }
    if(document.user.toString() !== req.user.id) {
        res.status(401);
        throw new Error('User not authorized');
    }
    if (document.cloudinary_id) {
        const resourceType = document.resourceType || 'raw';
        await cloudinary.uploader.destroy(document.cloudinary_id, {
            resource_type: resourceType,
        });
    }
    await document.deleteOne();
    res.json({ message: 'Document removed successfully' });
});

const getPatientProfile = asyncHandler(async (req, res) => {
    const profile = await Profile.findOne({ user: req.user.id });
    if (profile) res.json(profile);
    else res.status(404).json({ message: 'Profile not found' });
});

const updatePatientProfile = asyncHandler(async (req, res) => {
    const profileFields = { user: req.user.id, ...req.body };
    let profile = await Profile.findOneAndUpdate(
        { user: req.user.id },
        { $set: profileFields },
        { new: true, upsert: true }
    );
    res.json(profile);
});

module.exports = {
    getPatientProfile,
    updatePatientProfile,
    uploadDocument,
    getDocuments,
    getDocument,
    viewDocument,
    deleteDocument,
    // Export new functions
    getSwasthyaCard,
    getScanProfile,
    getPatientBySwasthyaId,
};
