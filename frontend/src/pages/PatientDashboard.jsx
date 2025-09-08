import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiUser, FiFileText, FiBookOpen, FiLogOut,
  FiSettings, FiHelpCircle, FiCreditCard, FiBell, FiSearch // <-- नया आइकन इम्पोर्ट करें
} from 'react-icons/fi';

import Profile from '../components/patient/Profile';
import MedicalDocuments from '../components/patient/MedicalDocuments';
import PdfSummarizer from '../components/patient/PdfSummarizer';
import SwasthyaCard from '../components/patient/SwasthyaCard';
import MedicationReminders from '../components/patient/MedicationReminders';
import FindDoctor from '../components/patient/FindDoctor'; // <-- नया कंपोनेंट इम्पोर्ट करें

function PatientDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('profile');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const renderActiveView = () => {
    switch (activeView) {
      case 'profile':
        return <Profile />;
      case 'documents':
        return <MedicalDocuments />;
      case 'summarizer':
        return <PdfSummarizer />;
      case 'swasthyaCard':
        return <SwasthyaCard />;
      case 'reminders':
        return <MedicationReminders />;
      case 'findDoctor': // <-- नया केस जोड़ें
        return <FindDoctor />;
      default:
        return <Profile />;
    }
  };

  const navItems = [
    { id: 'profile', label: 'Profile', icon: FiUser },
    { id: 'swasthyaCard', label: 'Swasthya Card', icon: FiCreditCard },
    { id: 'documents', label: 'Medical Documents', icon: FiFileText },
    { id: 'findDoctor', label: 'Find a Doctor', icon: FiSearch }, // <-- नया नेविगेशन आइटम जोड़ें
    { id: 'reminders', label: 'Reminders', icon: FiBell },
    { id: 'summarizer', label: 'PDF Summarizer', icon: FiBookOpen },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#03045E] to-[#023E8A] flex">
      {/* Sidebar Navigation */}
      <motion.div
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-[#0077B6]/20 backdrop-blur-md border-r border-[#48CAE4]/10 p-6 flex flex-col"
      >
        {/* User Profile Header */}
        <div className="flex items-center mb-8">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0096C7] to-[#0077B6] flex items-center justify-center mr-3">
            <FiUser className="text-[#CAF0F8] text-xl" />
          </div>
          <div>
            <h2 className="text-[#CAF0F8] font-semibold">{user?.name || user?.email?.split('@')[0]}</h2>
            <p className="text-[#90E0EF] text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center px-4 py-3 rounded-lg transition-all duration-300 ${
                    activeView === item.id
                      ? 'bg-[#0077B6]/30 text-[#CAF0F8] shadow-inner'
                      : 'text-[#90E0EF] hover:bg-[#0077B6]/30 hover:text-[#CAF0F8]'
                  }`}
                >
                  <item.icon className="mr-3" />
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Additional Links */}
        <div className="mt-4 pt-4 border-t border-[#48CAE4]/10">
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-[#90E0EF] hover:bg-[#0077B6]/30 hover:text-[#CAF0F8] transition-all duration-300 mb-2">
            <FiSettings className="mr-3" />
            <span>Settings</span>
          </button>
          <button className="w-full flex items-center px-4 py-3 rounded-lg text-[#90E0EF] hover:bg-[#0077B6]/30 hover:text-[#CAF0F8] transition-all duration-300">
            <FiHelpCircle className="mr-3" />
            <span>Help & Support</span>
          </button>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="mt-6 flex items-center px-4 py-3 rounded-lg text-[#90E0EF] hover:bg-red-500/20 hover:text-red-300 transition-all duration-300"
        >
          <FiLogOut className="mr-3" />
          <span>Logout</span>
        </button>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {renderActiveView()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PatientDashboard;