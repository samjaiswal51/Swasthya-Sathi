import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/auth`;

const register = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error) {
    // Agar server se response aata hai toh uska data, nahi toh ek general error message bhejein
    throw error.response ? error.response.data : new Error('Network error or server is down');
  }
};

const login = async (credentials) => {
  try {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
    }
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error or server is down');
  }
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('role');
};

const authService = {
  register,
  login,
  logout,
};

export default authService;
