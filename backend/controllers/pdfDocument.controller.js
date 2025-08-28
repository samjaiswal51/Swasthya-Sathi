const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const PdfDocument = require('../models/pdfDocument.model');
const { generateSummary } = require('../services/pdfSummarizer.service');

const MAX_FILE_SIZE_MB = 10;
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'documents');

// Ensure the upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

/**
 * @description Handles PDF upload, saves it to the server, generates a summary, and saves the record to the DB.
 */
exports.uploadAndSummarize = async (req, res) => {
  let tempFilePath = null;

  try {
    // 1. Validate Input
    if (!req.files || !req.files.document) {
      return res.status(400).json({ message: 'No PDF file was uploaded.' });
    }

    const file = req.files.document;

    if (file.mimetype !== 'application/pdf') {
      return res.status(400).json({ message: 'Invalid file type. Only PDF files are allowed.' });
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return res.status(400).json({ message: `File size exceeds the ${MAX_FILE_SIZE_MB}MB limit.` });
    }

    // 2. Save File Permanently
    const serverFilename = `${uuidv4()}.pdf`;
    const filePath = path.join(UPLOAD_DIR, serverFilename);
    tempFilePath = filePath; // Store for potential cleanup

    await file.mv(filePath);

    // 3. Generate Summary
    const summary = await generateSummary(filePath);

    // 4. Create Database Record
    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/documents/${serverFilename}`;
    
    const newDocument = new PdfDocument({
      user: req.user.id, // Assumes auth middleware provides req.user
      originalFilename: file.name,
      serverFilename,
      filePath,
      fileUrl,
      summary,
    });

    await newDocument.save();

    // 5. Send Response
    res.status(201).json(newDocument);
  } catch (error) {
    console.error('Upload and Summarize Error:', error);

    // CRITICAL: Cleanup the saved file if any step after saving it fails
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      fs.unlinkSync(tempFilePath);
    }

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
 * @description Deletes a document record from the DB and the corresponding file from the filesystem.
 */
exports.deleteDocument = async (req, res) => {
  try {
    const document = await PdfDocument.findOne({ _id: req.params.id, user: req.user.id });

    if (!document) {
      return res.status(404).json({ message: 'Document not found or you do not have permission to delete it.' });
    }

    // Delete the physical file first
    if (fs.existsSync(document.filePath)) {
      fs.unlinkSync(document.filePath);
    }

    // Delete the record from the database
    await PdfDocument.deleteOne({ _id: req.params.id });

    res.status(200).json({ message: 'Document deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting document.', error: error.message });
  }
};