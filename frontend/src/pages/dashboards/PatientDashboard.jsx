import React, { useState, useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from '../../components/dashboard/Sidebar';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import { AuthContext } from '../../context/AuthContext';

const PatientDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user } = useContext(AuthContext);

  if (user?.isSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0F1115] p-6 font-sans">
        <div className="max-w-md w-full bg-[rgba(255,255,255,0.03)] backdrop-blur-xl rounded-3xl shadow-2xl p-8 text-center border border-red-500/20">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Account Suspended</h2>
          <p className="text-[#9CA3AF] mb-8 leading-relaxed">
            Your account has been temporarily suspended by the administration. You cannot access the patient dashboard or perform any actions at this time. Please contact support.
          </p>
          <button 
            onClick={() => {
              localStorage.removeItem('token');
              window.location.href = '/login';
            }}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3.5 px-4 rounded-xl transition-colors shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#060d1a] min-h-screen flex font-sans relative">
      {/* Subtle Radial Gradient Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-0" 
        style={{ 
          background: 'radial-gradient(ellipse at 20% 50%, rgba(59,130,246,0.04) 0%, transparent 60%)' 
        }}
      />

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px] bg-[#0b1526] transition-all duration-300 relative z-10">
        <DashboardHeader setSidebarOpen={setIsSidebarOpen} />
        
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PatientDashboard;
