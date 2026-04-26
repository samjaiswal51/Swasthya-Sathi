import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, Bell, Shield } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const titles = {
  '/admin-dashboard':               'Dashboard Overview',
  '/admin-dashboard/verification':  'Doctor Verification',
  '/admin-dashboard/users':         'User Management',
  '/admin-dashboard/analytics':     'Analytics',
  '/admin-dashboard/complaints':    'Complaints & Reports',
  '/admin-dashboard/settings':      'Settings',
};

const AdminHeader = ({ setSidebarOpen }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const title = titles[location.pathname] || 'Admin Panel';

  return (
    <header className="sticky top-0 z-30 bg-black/80 backdrop-blur-2xl border-b border-white/10 h-20 flex items-center justify-between px-6 sm:px-8 flex-shrink-0 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 text-zinc-400 hover:text-white hover:bg-white/10 rounded-xl transition-colors border border-transparent hover:border-white/10"
        >
          <Menu className="w-5 h-5" />
        </motion.button>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={title}
          className="text-xl sm:text-2xl font-extrabold text-white tracking-tight"
        >
          {title}
        </motion.h1>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        {/* Bell */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative p-2.5 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-all border border-white/5 hover:border-white/20 hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] group"
        >
          <Bell className="w-5 h-5 group-hover:scale-110 transition-transform" />
          <motion.span 
            animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute top-0 right-0 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-black" 
          />
        </motion.button>

        <div className="h-8 w-px bg-white/10 hidden sm:block" />

        {/* Admin badge */}
        <motion.div 
          whileHover={{ y: -2 }}
          className="flex items-center gap-3 px-3.5 py-2 bg-gradient-to-r from-zinc-900 to-black rounded-2xl border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer group hover:border-white/20 hover:shadow-[0_8px_30px_rgba(255,255,255,0.05)] transition-all"
        >
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-900 flex items-center justify-center text-white font-extrabold text-sm border border-white/20 shadow-inner group-hover:from-zinc-500 group-hover:to-zinc-800 transition-colors">
            {user?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-white leading-none tracking-wide">{user?.name || 'Admin'}</p>
            <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest mt-1 flex items-center gap-1">
              <Shield className="w-3 h-3 text-zinc-500" /> Executive
            </p>
          </div>
        </motion.div>
      </div>
    </header>
  );
};

export default AdminHeader;
