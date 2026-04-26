import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, ShieldCheck, Users, BarChart2,
  AlertCircle, Settings, LogOut, HeartPulse, X, CreditCard
} from 'lucide-react';

const navItems = [
  { name: 'Overview',           path: '/admin-dashboard',             icon: LayoutDashboard, exact: true },
  { name: 'Doctor Verification',path: '/admin-dashboard/verification', icon: ShieldCheck },
  { name: 'User Management',    path: '/admin-dashboard/users',        icon: Users },
  { name: 'Analytics',          path: '/admin-dashboard/analytics',    icon: BarChart2 },
  { name: 'Payments',           path: '/admin-dashboard/payments',     icon: CreditCard },
  { name: 'Complaints',         path: '/admin-dashboard/complaints',   icon: AlertCircle },
  { name: 'Settings',           path: '/admin-dashboard/settings',     icon: Settings },
];

const AdminSidebar = ({ isOpen, setIsOpen }) => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const active = 'relative flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-gradient-to-r from-zinc-800 to-zinc-900 text-white font-extrabold shadow-[0_4px_20px_rgba(0,0,0,0.5)] border border-white/10 group overflow-hidden transition-all duration-300';
  const inactive = 'relative flex items-center gap-3 px-4 py-3.5 rounded-2xl text-zinc-400 hover:text-white hover:bg-white/5 hover:border-white/10 border border-transparent font-medium hover:shadow-[0_4px_15px_rgba(255,255,255,0.03)] transition-all duration-300 group';

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] bg-[#0A0A0A]/95 backdrop-blur-2xl flex flex-col z-50 border-r border-white/10 shadow-[20px_0_60px_rgba(0,0,0,0.8)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="px-8 py-8 border-b border-white/5 flex items-center justify-between flex-shrink-0 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <div className="bg-gradient-to-b from-zinc-700 to-zinc-900 p-2.5 rounded-xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-extrabold text-lg tracking-tight leading-none">Swasthya Sathi</p>
              <p className="text-zinc-500 text-[9px] font-black uppercase tracking-[0.3em] mt-1.5">Admin Portal</p>
            </div>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden text-zinc-500 hover:text-white bg-white/5 p-2 rounded-lg border border-white/10">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-5 py-8 space-y-2 overflow-y-auto hide-scrollbar">
          {navItems.map((item, index) => (
            <motion.div
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <NavLink
                to={item.path}
                end={item.exact}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => isActive ? active : inactive}
              >
                {({ isActive }) => (
                  <>
                    {/* Active Left Bar */}
                    {isActive && (
                      <motion.div layoutId="activeNav" className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    )}
                    <item.icon className={`w-5 h-5 flex-shrink-0 transition-colors ${isActive ? 'text-white' : 'text-zinc-500 group-hover:text-zinc-300'}`} />
                    <span className="text-sm tracking-wide">{item.name}</span>
                  </>
                )}
              </NavLink>
            </motion.div>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-5 border-t border-white/5 flex-shrink-0 bg-gradient-to-t from-black to-transparent">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3.5 w-full rounded-2xl text-rose-500/80 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20 border border-transparent transition-all font-bold group"
          >
            <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm tracking-wide">Logout Session</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
