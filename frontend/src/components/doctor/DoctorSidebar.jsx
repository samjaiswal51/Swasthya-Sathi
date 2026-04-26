import React, { useContext } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, User, ShieldCheck, Users, Calendar, Clock4,
  MessageSquare, BookOpen, BarChart2, TrendingUp, Bell, Settings,
  LogOut, X, HeartPulse,
} from 'lucide-react';

const DoctorSidebar = ({ isOpen, setIsOpen, doctorProfile }) => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      section: 'DASHBOARD',
      items: [
        { name: 'Overview', path: '/doctor-dashboard', icon: LayoutDashboard, exact: true },
      ],
    },
    {
      section: 'PROFILE',
      items: [
        { name: 'My Profile', path: '/doctor-dashboard/profile', icon: User },
        { name: 'Verification Status', path: '/doctor-dashboard/verification', icon: ShieldCheck },
      ],
    },
    {
      section: 'PATIENT MANAGEMENT',
      items: [
        { name: 'My Patients', path: '/doctor-dashboard/patients', icon: Users },
      ],
    },
    {
      section: 'CONSULTATION',
      items: [
        { name: 'Appointments', path: '/doctor-dashboard/appointments', icon: Calendar },
        { name: 'Availability Schedule', path: '/doctor-dashboard/schedule', icon: Clock4 },
        { name: 'Chat With Patients', path: '/doctor-dashboard/chat', icon: MessageSquare },
      ],
    },
    {
      section: 'CONTENT',
      items: [
        { name: 'Health Tips / Blogs', path: '/doctor-dashboard/blogs', icon: BookOpen },
      ],
    },
    {
      section: 'ANALYTICS',
      items: [
        { name: 'Earnings / Revenue', path: '/doctor-dashboard/earnings', icon: TrendingUp },
        { name: 'Reports / Statistics', path: '/doctor-dashboard/analytics', icon: BarChart2 },
      ],
    },
    {
      section: 'SETTINGS',
      items: [
        { name: 'Notifications', path: '/doctor-dashboard/notifications', icon: Bell },
        { name: 'Account Settings', path: '/doctor-dashboard/settings', icon: Settings },
      ],
    },
  ];

  const verificationStatus = doctorProfile?.verificationStatus || 'pending';
  const badgeConfig = {
    approved: { label: 'Verified',  cls: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' },
    pending:  { label: 'Pending',   cls: 'bg-amber-500/20  text-amber-300  border border-amber-500/30'  },
    rejected: { label: 'Rejected',  cls: 'bg-rose-500/20   text-rose-300   border border-rose-500/30'   },
  };
  const badge = badgeConfig[verificationStatus] || badgeConfig.pending;

  return (
    <>
      {/* Mobile overlay */}
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

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-[280px] flex flex-col z-50
                    transition-transform duration-300 ease-in-out lg:translate-x-0
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{
          background: 'linear-gradient(180deg, #022C22 0%, #052E16 40%, #064E3B 100%)',
          borderRight: '1px solid rgba(16,185,129,0.15)',
          boxShadow: '4px 0 40px rgba(0,0,0,0.4), 1px 0 0 rgba(16,185,129,0.08)',
        }}
      >
        {/* ── Brand Header ── */}
        <div className="flex-shrink-0 px-5 pt-6 pb-5"
             style={{ borderBottom: '1px solid rgba(16,185,129,0.1)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div
                animate={{ boxShadow: ['0 0 10px rgba(16,185,129,0.4)', '0 0 22px rgba(16,185,129,0.7)', '0 0 10px rgba(16,185,129,0.4)'] }}
                transition={{ repeat: Infinity, duration: 2.5 }}
                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              >
                <HeartPulse className="w-5 h-5 text-white" />
              </motion.div>
              <div>
                <h1 className="text-base font-extrabold text-white leading-tight tracking-tight">Swasthya Sathi</h1>
                <p className="text-[10px] font-bold tracking-widest uppercase mt-0.5" style={{ color: '#34D399' }}>
                  Doctor Portal
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-emerald-400/60 hover:text-white hover:bg-white/8 transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Doctor profile mini-card */}
          <div className="mt-5 p-3.5 rounded-2xl flex items-center gap-3"
               style={{
                 background: 'rgba(16,185,129,0.08)',
                 border: '1px solid rgba(16,185,129,0.15)',
               }}>
            <div className="relative flex-shrink-0">
              {doctorProfile?.profilePhoto ? (
                <img src={doctorProfile.profilePhoto} alt="Doctor"
                  className="w-10 h-10 rounded-full object-cover"
                  style={{ border: '2px solid rgba(16,185,129,0.5)', boxShadow: '0 0 12px rgba(16,185,129,0.35)' }} />
              ) : (
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-base"
                     style={{
                       background: 'linear-gradient(135deg, #059669, #10B981)',
                       border: '2px solid rgba(16,185,129,0.5)',
                       boxShadow: '0 0 12px rgba(16,185,129,0.35)',
                       color: '#fff',
                     }}>
                  {user?.name?.charAt(0).toUpperCase() || 'D'}
                </div>
              )}
              {/* Online dot */}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400
                               border-2 border-[#022C22] shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-extrabold text-white truncate leading-tight">
                {doctorProfile?.fullName || `Dr. ${user?.name || 'Doctor'}`}
              </p>
              <p className="text-xs truncate mt-0.5" style={{ color: '#6EE7B7' }}>
                {doctorProfile?.specialization || 'General Physician'}
              </p>
              <span className={`inline-block mt-1.5 text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wide ${badge.cls}`}>
                {badge.label}
              </span>
            </div>
          </div>
        </div>

        {/* ── Navigation ── */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6 hide-scrollbar">
          {navSections.map((section, idx) => (
            <div key={idx}>
              <h3 className="px-3 text-[9px] font-extrabold uppercase tracking-widest mb-2"
                  style={{ color: 'rgba(52,211,153,0.45)' }}>
                {section.section}
              </h3>
              <ul className="space-y-0.5">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx}>
                    <NavLink
                      to={item.path}
                      end={item.exact}
                      onClick={() => setIsOpen(false)}
                      className="block"
                    >
                      {({ isActive }) => (
                        <motion.div
                          whileHover={{ x: 3 }}
                          whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isActive
                              ? 'text-white shadow-[0_4px_16px_rgba(16,185,129,0.25)]'
                              : 'text-emerald-100/50 hover:text-white hover:bg-white/5'
                          }`}
                          style={isActive ? {
                            background: 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(5,150,105,0.15))',
                            border: '1px solid rgba(16,185,129,0.25)',
                          } : {}}
                        >
                          {/* Active indicator */}
                          {isActive && (
                            <span className="absolute left-0 w-0.5 h-6 rounded-r-full bg-emerald-400"
                                  style={{ boxShadow: '0 0 8px rgba(52,211,153,0.8)' }} />
                          )}
                          <item.icon
                            className={`w-4.5 h-4.5 flex-shrink-0 transition-colors ${
                              isActive ? 'text-emerald-400' : 'text-emerald-800/60'
                            }`}
                            style={isActive ? { filter: 'drop-shadow(0 0 4px rgba(52,211,153,0.6))' } : {}}
                          />
                          <span className="leading-none">{item.name}</span>
                        </motion.div>
                      )}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── Logout Footer ── */}
        <div className="flex-shrink-0 p-4" style={{ borderTop: '1px solid rgba(16,185,129,0.1)' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleLogout}
            className="flex items-center w-full gap-3 px-4 py-3 rounded-xl text-sm font-bold
                       text-rose-400 transition-all duration-200"
            style={{
              background: 'rgba(239,68,68,0.06)',
              border: '1px solid rgba(239,68,68,0.18)',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.13)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.06)'}
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            <span>Logout Account</span>
          </motion.button>
        </div>
      </aside>
    </>
  );
};

export default DoctorSidebar;
