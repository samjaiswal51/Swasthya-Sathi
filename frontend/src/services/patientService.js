// frontend/src/services/patientService.js

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const API_URL_PATIENT   = `${API_BASE_URL}/api/patient`;
const API_URL_REMINDERS = `${API_BASE_URL}/api/reminders`;
const API_URL_USER      = `${API_BASE_URL}/api/user`;

const getAuthToken = () => localStorage.getItem('token');

const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.error('Authentication error. Logging out.');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
  }
  const message = error.response?.data?.message || error.message;
  throw new Error(message);
};

// Swasthya Card
export const getSwasthyaCard = async () => {
  try {
    const response = await axios.get(`${API_URL_PATIENT}/profile/swasthya-card`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Profile
export const getProfile = async () => {
  try {
    const response = await axios.get(`${API_URL_PATIENT}/profile`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await axios.post(`${API_URL_PATIENT}/profile`, profileData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Documents
export const getDocuments = async () => {
  try {
    const response = await axios.get(`${API_URL_PATIENT}/documents`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getDocument = async (documentId) => {
  try {
    const response = await axios.get(`${API_URL_PATIENT}/documents/${documentId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const uploadDocument = async (formData) => {
  try {
    const response = await axios.post(`${API_URL_PATIENT}/documents`, formData, {
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

export const deleteDocument = async (documentId) => {
  try {
    const response = await axios.delete(`${API_URL_PATIENT}/documents/${documentId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getDocumentViewUrl = async (documentId) => {
  try {
    const response = await axios.get(
      `${API_URL_PATIENT}/documents/${documentId}/view`,
      {
        headers: getAuthHeaders(),
        maxRedirects: 0,
        validateStatus: (status) => status >= 200 && status < 400,
      }
    );
    return response.request.responseURL;
  } catch (error) {
    handleApiError(error);
  }
};

// Reminders
export const getReminders = async () => {
  try {
    const response = await axios.get(API_URL_REMINDERS, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const createReminder = async (data) => {
  try {
    const response = await axios.post(API_URL_REMINDERS, data, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteReminder = async (id) => {
  try {
    const response = await axios.delete(`${API_URL_REMINDERS}/${id}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

// Save FCM token
export const saveFcmToken = async (token) => {
  try {
    const response = await axios.post(
      `${API_URL_USER}/save-fcm-token`,
      { token },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    handleApiError(error);
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
  saveFcmToken,
};

export default patientService;
