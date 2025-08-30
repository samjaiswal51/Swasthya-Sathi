import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Profile from '../components/patient/Profile';
import MedicalDocuments from '../components/patient/MedicalDocuments';

// NEW ADDITION START HERE
import PdfSummarizer from '../components/patient/PdfSummarizer'; // Import the new component
// NEW ADDITION END HERE

function PatientDashboard() {
  const { logout } = useAuth();
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
          <button
            onClick={handleLogout}
            className="px-4 py-2 font-semibold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="py-8">
        <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
          <div className="space-y-8">
            {/* Component 1: Profile Management */}
            <Profile />

            {/* Component 2: Medical Document Management (Cloudinary) */}
            <MedicalDocuments />

            {/* NEW ADDITION START HERE */}
            {/* Component 3: PDF Summarizer */}
            <PdfSummarizer />
            {/* NEW ADDITION END HERE */}
          </div>
        </div>
      </main>
    </div>
  );
}

export default PatientDashboard;