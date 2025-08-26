// frontend/src/pages/PatientDashboard.jsx

import React from 'react';
import { useAuth } from '/src/hooks/useAuth.js';
import { useNavigate } from 'react-router-dom';
import Profile from '/src/components/patient/Profile';

function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Dashboard Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">
            Patient Dashboard
          </h1>
          <div className="flex items-center">
            <span className="text-gray-600 mr-4">
              Welcome!
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-8">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
          {/* The Profile component now handles everything internally! */}
          <Profile />
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;