const mongoose = require('mongoose');

/**
 * @description Schema for storing summarized PDF document information.
 * This model links a user to their uploaded PDF, its Cloudinary storage details,
 * a public access URL, and the NLP-generated summary.
 */
const pdfDocumentSchema = new mongoose.Schema(
  {
    // Reference to the user who uploaded the document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    // The original filename from the user's computer
    originalFilename: {
      type: String,
      required: [true, 'Original filename is required.'],
      trim: true,
    },
    // The unique filename generated for server storage (e.g., Cloudinary public_id)
    serverFilename: {
      type: String,
      required: [true, 'Server filename is required.'],
      unique: true,
    },
    // The publicly accessible URL from Cloudinary
    fileUrl: { type: String, required: [true, 'Public file URL is required.'] },
    // Cloudinary's unique public ID for the file
    cloudinary_id: { type: String, required: true },
    // The file's MIME type (e.g., 'application/pdf')
    mimeType: { type: String },
    // The file's size in bytes
    fileSize: { type: Number },
    // The resource type on Cloudinary (e.g., 'raw')
    resourceType: { type: String, default: 'raw' },
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
