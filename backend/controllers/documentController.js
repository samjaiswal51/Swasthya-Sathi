const MedicalDocument = require('../models/MedicalDocument');

// @desc    Upload a new medical document
// @route   POST /api/patient/documents
// @access  Private
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const { title, type, doctorName, hospitalName, reportDate, notes, tags } = req.body;

    // Parse tags if it's a comma-separated string
    let parsedTags = [];
    if (tags) {
      parsedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    const newDocument = new MedicalDocument({
      user: req.user.id,
      title,
      type,
      doctorName,
      hospitalName,
      reportDate,
      notes,
      tags: parsedTags,
      fileName: req.file.originalname,
      fileData: req.file.buffer, // Save buffer directly to MongoDB
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    });

    await newDocument.save();
    
    // Don't send the entire buffer back to the frontend in the response
    const documentResponse = newDocument.toObject();
    delete documentResponse.fileData;
    
    res.status(201).json(documentResponse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error during upload' });
  }
};

// @desc    Get all medical documents for a user
// @route   GET /api/patient/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const documents = await MedicalDocument.find({ user: req.user.id })
      .select('-fileData') // Exclude file data for fast listing
      .sort({ reportDate: -1 });
    res.json(documents);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get a single document by ID
// @route   GET /api/patient/documents/:id
// @access  Private
exports.getDocumentById = async (req, res) => {
  try {
    const document = await MedicalDocument.findOne({ _id: req.params.id, user: req.user.id }).select('-fileData');
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    View document securely
// @route   GET /api/patient/documents/:id/view
// @access  Private
exports.viewDocument = async (req, res) => {
  try {
    const document = await MedicalDocument.findOne({ _id: req.params.id, user: req.user.id });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    res.setHeader('Content-Type', document.mimeType);
    res.send(document.fileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Download document securely
// @route   GET /api/patient/documents/:id/download
// @access  Private
exports.downloadDocument = async (req, res) => {
  try {
    const document = await MedicalDocument.findOne({ _id: req.params.id, user: req.user.id });
    if (!document) return res.status(404).json({ message: 'Document not found' });

    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `attachment; filename="${document.fileName}"`);
    res.send(document.fileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update document metadata (pin, favorite, etc.)
// @route   PUT /api/patient/documents/:id
// @access  Private
exports.updateDocument = async (req, res) => {
  try {
    const { isPinned, isFavorite, title, notes, tags } = req.body;

    let parsedTags;
    if (tags !== undefined) {
       parsedTags = typeof tags === 'string' ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : tags;
    }

    const updateFields = {};
    if (isPinned !== undefined) updateFields.isPinned = isPinned;
    if (isFavorite !== undefined) updateFields.isFavorite = isFavorite;
    if (title !== undefined) updateFields.title = title;
    if (notes !== undefined) updateFields.notes = notes;
    if (parsedTags !== undefined) updateFields.tags = parsedTags;

    const document = await MedicalDocument.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updateFields },
      { returnDocument: 'after' }
    ).select('-fileData');

    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    res.json(document);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a document
// @route   DELETE /api/patient/documents/:id
// @access  Private
exports.deleteDocument = async (req, res) => {
  try {
    const document = await MedicalDocument.findOne({ _id: req.params.id, user: req.user.id }).select('_id');
    
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await MedicalDocument.deleteOne({ _id: req.params.id });

    res.json({ message: 'Document removed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};
