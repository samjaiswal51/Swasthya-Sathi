const fs = require('fs');
const pdfParse = require('pdf-parse');
const { TfIdf, SentenceTokenizer } = require('natural');

/**
 * @description Generates a text summary from a PDF file.
 * @param {string} filePath - The path to the PDF file on the server.
 * @returns {Promise<string>} A promise that resolves to the generated summary.
 */
const generateSummary = async (filePath) => {
  try {
    // 1. Read and Parse the PDF file
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);

    if (!pdfData.text || pdfData.text.trim() === '') {
      return 'Could not extract text from the PDF.';
    }

    // 2. Clean and Tokenize the text into sentences
    const cleanedText = pdfData.text.replace(/\s+/g, ' ').trim();
    const tokenizer = new SentenceTokenizer();
    const sentences = tokenizer.tokenize(cleanedText);

    // If the document is too short, return the original text
    if (sentences.length <= 6) {
      return cleanedText;
    }

    // 3. Use TF-IDF to score sentences
    const tfidf = new TfIdf();
    tfidf.addDocument(cleanedText);

    const sentenceScores = [];
    sentences.forEach((sentence, index) => {
      let score = 0;
      // Calculate a score for the sentence by summing the TF-IDF scores of its words
      const words = sentence.split(' ');
      words.forEach(word => {
        score += tfidf.tfidf(word.toLowerCase(), 0);
      });
      sentenceScores.push({ sentence, score, index });
    });

    // 4. Sort sentences by score and pick the top ones
    sentenceScores.sort((a, b) => b.score - a.score);

    // Get the top 5 sentences for the summary
    const topSentences = sentenceScores.slice(0, 5);

    // 5. Re-order the top sentences based on their original appearance for readability
    topSentences.sort((a, b) => a.index - b.index);

    // 6. Combine into the final summary and return
    const summary = topSentences.map(item => item.sentence).join(' ');

    return summary;
  } catch (error) {
    console.error(`Error processing PDF at ${filePath}:`, error);
    throw new Error('Failed to generate summary from the PDF file.');
  }
};

module.exports = {
  generateSummary,
};