// frontend/src/context/AuthContext.jsx

import React, { createContext, useState, useEffect } from 'react';
import authService from '../services/authService';
import { jwtDecode } from 'jwt-decode'; // JWT टोकन को डिकोड करने के लिए

// AuthContext बनाएँ
export const AuthContext = createContext(null);

// AuthProvider कंपोनेंट जो पूरे ऐप को रैप करेगा
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // कंपोनेंट के लोड होने पर localStorage से टोकन की जाँच करें
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // UPDATED: Decode email from token
        const decodedUser = jwtDecode(token);
        setUser({ id: decodedUser.id, role: decodedUser.role, email: decodedUser.email });
      } catch (error) {
        console.error("Invalid token:", error);
        // अगर टोकन अमान्य है तो उसे हटा दें
        authService.logout();
        setUser(null);
      }
    }
  }, []);

  // लॉगिन फंक्शन
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      // UPDATED: Decode email from token
      const decodedUser = jwtDecode(data.token);
      setUser({ id: decodedUser.id, role: decodedUser.role, email: decodedUser.email });
      return data; // लॉगिन कंपोनेंट को डेटा वापस भेजें
    } catch (error) {
      throw error;
    }
  };

  // रजिस्टर फंक्शन
  const register = async (userData) => {
    try {
      await authService.register(userData);
    } catch (error) {
      throw error;
    }
  };

  // लॉगआउट फंक्शन
  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // कॉन्टेक्स्ट की वैल्यू
  const value = {
    user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};