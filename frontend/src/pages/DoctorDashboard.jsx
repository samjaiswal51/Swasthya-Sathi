import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import DoctorProfile from '../components/doctor/DoctorProfile.jsx';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiMessageSquare, 
  FiFileText, 
  FiSettings, 
  FiLogOut,
  FiSearch,
  FiBell,
  FiUser,
  FiMenu,
  FiX
} from 'react-icons/fi';

function DoctorDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <FiHome className="text-lg" /> },
    { id: 'patients', label: 'Patients', icon: <FiUsers className="text-lg" /> },
    { id: 'appointments', label: 'Appointments', icon: <FiCalendar className="text-lg" /> },
    { id: 'messages', label: 'Messages', icon: <FiMessageSquare className="text-lg" /> },
    { id: 'health-blog', label: 'Health Blog', icon: <FiFileText className="text-lg" /> },
    { id: 'profile', label: 'Profile', icon: <FiUser className="text-lg" /> },
  ];

  const statsData = [
    { title: 'Total Patients', value: '1,248', change: '+14% from last month' },
    { title: 'Upcoming Appointments', value: '17', change: 'Next: Today, 3:00 PM' },
    { title: 'Unread Messages', value: '8', change: '3 require attention' },
    { title: 'Monthly Revenue', value: '₹86,500', change: '+8% from last month' },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-[#f8fffa]">
      {/* Sidebar */}
      <div 
        className={`bg-[#004B23] text-white transition-all duration-300 ease-in-out 
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          md:flex flex-col justify-between hidden`}
      >
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between p-4 border-b border-[#006400]">
            {isSidebarOpen && (
              <h1 className="text-xl font-bold">Swasthya Sathi</h1>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-full hover:bg-[#006400] transition-colors"
            >
              {isSidebarOpen ? <FiX /> : <FiMenu />}
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <ul>
              {navItems.map((item) => (
                <li key={item.id} className="px-2 py-1">
                  <button
                    onClick={() => setActiveNav(item.id)}
                    className={`flex items-center w-full p-3 rounded-lg transition-colors
                      ${activeNav === item.id 
                        ? 'bg-[#007200] text-white' 
                        : 'text-[#CCFF33] hover:bg-[#006400] hover:text-white'
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {isSidebarOpen && <span>{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom section */}
        <div className="p-4 border-t border-[#006400]">
          <button className="flex items-center w-full p-3 rounded-lg text-[#CCFF33] hover:bg-[#006400] hover:text-white transition-colors">
            <FiSettings className="text-lg mr-3" />
            {isSidebarOpen && <span>Settings</span>}
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-[#CCFF33] hover:bg-[#006400] hover:text-white transition-colors"
          >
            <FiLogOut className="text-lg mr-3" />
            {isSidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMobileMenu}></div>
      )}

      {/* Mobile sidebar */}
      <div className={`fixed top-0 left-0 h-full w-64 bg-[#004B23] text-white transform transition-transform duration-300 z-50 md:hidden
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between p-4 border-b border-[#006400]">
          <h1 className="text-xl font-bold">Swasthya Sathi</h1>
          <button onClick={toggleMobileMenu} className="p-1 rounded-full hover:bg-[#006400]">
            <FiX />
          </button>
        </div>
        
        <nav className="mt-6">
          <ul>
            {navItems.map((item) => (
              <li key={item.id} className="px-2 py-1">
                <button
                  onClick={() => {
                    setActiveNav(item.id);
                    toggleMobileMenu();
                  }}
                  className={`flex items-center w-full p-3 rounded-lg transition-colors
                    ${activeNav === item.id 
                      ? 'bg-[#007200] text-white' 
                      : 'text-[#CCFF33] hover:bg-[#006400] hover:text-white'
                    }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="absolute bottom-0 w-full p-4 border-t border-[#006400]">
          <button className="flex items-center w-full p-3 rounded-lg text-[#CCFF33] hover:bg-[#006400] hover:text-white transition-colors">
            <FiSettings className="text-lg mr-3" />
            <span>Settings</span>
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center w-full p-3 rounded-lg text-[#CCFF33] hover:bg-[#006400] hover:text-white transition-colors"
          >
            <FiLogOut className="text-lg mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile bottom navbar */}
      <div className="fixed bottom-0 left-0 right-0 bg-[#004B23] text-white flex justify-around items-center p-2 md:hidden z-10">
        <button 
          onClick={toggleMobileMenu}
          className="p-3 rounded-lg text-[#CCFF33] flex flex-col items-center"
        >
          <FiMenu />
          <span className="text-xs mt-1">Menu</span>
        </button>
        {navItems.slice(0, 3).map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`p-3 rounded-lg transition-colors flex flex-col items-center
              ${activeNav === item.id 
                ? 'bg-[#007200] text-white' 
                : 'text-[#CCFF33]'
              }`}
          >
            {item.icon}
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
        <button 
          onClick={() => setActiveNav('profile')}
          className={`p-3 rounded-lg transition-colors flex flex-col items-center
            ${activeNav === 'profile' 
              ? 'bg-[#007200] text-white' 
              : 'text-[#CCFF33]'
            }`}
        >
          <FiUser />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0 ml-0">

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          {activeNav === 'profile' ? (
            <DoctorProfile />
          ) : (
            <>
              {/* Stats cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {statsData.map((stat, index) => (
                  <div key={index} className="bg-white rounded-xl shadow-sm p-4 border border-[#CCFF33]">
                    <h3 className="text-sm font-medium text-[#007200] mb-1">{stat.title}</h3>
                    <p className="text-2xl font-bold text-[#004B23] mb-1">{stat.value}</p>
                    <p className="text-xs text-[#38B000]">{stat.change}</p>
                  </div>
                ))}
              </div>

              {/* Main panel */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-[#CCFF33]">
                <h2 className="text-xl font-semibold text-[#004B23] mb-4">Patient Overview</h2>
                <p className="text-[#007200]">Patient data and charts will be displayed here. This area will contain detailed information about your patients, their health metrics, appointment history, and treatment plans.</p>
                <div className="mt-6 p-12 border-2 border-dashed border-[#9EF01A] rounded-lg text-center text-[#38B000] bg-[#f8fffa]">
                  Visualization components and patient data tables will be integrated here in future updates.
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default DoctorDashboard;