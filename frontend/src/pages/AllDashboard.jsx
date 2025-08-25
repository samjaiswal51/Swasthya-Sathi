import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

// एक सामान्य डैशबोर्ड लेआउट कंपोनेंट
const DashboardLayout = ({ title, children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8 text-center space-y-6">
        <h1 className="text-3xl font-bold text-blue-600">{title}</h1>
        <p className="text-lg text-gray-800">
          नमस्ते! आपकी भूमिका: <span className="capitalize font-semibold">{user?.role}</span>
        </p>
        <div className="mt-4">{children}</div>
        <button
          onClick={handleLogout}
          className="px-6 py-2 mt-6 font-bold text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
        >
          लॉगआउट
        </button>
      </div>
    </div>
  );
};

// PatientDashboard.jsx
export const PatientDashboard = () => (
  <DashboardLayout title="मरीज डैशबोर्ड">
    <p className="text-gray-600">यहाँ आप अपनी स्वास्थ्य जानकारी देख सकते हैं।</p>
  </DashboardLayout>
);

// DoctorDashboard.jsx
export const DoctorDashboard = () => (
  <DashboardLayout title="डॉक्टर डैशबोर्ड">
    <p className="text-gray-600">यहाँ आप अपने मरीजों का प्रबंधन कर सकते हैं।</p>
  </DashboardLayout>
);

// AdminDashboard.jsx
export const AdminDashboard = () => (
  <DashboardLayout title="एडमिन डैशबोर्ड">
    <p className="text-gray-600">यहाँ आप सिस्टम का प्रबंधन कर सकते हैं।</p>
  </DashboardLayout>
);

// FamilyDashboard.jsx
export const FamilyDashboard = () => (
  <DashboardLayout title="परिवार डैशबोर्ड">
    <p className="text-gray-600">यहाँ आप अपने परिवार के सदस्य की स्वास्थ्य जानकारी देख सकते हैं।</p>
  </DashboardLayout>
);

// अलग-अलग फाइलों के लिए डिफ़ॉल्ट एक्सपोर्ट
// PatientDashboard.jsx
// import { PatientDashboard as Dashboard } from './AllDashboards'; export default Dashboard;
// DoctorDashboard.jsx
// import { DoctorDashboard as Dashboard } from './AllDashboards'; export default Dashboard;
// AdminDashboard.jsx
// import { AdminDashboard as Dashboard } from './AllDashboards'; export default Dashboard;
// FamilyDashboard.jsx
// import { FamilyDashboard as Dashboard } from './AllDashboards'; export default Dashboard;
