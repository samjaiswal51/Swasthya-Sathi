const pdfParse = require('pdf-parse');
const tesseract = require('tesseract.js');

/**
 * Extracts text from a file buffer.
 * Supports PDF and Images (JPG/PNG).
 */
exports.extractText = async (fileBuffer, mimeType) => {
  try {
    if (mimeType === 'application/pdf') {
      const data = await pdfParse(fileBuffer);
      return data.text;
    } else if (mimeType.startsWith('image/')) {
      const { data: { text } } = await tesseract.recognize(fileBuffer, 'eng');
      return text;
    } else {
      throw new Error('Unsupported file type for analysis.');
    }
  } catch (error) {
    console.error('Text Extraction Error:', error);
    throw new Error('Failed to extract text from the document.');
  }
};

/**
 * Highly intelligent Medical Regex-NLP Engine.
 * Scans raw extracted text for common lab parameters and compares them to standard reference ranges.
 * 
 * If you configure a HuggingFace or OpenAI API key in the future, you can swap this out!
 */
exports.analyzeReport = (text) => {
  const normalizedText = text.toLowerCase().replace(/\s+/g, ' ');
  
  const findings = [];
  let riskLevel = 'Normal';
  let recommendedDoctor = 'General Physician';
  const sentencesForSummary = [];

  // Define parameters, regex to find them, and their normal ranges
  // Regex looks for the word, followed by some noise, followed by a number
  const rules = [
    {
      name: 'Hemoglobin',
      regex: /hemoglobin.*?(\d+(\.\d+)?)/i,
      min: 12.0, max: 17.5,
      lowMsg: 'Your Hemoglobin is low (Anemia). You may feel tired.',
      highMsg: 'Your Hemoglobin is slightly elevated.',
      doctor: 'Hematologist or General Physician'
    },
    {
      name: 'Fasting Glucose (Sugar)',
      regex: /(fasting glucose|fasting sugar).*?(\d+(\.\d+)?)/i,
      min: 70, max: 100,
      lowMsg: 'Your fasting sugar is lower than normal (Hypoglycemia).',
      highMsg: 'Your fasting sugar is high. This indicates risk of Diabetes.',
      doctor: 'Endocrinologist'
    },
    {
      name: 'Total Cholesterol',
      regex: /(total cholesterol|cholesterol).*?(\d+(\.\d+)?)/i,
      min: 0, max: 200,
      lowMsg: 'Your cholesterol is very low.',
      highMsg: 'Your cholesterol is elevated. This requires diet control or medication.',
      doctor: 'Cardiologist'
    },
    {
      name: 'TSH (Thyroid)',
      regex: /(tsh|thyroid stimulating hormone).*?(\d+(\.\d+)?)/i,
      min: 0.4, max: 4.0,
      lowMsg: 'Your TSH is low, indicating possible Hyperthyroidism.',
      highMsg: 'Your TSH is high, indicating possible Hypothyroidism.',
      doctor: 'Endocrinologist'
    },
    {
      name: 'Platelet Count',
      regex: /(platelet|platelets).*?(\d+(\.\d+)?)/i, // Note: often in thousands, e.g. 150 for 150,000
      min: 150, max: 450,
      lowMsg: 'Your Platelet count is low (Thrombocytopenia). Avoid injuries.',
      highMsg: 'Your Platelet count is elevated.',
      doctor: 'Hematologist'
    }
  ];

  let hasAbnormal = false;
  let hasCritical = false;

  rules.forEach(rule => {
    const match = normalizedText.match(rule.regex);
    if (match) {
      const valueStr = match[match.length - 2]; // The captured number
      const value = parseFloat(valueStr);
      
      let status = 'Normal';
      if (value < rule.min) {
        status = 'Low';
        hasAbnormal = true;
        sentencesForSummary.push(rule.lowMsg);
        recommendedDoctor = rule.doctor;
      } else if (value > rule.max) {
        status = 'High';
        hasAbnormal = true;
        if (value > rule.max * 1.5) hasCritical = true; // Very high
        sentencesForSummary.push(rule.highMsg);
        recommendedDoctor = rule.doctor;
      }

      findings.push({
        parameter: rule.name,
        value: valueStr,
        status: status
      });
    }
  });

  if (hasCritical) {
    riskLevel = 'Needs Attention';
  } else if (hasAbnormal) {
    riskLevel = 'Mild Concern';
  }

  // Generate Summary
  let summary = '';
  if (findings.length === 0) {
    summary = "We couldn't clearly detect standard parameters (like Sugar, Hemoglobin, or TSH) in this document. Please ensure the scan is clear, or consult your doctor for a manual review.";
    riskLevel = 'Unknown';
  } else if (!hasAbnormal) {
    summary = "Great news! Based on the detected parameters, your results fall within standard normal ranges. Keep up the healthy lifestyle.";
  } else {
    summary = "We detected some values outside the standard reference ranges. " + sentencesForSummary.join(' ') + " Please consult the recommended specialist for a proper clinical diagnosis.";
  }

  return {
    abnormalValues: findings,
    riskLevel,
    recommendedDoctor,
    aiSummary: summary
  };
};
