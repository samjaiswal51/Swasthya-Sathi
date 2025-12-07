import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/documents`;

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

export const uploadDocument = async (formData, onUploadProgress) => {
  try {
    const response = await axios.post(`${API_URL}/upload`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const getDocuments = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

export const deleteDocument = async (documentId) => {
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
