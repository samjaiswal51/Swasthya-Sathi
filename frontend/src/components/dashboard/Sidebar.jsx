import React, { useContext } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  User, 
  CreditCard, 
  FileText, 
  BrainCircuit, 
  Bell, 
  Search, 
  MessageSquare, 
  Calendar, 
  Users, 
  Settings, 
  LogOut,
  X,
  HeartPulse,
  BookOpen,
  ShieldCheck,
  UserCheck,
  Rss
} from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { section: 'DASHBOARD', items: [
      { name: 'Overview', path: '/patient-dashboard', icon: LayoutDashboard, exact: true }
    ]},
    { section: 'PROFILE', items: [
      { name: 'My Profile', path: '/patient-dashboard/profile', icon: User },
      { name: 'Swasthya Card', path: '/patient-dashboard/swasthya-card', icon: CreditCard }
    ]},
    { section: 'MEDICAL', items: [
      { name: 'Medical Records', path: '/patient-dashboard/records', icon: FileText },
      { name: 'Record Updates', path: '/patient-dashboard/medical-updates', icon: ShieldCheck },
      { name: 'AI Report Analyzer', path: '/patient-dashboard/analyzer', icon: BrainCircuit },
      { name: 'Medication Reminders', path: '/patient-dashboard/reminders', icon: Bell }
    ]},
    { section: 'CONSULTATION', items: [
      { name: 'My Doctors', path: '/patient-dashboard/my-doctors', icon: UserCheck },
      { name: 'Find Doctor', path: '/patient-dashboard/find-doctor', icon: Search },
      { name: 'Chat with Doctor', path: '/patient-dashboard/chat', icon: MessageSquare },
      { name: 'Appointments', path: '/patient-dashboard/appointments', icon: Calendar }
    ]},
    { section: 'FAMILY', items: [
      { name: 'Family Access', path: '/patient-dashboard/family', icon: Users }
    ]},
    { section: 'WELLNESS', items: [
      { name: 'Wellness Hub', path: '/patient-dashboard/wellness-hub', icon: HeartPulse }
    ]},
    { section: 'BILLING', items: [
      { name: 'Payment History', path: '/patient-dashboard/payments', icon: CreditCard }
    ]},
    { section: 'SETTINGS', items: [
      { name: 'Notifications', path: '/patient-dashboard/notifications', icon: Bell },
      { name: 'Account Settings', path: '/patient-dashboard/settings', icon: Settings }
    ]}
  ];

  const checkIsActive = (path, exact) => {
    if (exact) {
      return location.pathname === path || location.pathname === path + '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      <motion.aside 
        variants={{ open: { x: 0 }, closed: { x: '-100%' } }}
        animate={isOpen ? 'open' : 'closed'}
        initial="closed"
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-screen w-[280px] bg-gradient-to-b from-[#0a1628] via-[#0d1f3c] to-[#0a1628] shadow-[4px_0_32px_rgba(0,0,0,0.4),inset_-1px_0_0_rgba(59,130,246,0.1)] border-r border-[rgba(59,130,246,0.15)] flex flex-col z-50 lg:!transform-none"
      >
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse pointer-events-none z-0" />
        
        <div className="p-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2.5 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] ring-1 ring-blue-400/30">
                <HeartPulse className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-white tracking-tight leading-tight">Swasthya Sathi</h1>
                <p className="text-blue-400 text-[10px] font-semibold tracking-[0.2em] uppercase">Patient Portal</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="p-2 lg:hidden text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}
            className="mt-6 p-3.5 rounded-2xl bg-[rgba(255,255,255,0.04)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.08)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center space-x-3"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-700 flex items-center justify-center text-white font-bold text-lg ring-2 ring-blue-500/40 shadow-[0_0_12px_rgba(59,130,246,0.4)]">
                {user?.name?.charAt(0).toUpperCase() || 'P'}
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] border-2 border-[#0d1f3c] rounded-full"></div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name || 'Patient User'}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email || 'patient@example.com'}</p>
            </div>
          </motion.div>
        </div>

        <div className="flex-1 overflow-y-auto py-2 px-4 scrollbar-thin scrollbar-thumb-blue-900/50 relative z-10">
          <div className="space-y-6 pb-6">
            {navItems.map((section, sectionIndex) => (
              <motion.div 
                key={sectionIndex}
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                transition={{ delay: sectionIndex * 0.08 }}
              >
                {sectionIndex > 0 && <div className="border-t border-white/5 mb-3 mt-1 mx-3" />}
                <h3 className="px-3 mb-2 text-[10px] font-bold text-blue-500/60 uppercase tracking-[0.18em]">
                  {section.section}
                </h3>
                <motion.ul className="space-y-1">
                  {section.items.map((item, itemIdx) => {
                    const isActive = checkIsActive(item.path, item.exact);
                    return (
                      <motion.li 
                        key={itemIdx}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (sectionIndex * 0.1) + (itemIdx * 0.05), duration: 0.3, ease: 'easeOut' }}
                      >
                        <NavLink
                          to={item.path}
                          end={item.exact}
                          onClick={() => setIsOpen(false)}
                          className={`relative flex items-center space-x-3 px-4 py-3 rounded-xl border font-medium transition-all duration-300 group ${
                            isActive 
                              ? 'bg-gradient-to-br from-blue-500/25 to-blue-600/15 border-blue-500/35 text-white shadow-[0_4px_15px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.06)] font-semibold' 
                              : 'border-transparent text-slate-400 hover:bg-[rgba(255,255,255,0.04)] hover:border-[rgba(255,255,255,0.06)] hover:text-slate-200 hover:translate-x-[3px]'
                          }`}
                        >
                          {isActive && (
                            <motion.div 
                              layoutId="activeBar" 
                              className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-400 rounded-r-full" 
                              transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                          )}
                          <item.icon className={`w-5 h-5 transition-colors duration-200 ${
                            isActive 
                              ? 'text-blue-400 drop-shadow-[0_0_6px_#3b82f6]' 
                              : 'text-slate-500 group-hover:text-blue-300'
                          }`} />
                          <span>{item.name}</span>
                        </NavLink>
                      </motion.li>
                    );
                  })}
                </motion.ul>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-white/5 relative z-10">
          <button 
            onClick={handleLogout}
            className="group flex items-center w-full space-x-3 px-4 py-3 rounded-xl text-red-400 bg-transparent hover:bg-red-500/10 hover:border hover:border-red-500/20 hover:text-red-300 transition-all duration-200 hover:shadow-[0_0_12px_rgba(239,68,68,0.15)] font-medium border border-transparent"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-12 transition-transform duration-200" />
            <span>Logout Account</span>
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
