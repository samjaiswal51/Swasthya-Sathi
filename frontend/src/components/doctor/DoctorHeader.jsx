import React, { useContext } from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const DoctorHeader = ({ setSidebarOpen, profile }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [unreadCount, setUnreadCount] = React.useState(0);

  React.useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/notifications', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const count = res.data.filter(n => !n.isRead).length;
        setUnreadCount(count);
      } catch (err) {
        console.error('Failed to fetch notifications', err);
      }
    };
    fetchNotifications();
    // Poll every 30 seconds for new notifications
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/doctor-dashboard') return 'Dashboard Overview';
    if (path.includes('profile')) return 'My Profile';
    if (path.includes('verification')) return 'Verification Status';
    if (path.includes('patients')) return 'My Patients';
    if (path.includes('records')) return 'Patient Medical Records';
    if (path.includes('prescription')) return 'Add Prescription';
    if (path.includes('notes')) return 'Consultation Notes';
    if (path.includes('appointments')) return 'Appointments';
    if (path.includes('schedule')) return 'Availability Schedule';
    if (path.includes('chat')) return 'Chat With Patients';
    if (path.includes('video')) return 'Video Consultation';
    if (path.includes('blogs')) return 'Health Tips & Blogs';
    if (path.includes('resources')) return 'Upload Health Resources';
    if (path.includes('earnings')) return 'Earnings & Revenue';
    if (path.includes('analytics')) return 'Reports & Statistics';
    if (path.includes('notifications')) return 'Notifications';
    if (path.includes('settings')) return 'Account Settings';
    return 'Doctor Portal';
  };

  return (
    <header
      className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0"
      style={{
        background: 'rgba(2,44,34,0.92)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(16,185,129,0.15)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3), 0 1px 0 rgba(16,185,129,0.08)',
      }}
    >
      {/* Left — hamburger + title */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-emerald-400/70
                     hover:text-white hover:bg-emerald-500/15
                     border border-transparent hover:border-emerald-500/25
                     transition-all duration-200"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center">
          <span className="pl-3 leading-tight"
                style={{
                  borderLeft: '3px solid #10B981',
                  filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.4))',
                }}>
            {getPageTitle()}
          </span>
        </h2>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Notification bell */}
        <Link
          to="/doctor-dashboard/notifications"
          className="relative p-2.5 rounded-xl text-emerald-400/70
                     hover:text-white hover:bg-emerald-500/15
                     border border-transparent hover:border-emerald-500/25
                     transition-all duration-200"
          style={{ background: 'rgba(16,185,129,0.05)' }}
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center
                         rounded-full text-[9px] font-extrabold text-white"
              style={{
                background: '#10B981',
                boxShadow: '0 0 8px rgba(16,185,129,0.8)',
                border: '2px solid rgba(2,44,34,0.9)',
              }}
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Link>

        {/* Divider */}
        <div className="w-px h-7 hidden sm:block" style={{ background: 'rgba(16,185,129,0.15)' }} />

        {/* Doctor profile */}
        <button
          className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl border border-transparent
                     hover:bg-emerald-500/10 hover:border-emerald-500/20
                     transition-all duration-200"
        >
          <div
            className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center font-extrabold text-sm text-white flex-shrink-0"
            style={{
              background: 'linear-gradient(135deg, #059669, #10B981)',
              border: '2px solid rgba(16,185,129,0.5)',
              boxShadow: '0 0 12px rgba(16,185,129,0.4)',
            }}
          >
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt="Doctor" className="w-full h-full object-cover" />
            ) : (
              user?.name?.charAt(0).toUpperCase() || 'D'
            )}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-white leading-tight">
              {profile?.fullName || `Dr. ${user?.name || 'Doctor'}`}
            </p>
          </div>
          <ChevronDown className="w-4 h-4 hidden sm:block" style={{ color: 'rgba(52,211,153,0.5)' }} />
        </button>
      </div>
    </header>
  );
};

export default DoctorHeader;
