// frontend/src/services/patientService.js

import axios from 'axios';

// The base URL for your backend API
const API_URL = 'http://localhost:5000/api/patient';

// A helper function to get the auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

/**
 * Fetches the logged-in patient's profile from the backend.
 * @returns {Promise<object>} - A promise that resolves to the patient's profile data.
 */
const getProfile = async () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No token found, please log in.');
  }

  try {
    const response = await axios.get(`${API_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    // Extract a more specific error message from the backend if available
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

/**
 * Updates or creates the patient's profile.
 * @param {object} profileData - The data for the profile to be updated.
 * @returns {Promise<object>} - A promise that resolves to the updated profile data.
 */
const updateProfile = async (profileData) => {
  const token = getAuthToken();
  if (!token) {
    throw new Error('No token found, please log in.');
  }

  try {
    const response = await axios.post(`${API_URL}/profile`, profileData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    throw new Error(message);
  }
};

const patientService = {
  getProfile,
  updateProfile,
};

export default patientService;