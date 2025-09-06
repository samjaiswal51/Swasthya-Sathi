const { uploadToCloudinary } = require('../utils/cloudinaryUploader');
const { generateSummary } = require('../services/pdfSummarizer.service');
const PdfDocument = require('../models/pdfDocument.model');
const cloudinary = require('../config/cloudinaryConfig');

/**
 * @description Handles PDF upload to memory, generates a summary, uploads to Cloudinary, and saves the record to the DB.
 */
exports.uploadAndSummarize = async (req, res) => {
  try {
    // 1. Validate Input (Multer has already stored the file in req.file)
    if (!req.file) {
      return res.status(400).json({ message: 'No PDF file was uploaded.' });
    }

    // 2. Generate Summary from buffer
    const summary = await generateSummary(req.file.buffer);

    // 3. Upload File to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, {
      folder: 'swasthya-sathi-summaries',
      resource_type: 'raw',
    });

    if (!result || !result.secure_url) {
      return res.status(500).json({ message: 'Cloudinary upload failed.' });
    }

    // 4. Create Database Record with Cloudinary data
    const newDocument = new PdfDocument({
      user: req.user.id, // Assumes auth middleware provides req.user
      originalFilename: req.file.originalname,
      serverFilename: result.public_id, // Use public_id as a unique identifier
      summary,
      // Add new fields
      fileUrl: result.secure_url,
      cloudinary_id: result.public_id,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      resourceType: result.resource_type,
    });

    await newDocument.save();

    // 5. Send Response
    res.status(201).json(newDocument);

  } catch (error) {
    console.error('Upload and Summarize Error:', error);
    res.status(500).json({ message: 'Server error during file processing.', error: error.message });
  }
};

/**
 * @description Retrieves all documents for the currently logged-in user.
 */
exports.getDocumentsForUser = async (req, res) => {
  try {
    const documents = await PdfDocument.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(documents);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching documents.', error: error.message });
  }
};

/**
 * @description Retrieves a single document by its ID, ensuring it belongs to the user.
 */
exports.getDocumentById = async (req, res) => {
  try {
    const document = await PdfDocument.findOne({ _id: req.params.id, user: req.user.id });
    if (!document) {
      return res.status(404).json({ message: 'Document not found or you do not have permission to view it.' });
    }
    res.status(200).json(document);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching document.', error: error.message });
  }
};

/**
 * @description Deletes a document record from the DB and the corresponding file from Cloudinary.
 */
exports.deleteDocument = async (req, res) => {
  try {
    const document = await PdfDocument.findOne({ _id: req.params.id, user: req.user.id });

    if (!document) {
      return res.status(404).json({ message: 'Document not found or you do not have permission to delete it.' });
    }

    // Delete from Cloudinary
    if (document.cloudinary_id) {
      // For 'raw' files like PDFs, you must specify the resource_type
      await cloudinary.uploader.destroy(document.cloudinary_id, { resource_type: 'raw' });
    }

    // Delete the record from the database
    await PdfDocument.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    console.error('Error deleting document:', error);
    res.status(500).json({ message: 'Error deleting document.', error: error.message });
  }
};
