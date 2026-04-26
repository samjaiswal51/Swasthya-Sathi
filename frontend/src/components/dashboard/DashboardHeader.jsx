import React, { useContext } from 'react';
import { Menu, Bell, ChevronDown } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';

const DashboardHeader = ({ setSidebarOpen }) => {
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
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/patient-dashboard') return 'Dashboard Overview';
    if (path.includes('profile')) return 'My Profile';
    if (path.includes('swasthya-card')) return 'Swasthya Card';
    if (path.includes('records')) return 'Medical Records';
    if (path.includes('analyzer')) return 'AI Report Analyzer';
    if (path.includes('reminders')) return 'Medication Reminders';
    if (path.includes('find-doctor')) return 'Find a Doctor';
    if (path.includes('chat')) return 'Consultations';
    if (path.includes('appointments')) return 'Appointments';
    if (path.includes('family')) return 'Family Access';
    if (path.includes('notifications')) return 'Notifications';
    if (path.includes('settings')) return 'Account Settings';
    return 'Patient Portal';
  };

  return (
    <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8
                       bg-[rgba(10,22,40,0.88)] backdrop-blur-xl
                       border-b border-blue-500/10
                       shadow-[0_4px_24px_rgba(0,0,0,0.3),0_1px_0_rgba(37,99,235,0.08)]">

      {/* Left — hamburger + title */}
      <div className="flex items-center gap-3">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2 rounded-xl text-slate-400
                     bg-white/[0.04] border border-white/8
                     hover:bg-blue-500/10 hover:border-blue-500/25 hover:text-blue-400
                     transition-all duration-200"
        >
          <Menu className="w-5 h-5" />
        </motion.button>

        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center">
          <span className="border-l-[3px] border-blue-500 pl-3 leading-tight
                           drop-shadow-[0_0_8px_rgba(37,99,235,0.4)]">
            {getPageTitle()}
          </span>
        </h2>
      </div>

      {/* Right — actions */}
      <div className="flex items-center gap-2 sm:gap-3">

        {/* Bell */}
        <Link
          to="/patient-dashboard/notifications"
          className="relative p-2.5 rounded-xl text-slate-400
                     bg-white/[0.04] border border-white/8
                     hover:bg-blue-500/10 hover:border-blue-500/25 hover:text-blue-400
                     hover:shadow-[0_0_14px_rgba(37,99,235,0.2)]
                     transition-all duration-200"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <motion.span
              animate={{ scale: [1, 1.25, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center
                         bg-blue-600 rounded-full text-[9px] font-extrabold text-white
                         ring-2 ring-[#0A1628] shadow-[0_0_8px_rgba(37,99,235,0.8)]"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </motion.span>
          )}
        </Link>

        {/* Divider */}
        <div className="w-px h-7 bg-white/8 hidden sm:block" />

        {/* Profile */}
        <button className="flex items-center gap-2.5 px-2 py-1.5 rounded-xl
                           hover:bg-blue-500/8 hover:border-blue-500/20 border border-transparent
                           transition-all duration-200">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700
                          flex items-center justify-center text-white font-extrabold text-sm
                          ring-2 ring-blue-500/30 shadow-[0_0_12px_rgba(37,99,235,0.4)]">
            {user?.name?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="hidden sm:block text-left">
            <p className="text-sm font-bold text-slate-200 leading-tight">{user?.name || 'User'}</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-500 hidden sm:block" />
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;
