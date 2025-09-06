// frontend/src/services/patientService.js

import axios from 'axios';

// The base URL for patient-specific APIs remains the same for profile/documents
const API_URL_PATIENT = 'http://localhost:5000/api/patient';
// A new base URL for the reminders API
const API_URL_REMINDERS = 'http://localhost:5000/api/reminders';
// --- NEW: API URL for user-specific actions ---
const API_URL_USER = 'http://localhost:5000/api/user';

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

// --- Swasthya Card Function (No changes) ---
const getSwasthyaCard = async () => {
  try {
    const response = await axios.get(`${API_URL_PATIENT}/profile/swasthya-card`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// --- Profile Functions (No changes) ---
const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL_PATIENT}/profile`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const updateProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_URL_PATIENT}/profile`, profileData, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// --- Document Functions (No changes) ---
const getDocuments = async () => {
  try {
    const response = await axios.get(`${API_URL_PATIENT}/documents`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getDocument = async (documentId) => {
    try {
        const response = await axios.get(`${API_URL_PATIENT}/documents/${documentId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const uploadDocument = async (formData) => {
    try {
        const response = await axios.post(`${API_URL_PATIENT}/documents`, formData, {
            headers: {
                ...getAuthHeaders()
            },
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const deleteDocument = async (documentId) => {
    try {
        const response = await axios.delete(`${API_URL_PATIENT}/documents/${documentId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const getDocumentViewUrl = async (documentId) => {
    try {
        const response = await axios.get(`${API_URL_PATIENT}/documents/${documentId}/view`, { 
            headers: getAuthHeaders(),
            maxRedirects: 0,
            validateStatus: (status) => status >= 200 && status < 400,
        });
        
        if (response.status === 302 && response.headers.location) {
            return response.headers.location;
        }
        
        return response.data?.viewUrl || response.data?.fileURL;
    } catch (error) {
        if (error.response?.status === 302) {
            return error.response.headers.location;
        }
        handleApiError(error);
    }
};

// --- Medication Reminder Functions (No changes) ---
const getReminders = async () => {
    try {
        const response = await axios.get(API_URL_REMINDERS, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const createReminder = async (reminderData) => {
    try {
        const response = await axios.post(API_URL_REMINDERS, reminderData, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const deleteReminder = async (reminderId) => {
    try {
        const response = await axios.delete(`${API_URL_REMINDERS}/${reminderId}`, { headers: getAuthHeaders() });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const saveFcmToken = async (token) => {
    try {
        await axios.post(`${API_URL_USER}/save-fcm-token`, { token }, { headers: getAuthHeaders() });
        console.log("FCM token sent to server successfully.");
    } catch (error) {
        console.error("Could not save FCM token to server.", error);
    }
};

const patientService = {
  getSwasthyaCard,
  getProfile,
  updateProfile,
  getDocuments,
  getDocument,
  uploadDocument,
  deleteDocument,
  getDocumentViewUrl,
  getReminders,
  createReminder,
  deleteReminder,
  // --- EXPORT THE NEW FUNCTION ---
  saveFcmToken,
};

export default patientService;