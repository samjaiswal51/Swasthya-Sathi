const ReportAnalysis = require('../models/ReportAnalysis');
const aiService = require('../services/aiService');

// @desc    Upload report and trigger AI Analysis
// @route   POST /api/patient/report-analyzer/upload
// @access  Private
exports.uploadAndAnalyze = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a PDF or Image file.' });
    }

    const fileBuffer = req.file.buffer;
    const mimeType = req.file.mimetype;
    const originalFileName = req.file.originalname;

    // Step 1: Extract Text
    const extractedText = await aiService.extractText(fileBuffer, mimeType);

    // Step 2: NLP Analysis
    const analysisResult = aiService.analyzeReport(extractedText);

    // Step 3: Save to DB
    const newAnalysis = new ReportAnalysis({
      user: req.user.id,
      originalFileName,
      extractedText,
      ...analysisResult
    });

    await newAnalysis.save();

    res.status(201).json(newAnalysis);

  } catch (error) {
    console.error('Analyzer Error:', error);
    res.status(500).json({ message: error.message || 'Server Error analyzing report' });
  }
};

// @desc    Get analysis history
// @route   GET /api/patient/report-analyzer/history
// @access  Private
exports.getHistory = async (req, res) => {
  try {
    // We don't need to send the massive extractedText array for the history list
    const history = await ReportAnalysis.find({ user: req.user.id })
                                      .select('-extractedText')
                                      .sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching history' });
  }
};

// @desc    Get single analysis result
// @route   GET /api/patient/report-analyzer/:id
// @access  Private
exports.getAnalysis = async (req, res) => {
  try {
    const analysis = await ReportAnalysis.findOne({ _id: req.params.id, user: req.user.id });
    if (!analysis) return res.status(404).json({ message: 'Report not found' });
    res.json(analysis);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching report' });
  }
};

// @desc    Delete an analysis record
// @route   DELETE /api/patient/report-analyzer/:id
// @access  Private
exports.deleteAnalysis = async (req, res) => {
  try {
    const analysis = await ReportAnalysis.findOne({ _id: req.params.id, user: req.user.id });
    if (!analysis) return res.status(404).json({ message: 'Report not found' });

    await ReportAnalysis.deleteOne({ _id: req.params.id });
    res.json({ message: 'Report history deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error deleting report' });
  }
};
