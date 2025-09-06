import axios from 'axios';

const API_URL = 'http://localhost:5000/api/doctor';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

const getDoctorProfile = async () => {
  const response = await axios.get(`${API_URL}/profile`, getAuthHeaders());
  return response.data;
};

const createOrUpdateProfile = async (profileData) => {
  const token = localStorage.getItem('token');
  const response = await axios.post(`${API_URL}/profile`, profileData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const doctorService = {
  getDoctorProfile,
  createOrUpdateProfile,
};

export default doctorService;
