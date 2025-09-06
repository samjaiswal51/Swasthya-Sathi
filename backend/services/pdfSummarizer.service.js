const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

const generateSummary = async (pdfBuffer) => {
  try {
    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer });
    const pdfDocument = await loadingTask.promise;
    
    let fullText = '';
    
    // Extract text from each page
    for (let i = 1; i <= pdfDocument.numPages; i++) {
      const page = await pdfDocument.getPage(i);
      const textContent = await page.getTextContent();
      
      // Process text items to preserve layout and formatting
      let lastY = null;
      let lastX = null;
      let text = '';
      
      // Sort text items by Y position (top to bottom) and then by X position (left to right)
      const sortedItems = textContent.items.sort((a, b) => {
        const yDiff = Math.abs(b.transform[5] - a.transform[5]);
        if (yDiff > 5) {
          return b.transform[5] - a.transform[5]; // Sort by Y position (top to bottom)
        }
        return a.transform[4] - b.transform[4]; // Sort by X position (left to right)
      });
      
      for (const item of sortedItems) {
        const currentY = item.transform[5];
        const currentX = item.transform[4];
        
        // Add newline when Y position changes significantly (new line)
        if (lastY !== null && Math.abs(lastY - currentY) > 5) {
          text += '\n';
          lastX = null; // Reset X position for new line
        }
        // Add space when X position has a significant gap (new section/column)
        else if (lastX !== null && currentX - lastX > 50) {
          text += ' ';
        }
        
        // Clean up the text and add it
        const cleanedText = item.str.trim();
        if (cleanedText) {
          text += cleanedText;
          
          // Add space after text if it doesn't end with punctuation or special characters
          if (!/[.,;:!?\-\s]$/.test(cleanedText)) {
            text += ' ';
          }
        }
        
        lastY = currentY;
        lastX = currentX + (item.width || 0);
      }
      
      // Clean up page text and add page separator
      text = text
        .replace(/\s+/g, ' ') // Replace multiple spaces with single space
        .replace(/\n\s+/g, '\n') // Remove spaces after newlines
        .trim();
      
      fullText += text + '\n\n'; // Add page separator
    }
    
    // Final cleanup
    fullText = fullText
      .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
      .trim();
    
    return fullText;

  } catch (error) {
    console.error(`Error processing PDF buffer:`, error);
    throw new Error('Failed to extract text from the PDF file buffer.');
  }
};

module.exports = { generateSummary };