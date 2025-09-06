import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

function FamilyDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">परिवार डैशबोर्ड</h1>
        <p className="text-lg text-gray-800">
          नमस्ते! आपकी भूमिका: <span className="capitalize font-semibold">{user?.role}</span>
        </p>
        <p className="text-gray-600">यहाँ आप अपने परिवार के सदस्य की स्वास्थ्य जानकारी देख सकते हैं।</p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 mt-6 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
        >
          लॉगआउट
        </button>
      </div>
    </div>
  );
}

export default FamilyDashboard;
