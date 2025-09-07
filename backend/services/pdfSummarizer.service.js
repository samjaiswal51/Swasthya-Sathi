const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js");
const axios = require("axios");

// Hugging Face API configuration
const HUGGING_FACE_API_URL =
  "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
const HUGGING_FACE_API_KEY = process.env.HUGGING_FACE_API_KEY; // Add this to your .env file

/**
 * Advanced text preprocessing optimized for transformer models
 */
const preprocessText = (text) => {
  // Normalize unicode and clean text
  text = text.normalize("NFKD");

  // Remove PDF artifacts more aggressively
  text = text.replace(/\b(?:page|pg\.?|p\.?)\s*\d+\b/gi, "");
  text = text.replace(/^\d+\s*/gm, "");
  text = text.replace(/\b\d{1,3}\/\d{1,3}\b/g, "");
  text = text.replace(/\b(?:copyright|©|®|™)\b/gi, "");
  text = text.replace(/\b\d{4}-\d{2}-\d{2}\b/g, "");
  text = text.replace(/https?:\/\/[^\s]+/g, "");
  text = text.replace(/[\w\.-]+@[\w\.-]+\.\w+/g, "");

  // Clean special characters but preserve sentence structure
  text = text.replace(/[^\w\s.,!?;:()"-]/g, " ");
  text = text.replace(/\s+/g, " ").trim();

  // Remove very short fragments and clean up
  const sentences = text.split(/[.!?]+/);
  const cleanSentences = sentences
    .filter((sentence) => sentence.trim().length > 15)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.split(" ").length >= 4);

  return cleanSentences.join(". ").trim();
};

/**
 * Split text into manageable chunks for API processing
 */
const splitIntoChunks = (text, maxLength = 1024) => {
  const sentences = text
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  const chunks = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    const testChunk = currentChunk + (currentChunk ? ". " : "") + sentence;

    if (testChunk.length <= maxLength) {
      currentChunk = testChunk;
    } else {
      if (currentChunk) {
        chunks.push(currentChunk + ".");
      }
      currentChunk = sentence;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk + ".");
  }

  return chunks;
};

/**
 * Call Hugging Face API for text summarization
 */
const callHuggingFaceAPI = async (text, retries = 3) => {
  const headers = {
    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
    "Content-Type": "application/json",
  };

  const payload = {
    inputs: text,
    parameters: {
      max_length: Math.min(1000, Math.floor(text.length * 0.5)), // 150 ko 400 kar diya
      min_length: Math.min(600, Math.floor(text.length * 0.2)), // 30 ko 100 kar diya
      do_sample: false,
      early_stopping: true,
      num_beams: 4,
      temperature: 1.0,
      top_k: 50,
      top_p: 1.0,
    },
  };

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Hugging Face API call attempt ${attempt}...`);

      const response = await axios.post(HUGGING_FACE_API_URL, payload, {
        headers,
        timeout: 30000, // 30 second timeout
      });

      if (response.data && response.data[0] && response.data[0].summary_text) {
        return response.data[0].summary_text;
      } else if (
        response.data &&
        response.data[0] &&
        response.data[0].generated_text
      ) {
        return response.data[0].generated_text;
      } else {
        throw new Error("Invalid response format from Hugging Face API");
      }
    } catch (error) {
      console.log(`Attempt ${attempt} failed:`, error.message);

      if (error.response?.status === 503 && attempt < retries) {
        // Model is loading, wait and retry
        const waitTime = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(
          `Model is loading. Waiting ${waitTime / 1000} seconds before retry...`
        );
        await new Promise((resolve) => setTimeout(resolve, waitTime));
        continue;
      }

      if (attempt === retries) {
        throw new Error(
          `Hugging Face API failed after ${retries} attempts: ${error.message}`
        );
      }
    }
  }
};

/**
 * Hybrid approach: Combine extractive and abstractive summarization
 */
const hybridSummarization = async (text) => {
  const chunks = splitIntoChunks(text, 1024);
  console.log(`Processing ${chunks.length} text chunks with Hugging Face...`);

  const chunkSummaries = [];

  for (let i = 0; i < chunks.length; i++) {
    console.log(`Processing chunk ${i + 1}/${chunks.length}...`);

    try {
      const summary = await callHuggingFaceAPI(chunks[i]);
      if (summary && summary.length > 20) {
        chunkSummaries.push(summary);
      }
    } catch (error) {
      console.log(`Failed to summarize chunk ${i + 1}: ${error.message}`);
      // Fallback: use first few sentences of the chunk
      const fallback = chunks[i].split(".").slice(0, 2).join(".") + ".";
      chunkSummaries.push(fallback);
    }
  }

  // If we have multiple chunk summaries, combine and summarize again
  if (chunkSummaries.length > 1) {
    const combinedSummary = chunkSummaries.join(" ");

    if (combinedSummary.length > 1024) {
      try {
        console.log("Creating final consolidated summary...");
        const finalSummary = await callHuggingFaceAPI(combinedSummary);
        return finalSummary || combinedSummary;
      } catch (error) {
        console.log("Final consolidation failed, returning combined summaries");
        return combinedSummary;
      }
    } else {
      return combinedSummary;
    }
  }

  return chunkSummaries[0] || "Unable to generate summary";
};

/**
 * Enhanced summary formatting
 */
const formatSummary = (summary, originalLength, processingTime) => {
  if (!summary || summary.length < 10) {
    return "Unable to generate a meaningful summary from the document content.";
  }

  // Clean up the summary
  let cleanSummary = summary.replace(/\s+/g, " ").trim();

  // Ensure proper sentence endings
  if (!/[.!?]$/.test(cleanSummary)) {
    cleanSummary += ".";
  }

  // Split into sentences and format
  const sentences = cleanSummary
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 10);

  let formattedSummary = "";

  sentences.forEach((sentence, index) => {
    if (sentence) {
      formattedSummary += `${index + 1}. ${sentence}.\n\n`;
    }
  });

  // Add metadata
  const compressionRatio = (
    ((originalLength - cleanSummary.length) / originalLength) *
    100
  ).toFixed(1);

  formattedSummary += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  formattedSummary += `AI SUMMARY REPORT:\n`;
  formattedSummary += `• Generated using Hugging Face BART-Large-CNN model\n`;
  formattedSummary += `• Original text: ${originalLength} characters\n`;
  formattedSummary += `• Summary: ${cleanSummary.length} characters\n`;
  formattedSummary += `• Compression ratio: ${compressionRatio}%\n`;
  formattedSummary += `• Processing time: ${processingTime.toFixed(
    2
  )} seconds\n`;
  formattedSummary += `• Model: Facebook BART (Bidirectional Auto-Regressive Transformers)\n`;
  formattedSummary += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`;

  return formattedSummary.trim();
};

/**
 * Main function using Hugging Face API
 */
const generateSummary = async (pdfBuffer) => {
  const startTime = Date.now();

  try {
    console.log("Starting AI-powered summarization with Hugging Face...");

    // Check API key
    if (!HUGGING_FACE_API_KEY) {
      throw new Error(
        "HUGGING_FACE_API_KEY not found in environment variables. Please add it to your .env file."
      );
    }

    // Phase 1: Extract text from PDF
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdfDocument = await loadingTask.promise;

    let fullText = "";

    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();

      const sortedItems = textContent.items.sort((a, b) => {
        const yDiff = Math.abs(b.transform[5] - a.transform[5]);
        if (yDiff > 2) return b.transform[5] - a.transform[5];
        return a.transform[4] - b.transform[4];
      });

      const pageText = sortedItems
        .map((item) => item.str)
        .join(" ")
        .replace(/\s+/g, " ")
        .trim();

      if (pageText.length > 0) {
        fullText += pageText + " ";
      }
    }

    const originalLength = fullText.length;
    fullText = preprocessText(fullText);

    console.log(
      `Extracted and cleaned ${fullText.length} characters from ${pdfDocument.numPages} pages`
    );

    if (!fullText || fullText.length < 200) {
      return "Document contains insufficient readable text for AI summarization. Please ensure the PDF contains proper text content.";
    }

    // Phase 2: AI-powered summarization
    console.log("Starting AI summarization process...");
    const aiSummary = await hybridSummarization(fullText);

    const processingTime = (Date.now() - startTime) / 1000;
    console.log(
      `AI summarization completed in ${processingTime.toFixed(2)} seconds`
    );

    return formatSummary(aiSummary, originalLength, processingTime);
  } catch (error) {
    const processingTime = (Date.now() - startTime) / 1000;
    console.error("Error in AI summarization:", error);

    if (error.message.includes("HUGGING_FACE_API_KEY")) {
      throw new Error(
        "Hugging Face API key is missing. Please configure your API key in the .env file."
      );
    } else if (error.message.includes("API")) {
      throw new Error(
        "AI summarization service is temporarily unavailable. Please try again later."
      );
    } else if (error.message.includes("Invalid PDF")) {
      throw new Error(
        "The uploaded file appears to be corrupted or is not a valid PDF document."
      );
    } else if (error.message.includes("password")) {
      throw new Error(
        "Password-protected PDFs are not supported. Please upload an unlocked PDF."
      );
    } else {
      throw new Error(`AI summarization failed: ${error.message}`);
    }
  }
};

module.exports = { generateSummary };
