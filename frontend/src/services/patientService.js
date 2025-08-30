// frontend/src/services/patientService.js

import axios from 'axios';

const API_URL = 'http://localhost:5000/api/patient'; // Use the full, direct URL

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Authentication error. Logging out.");
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
    }
    const message = (error.response?.data?.message) || error.message;
    throw new Error(message);
};

// --- Profile Functions ---
const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_URL}/profile`, profileData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// --- Document Functions ---
const getDocuments = async () => {
  try {
    const response = await axios.get(`${API_URL}/documents`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getDocument = async (documentId) => {
    try {
        const response = await axios.get(`${API_URL}/documents/${documentId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        throw new Error(err.message || 'An unknown error occurred.');
    }
};

const uploadDocument = async (formData) => {
    try {
        const response = await axios.post(`${API_URL}/documents`, formData, {
            headers: {
                ...getAuthHeaders(),
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const deleteDocument = async (documentId) => {
    try {
        const response = await axios.delete(`${API_URL}/documents/${documentId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

// नया function - document को view करने के लिए secure URL get करना
const getDocumentViewUrl = async (documentId) => {
    try {
        const response = await axios.get(`${API_URL}/documents/${documentId}/view`, { 
            headers: getAuthHeaders(),
            // यह important है कि हम redirect को follow न करें
            maxRedirects: 0,
            validateStatus: function (status) {
                return status >= 200 && status < 400; // 3xx भी accept करें
            }
        });
        
        // अगर redirect response मिला तो location header से URL निकालें
        if (response.status === 302 && response.headers.location) {
            return response.headers.location;
        }
        
        return response.data?.viewUrl || response.data?.fileURL;
    } catch (error) {
        if (error.response?.status === 302) {
            // Redirect response में URL मिल गया
            return error.response.headers.location;
        }
        handleApiError(error);
    }
};

const patientService = {
  // Profile functions
  getProfile,
  updateProfile,
  // Document functions
  getDocuments,
  getDocument,
  uploadDocument,
  deleteDocument,
  getDocumentViewUrl, // नया function add किया
};

export default patientService;