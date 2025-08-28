const mongoose = require('mongoose');

/**
 * @description Schema for storing summarized PDF document information.
 * This model links a user to their uploaded PDF, its storage details,
 * a public access URL, and the NLP-generated summary.
 */
const pdfDocumentSchema = new mongoose.Schema(
  {
    // Reference to the user who uploaded the document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true, // Index for faster queries by user
    },
    // The original filename from the user's computer
    originalFilename: {
      type: String,
      required: [true, 'Original filename is required.'],
      trim: true,
    },
    // The unique filename generated for server storage (e.g., using UUID)
    serverFilename: {
      type: String,
      required: [true, 'Server filename is required.'],
      unique: true,
    },
    // The full physical path where the file is stored on the server's filesystem
    filePath: {
      type: String,
      required: [true, 'File path is required.'],
    },
    // The publicly accessible URL to view the PDF file
    fileUrl: {
      type: String,
      required: [true, 'Public file URL is required.'],
    },
    // The text summary generated from the PDF's content
    summary: {
      type: String,
      required: [true, 'A document summary is required.'],
    },
  },
  {
    // Automatically add createdAt and updatedAt timestamps
    timestamps: true,
  }
);

const PdfDocument = mongoose.model('PdfDocument', pdfDocumentSchema);

module.exports = PdfDocument;