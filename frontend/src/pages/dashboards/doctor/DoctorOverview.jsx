import React, { useContext, useState, useEffect } from 'react';
import { Link, useOutletContext } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import {
  Users,
  Calendar,
  MessageSquare,
  Activity,
  Clock4,
  UserCheck,
  User,
  MapPin,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';

// Container Variants for staggering children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } }
};

const DoctorOverview = () => {
  const { user } = useContext(AuthContext);
  const { profile } = useOutletContext();
  const [patientsCount, setPatientsCount] = useState(0);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        // Fetch patients
        const patientsRes = await axios.get('http://localhost:5000/api/connections/my-patients', { headers });
        const activePatients = patientsRes.data.filter(c => c.relationStatus === 'active');
        setPatientsCount(activePatients.length);

        // Fetch appointments
        const appointmentsRes = await axios.get('http://localhost:5000/api/appointments/doctor', { headers });
        const todayStr = new Date().toISOString().split('T')[0];
        
        const todayApps = appointmentsRes.data.filter(apt => {
          if (!apt.date) return false;
          // Format date from DB which might be in various formats. Standardize to YYYY-MM-DD
          const aptDate = new Date(apt.date).toISOString().split('T')[0];
          return aptDate === todayStr;
        });
        
        // Sort by time
        todayApps.sort((a, b) => {
          if (!a.time || !b.time) return 0;
          return a.time.localeCompare(b.time);
        });

        setTodaysAppointments(todayApps);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = [
    {
      name: 'Total Patients',
      value: loading ? '...' : patientsCount,
      icon: Users,
      gradient: 'from-emerald-500 to-green-500',
      shadowColor: 'rgba(16,185,129,0.3)',
    },
    {
      name: "Today's Appointments",
      value: loading ? '...' : todaysAppointments.length,
      icon: Calendar,
      gradient: 'from-teal-500 to-emerald-500',
      shadowColor: 'rgba(20,184,166,0.3)',
    },
    {
      name: 'Profile Status',
      value: profile?.verificationStatus ? (profile.verificationStatus.charAt(0).toUpperCase() + profile.verificationStatus.slice(1)) : 'Pending',
      icon: Activity,
      gradient: profile?.verificationStatus === 'approved' ? 'from-emerald-500 to-green-500' : 'from-amber-500 to-orange-400',
      shadowColor: profile?.verificationStatus === 'approved' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)',
    },
  ];

  const quickActions = [
    {
      name: 'Open Chat',
      icon: MessageSquare,
      path: '/doctor-dashboard/chat',
    },
    {
      name: 'Update Slots',
      icon: Clock4,
      path: '/doctor-dashboard/schedule',
    },
    {
      name: 'View Patients',
      icon: UserCheck,
      path: '/doctor-dashboard/patients',
    },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  const StatusBadge = ({ status }) => {
    const map = {
      pending_approval: { label: 'Pending', icon: <Clock className="w-3 h-3" />, classes: 'bg-amber-500/15 text-amber-600 border border-amber-500/25' },
      confirmed:        { label: 'Confirmed', icon: <CheckCircle className="w-3 h-3" />, classes: 'bg-blue-500/15 text-blue-600 border border-blue-500/25 shadow-[0_0_8px_rgba(59,130,246,0.2)]' },
      completed:        { label: 'Completed', icon: <CheckCircle className="w-3 h-3" />, classes: 'bg-emerald-500/15 text-emerald-600 border border-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.2)]' },
      cancelled:        { label: 'Cancelled', icon: <XCircle className="w-3 h-3" />, classes: 'bg-rose-500/15 text-rose-600 border border-rose-500/25' },
    };
    const s = map[status] || map.pending_approval;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${s.classes}`}>
        {s.icon} {s.label}
      </span>
    );
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* ── 1. Welcome Hero Banner ── */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl p-8 lg:p-10 shadow-[0_20px_60px_rgba(16,185,129,0.15)]"
           style={{
             background: 'linear-gradient(135deg, #022C22 0%, #064E3B 50%, #052E16 100%)',
             border: '1px solid rgba(16,185,129,0.2)',
           }}>
        {/* Animated Background Orbs */}
        <motion.div animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
             className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(52,211,153,0.3) 0%, transparent 70%)' }} />
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
             className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full blur-3xl pointer-events-none"
             style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.25) 0%, transparent 70%)' }} />
             
        <div className="relative z-10">
          <p className="text-emerald-300 font-bold tracking-wide mb-2 flex items-center gap-2">
            {greeting} <span className="animate-bounce">👋</span>
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-2 tracking-tight drop-shadow-sm">
            Dr. {user?.name || 'Doctor'}
          </h2>
          <p className="text-emerald-100/80 text-sm font-medium">
            Here's your practice summary for today,{' '}
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}.
          </p>
        </div>
      </motion.div>

      {/* ── 2. Stats Grid ── */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            whileHover={{ y: -6, scale: 1.02 }}
            className="relative bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] transition-all duration-300 border border-emerald-500/10 overflow-hidden flex items-center gap-5"
          >
            {/* Ambient subtle glow for stat card */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />

            <div className="relative">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center text-white`}
                   style={{ boxShadow: `0 8px 24px ${stat.shadowColor}` }}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.name}</p>
              <h3 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {stat.value}
              </h3>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ── 3. Quick Actions ── */}
      <motion.div variants={itemVariants}>
        <h3 className="text-xl font-extrabold text-slate-800 mb-5 pl-1">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {quickActions.map((action, idx) => (
            <Link key={idx} to={action.path} className="group block">
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-white/60 backdrop-blur-xl p-6 rounded-3xl shadow-sm hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] border border-emerald-500/10 transition-all duration-300 flex flex-col items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/0 to-teal-500/0 group-hover:from-emerald-500/5 group-hover:to-teal-500/5 transition-all duration-500" />
                <div className="p-4 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 mb-4 group-hover:scale-110 group-hover:bg-emerald-100 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all duration-300">
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-bold text-slate-700 text-center tracking-wide group-hover:text-emerald-700 transition-colors">
                  {action.name}
                </span>
              </motion.div>
            </Link>
          ))}
        </div>
      </motion.div>

      {/* ── 4. Today's Appointments ── */}
      <motion.div variants={itemVariants} className="bg-white/60 backdrop-blur-xl shadow-sm rounded-3xl border border-emerald-500/10 overflow-hidden relative hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] transition-all duration-500">
        <div className="p-6 lg:p-8 flex items-center justify-between border-b border-emerald-500/5">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl">
              <Calendar className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Today's Appointments</h3>
          </div>
          <Link
            to="/doctor-dashboard/appointments"
            className="group flex items-center gap-1.5 text-sm font-bold text-emerald-600 hover:text-emerald-700 transition-colors"
          >
            View all 
            <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
          </Link>
        </div>
        
        <div className="p-6 lg:p-8">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="relative w-14 h-14">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                  className="w-14 h-14 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                  className="w-10 h-10 rounded-full border-4 border-transparent border-b-teal-400 border-l-teal-400 absolute top-2 left-2" />
              </div>
            </div>
          ) : todaysAppointments.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center">
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)] border border-emerald-100">
                <Calendar className="w-10 h-10 text-emerald-500" />
              </motion.div>
              <h4 className="text-xl text-slate-800 font-extrabold mb-2 tracking-tight">No appointments today</h4>
              <p className="text-slate-500 text-sm max-w-sm mb-6 leading-relaxed">
                You have no scheduled consultations for today. Your upcoming bookings will appear here.
              </p>
              <Link to="/doctor-dashboard/schedule">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-white transition-all shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)]"
                  style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}>
                  <Clock4 className="w-4 h-4" />
                  <span>Set Availability</span>
                </motion.button>
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {todaysAppointments.map((apt, index) => (
                <motion.div 
                  key={apt._id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -2, scale: 1.005 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-2xl border border-slate-200/60 bg-white hover:border-emerald-200 hover:shadow-[0_8px_30px_rgba(16,185,129,0.08)] transition-all duration-300 gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 flex items-center justify-center font-extrabold text-lg border border-emerald-200/50 flex-shrink-0">
                      {apt.patientId?.name?.charAt(0) || <User className="w-6 h-6" />}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-base">{apt.patientId?.name || 'Patient'}</h4>
                      <div className="flex items-center gap-3 mt-1.5 text-xs font-semibold text-slate-500">
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                          <Clock4 className="w-3.5 h-3.5 text-emerald-500" /> {apt.time}
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-lg">
                          <MapPin className="w-3.5 h-3.5 text-teal-500" /> {apt.consultationType}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="self-end sm:self-auto">
                    <StatusBadge status={apt.appointmentStatus} />
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default DoctorOverview;
