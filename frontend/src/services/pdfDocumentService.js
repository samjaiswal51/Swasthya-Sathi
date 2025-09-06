import axios from 'axios';

const API_URL = 'http://localhost:5000/api/documents';

// --- Helper Functions (consistent with your other services) ---

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error) => {
  // If the token is expired or invalid, the backend sends a 401 Unauthorized error.
  // This will log the user out and redirect them to the login page.
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.error("Authentication error. Logging out.");
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    // Force a reload to clear all state and redirect via App.jsx logic
    window.location.href = '/login'; 
  }
  const message = (error.response?.data?.message) || error.message;
  throw new Error(message);
};

// --- API Service Functions ---

/**
 * @description Uploads a PDF file to the backend.
 * @param {FormData} formData - The form data containing the file to upload.
 * @param {function} onUploadProgress - A callback function to track upload progress.
 * @returns {Promise<object>} The newly created document record from the server.
 */
const uploadDocument = async (formData, onUploadProgress) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress, // Pass the progress callback to axios
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Fetches all summarized documents for the logged-in user.
 * @returns {Promise<Array>} An array of document objects.
 */
const getDocuments = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

/**
 * @description Deletes a document from the server.
 * @param {string} documentId - The ID of the document to delete.
 * @returns {Promise<object>} The success message from the server.
 */
const deleteDocument = async (documentId) => {
  try {
    const response = await axios.delete(`${API_URL}/${documentId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const pdfDocumentService = {
  uploadDocument,
  getDocuments,
  deleteDocument,
};

export default pdfDocumentService;