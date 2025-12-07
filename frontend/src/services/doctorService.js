import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/doctor`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const handleApiError = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    console.error('Authentication error. Redirecting to login.');
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.href = '/login';
    return;
  }

  const message =
    error.response?.data?.message || error.message || 'An unexpected error occurred';
  throw new Error(message);
};

const getDoctorProfile = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const createOrUpdateProfile = async (profileData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(`${API_URL}/profile`, profileData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const getAllDoctors = async (searchTerm = '') => {
  try {
    const config = getAuthHeaders();

    if (searchTerm && searchTerm.trim()) {
      config.params = { search: searchTerm.trim() };
    }

    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};

const doctorService = {
  getDoctorProfile,
  createOrUpdateProfile,
  getAllDoctors,
};

export default doctorService;
