import React, { useState, useEffect, useContext } from 'react';
import { Calendar, FileText, Activity, UploadCloud, UserPlus, Stethoscope, QrCode, Heart, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';

// ---------- helper functions (if any) ----------

const DashboardOverview = () => {
  const { user } = useContext(AuthContext);

  const [recentUpdates, setRecentUpdates]       = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [statsLoading, setStatsLoading]         = useState(true);

  // Real stat values
  const [totalRecords, setTotalRecords]         = useState(0);
  const [activeReminders, setActiveReminders]   = useState(0);
  const [doctorsConsulted, setDoctorsConsulted] = useState(0);

  // ── Fetch all stats in parallel ──────────────────────
  useEffect(() => {
    const token = localStorage.getItem('token');
    const authHeader = { headers: { Authorization: `Bearer ${token}` } };

    const fetchStats = async () => {
      try {
        const [docsRes, remindersRes, connectionsRes] = await Promise.allSettled([
          axios.get('http://localhost:5000/api/patient/documents', authHeader),
          axios.get('http://localhost:5000/api/patient/reminders', authHeader),
          axios.get('http://localhost:5000/api/connections/my-doctors', authHeader),
        ]);

        // Total Records
        if (docsRes.status === 'fulfilled') {
          setTotalRecords(Array.isArray(docsRes.value.data) ? docsRes.value.data.length : 0);
        }

        // Active Reminders
        if (remindersRes.status === 'fulfilled') {
          const active = Array.isArray(remindersRes.value.data)
            ? remindersRes.value.data.filter(r => r.status === 'active').length
            : 0;
          setActiveReminders(active);
        }

        // Doctors Consulted (active connections only)
        if (connectionsRes.status === 'fulfilled') {
          const activeDocs = Array.isArray(connectionsRes.value.data)
            ? connectionsRes.value.data.filter(c => c.relationStatus === 'active').length
            : 0;
          setDoctorsConsulted(activeDocs);
        }
      } catch (err) {
        console.error('Stats fetch error:', err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // ── Fetch recent clinical updates ────────────────────
  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(
          'http://localhost:5000/api/update-requests/patient/clinical-notes',
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setRecentUpdates(Array.isArray(res.data) ? res.data.slice(0, 3) : []);
      } catch (err) {
        console.error('Failed to fetch recent updates', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUpdates();
  }, []);

  // ── Stats array — values come from state ─────────────
  const stats = [
    {
      name: 'Total Records',
      value: totalRecords,
      suffix: '',
      icon: FileText,
      gradient: 'from-blue-600/20 to-blue-500/10',
      iconBg: 'bg-blue-500/15',
      iconColor: 'text-blue-400',
      glow: 'rgba(59,130,246,0.15)',
      progressGrad: 'from-blue-400',
      progressPct: Math.min(totalRecords * 8, 100), // visual bar scale
    },
    {
      name: 'Active Reminders',
      value: activeReminders,
      suffix: '',
      icon: Calendar,
      gradient: 'from-amber-600/20 to-amber-500/10',
      iconBg: 'bg-amber-500/15',
      iconColor: 'text-amber-400',
      glow: 'rgba(251,191,36,0.15)',
      progressGrad: 'from-amber-400',
      progressPct: Math.min(activeReminders * 15, 100),
    },
    {
      name: 'Doctors Consulted',
      value: doctorsConsulted,
      suffix: '',
      icon: Stethoscope,
      gradient: 'from-purple-600/20 to-purple-500/10',
      iconBg: 'bg-purple-500/15',
      iconColor: 'text-purple-400',
      glow: 'rgba(167,139,250,0.15)',
      progressGrad: 'from-purple-400',
      progressPct: Math.min(doctorsConsulted * 20, 100),
    },
  ];

  const quickActions = [
    { name: 'Upload Record',  icon: UploadCloud, path: '/patient-dashboard/records',      gradient: 'from-blue-600 to-blue-500',   glow: 'rgba(59,130,246,0.30)',   iconBg: 'bg-blue-500/15',   iconColor: 'text-blue-400' },
    { name: 'Update Profile', icon: UserPlus,    path: '/patient-dashboard/profile',      gradient: 'from-teal-600 to-teal-500',   glow: 'rgba(20,184,166,0.30)',   iconBg: 'bg-teal-500/15',   iconColor: 'text-teal-400' },
    { name: 'Find Doctor',    icon: Stethoscope, path: '/patient-dashboard/find-doctor',  gradient: 'from-purple-600 to-purple-500',glow: 'rgba(167,139,250,0.30)', iconBg: 'bg-purple-500/15', iconColor: 'text-purple-400' },
    { name: 'View QR Card',   icon: QrCode,      path: '/patient-dashboard/swasthya-card',gradient: 'from-amber-600 to-amber-500', glow: 'rgba(251,191,36,0.30)',   iconBg: 'bg-amber-500/15',  iconColor: 'text-amber-400' },
  ];

  const baseGlassStyle    = "bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.12)] rounded-2xl backdrop-blur-[12px] shadow-[0_4px_24px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300";
  const hoverGlassStyle   = "hover:border-[rgba(59,130,246,0.30)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.07)]";

  // ── Skeleton for stat cards ───────────────────────────
  const StatSkeleton = () => (
    <div className={`p-5 flex flex-col ${baseGlassStyle}`}>
      <div className="w-12 h-12 rounded-xl bg-white/5 animate-pulse mb-4" />
      <div className="h-3 w-20 bg-white/5 rounded animate-pulse" />
      <div className="h-8 w-12 bg-white/5 rounded animate-pulse mt-2" />
      <div className="h-1 bg-white/5 rounded animate-pulse mt-4 w-full" />
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 pb-10"
    >
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      {/* WELCOME BANNER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative overflow-hidden p-6 rounded-2xl backdrop-blur-md border border-[rgba(59,130,246,0.20)]"
        style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.20), rgba(59,130,246,0.10))' }}
      >
        <div className="absolute right-4 top-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl hidden sm:block pointer-events-none" />
        <div className="relative z-10">
          <h2 className="text-white font-bold text-xl sm:text-2xl">Good Morning, {user?.name || 'Patient'} 👋</h2>
          <p className="text-slate-400 text-sm mt-1">Here's your health summary for today.</p>
        </div>
      </motion.div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsLoading
          ? [0,1,2,3].map(i => <StatSkeleton key={i} />)
          : stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.08 }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className={`relative p-5 overflow-hidden flex flex-col ${baseGlassStyle} ${hoverGlassStyle}`}
          >
            <style>{`
              .stat-card-${idx}:hover { box-shadow: 0 12px 40px ${stat.glow}, inset 0 1px 0 rgba(255,255,255,0.07); }
            `}</style>

            <div
              className={`w-max p-3.5 rounded-xl ${stat.iconBg} ${stat.iconColor} mb-4`}
              style={{ boxShadow: `0 0 16px ${stat.glow}` }}
            >
              <stat.icon className="w-6 h-6" />
            </div>

            <div className="mt-auto">
              <p className="text-slate-400 text-xs font-medium uppercase tracking-wide">{stat.name}</p>
              <h3 className="text-white font-extrabold text-3xl leading-tight mt-1">
                {stat.value}{stat.suffix}
              </h3>
            </div>

            {/* Real progress bar based on actual pct */}
            <div className="h-1 rounded-full bg-white/5 mt-4 w-full overflow-hidden">
              <motion.div
                className={`h-full bg-gradient-to-r ${stat.progressGrad} to-transparent rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${stat.progressPct}%` }}
                transition={{ duration: 1, delay: idx * 0.1, ease: 'easeOut' }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <div className="mb-4">
          <h3 className="text-slate-200 font-bold text-lg">Quick Actions</h3>
          <p className="text-slate-500 text-sm mt-0.5">Navigate to key features quickly</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.06 }}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className="h-full block"
            >
              <Link
                to={action.path}
                className={`flex flex-col items-center p-6 group h-full ${baseGlassStyle} ${hoverGlassStyle}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${action.iconBg} border border-[rgba(255,255,255,0.08)] transition-all duration-300`}
                  style={{ boxShadow: `0 0 20px ${action.glow}` }}
                >
                  <style>{`
                    .group:hover .icon-wrapper-${idx} {
                      box-shadow: 0 0 30px ${action.glow};
                      transform: scale(1.1) rotate(5deg);
                    }
                  `}</style>
                  <div className={`icon-wrapper-${idx} w-full h-full flex items-center justify-center transition-all duration-300`}>
                    <action.icon className={`w-6 h-6 ${action.iconColor}`} />
                  </div>
                </div>

                <span className="text-slate-300 font-semibold text-sm text-center">
                  {action.name}
                </span>

                <div className="mt-2 h-4 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <ChevronRight className="w-4 h-4 text-blue-400" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* RECENT DOCTOR UPDATES PANEL */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
        className={`p-6 ${baseGlassStyle}`}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-slate-100 font-bold text-lg">Recent Doctor Updates</h3>
          <Link to="/patient-dashboard/records" className="text-blue-400 hover:text-blue-300 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all">
            View All <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div
                key={i}
                className="h-20 rounded-xl border border-[rgba(255,255,255,0.05)]"
                style={{
                  background: 'linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite linear'
                }}
              />
            ))}
          </div>
        ) : recentUpdates.length > 0 ? (
          <div className="space-y-4">
            {recentUpdates.map((update, idx) => (
              <motion.div
                key={update._id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.07 }}
                whileHover={{ x: 4 }}
                className="flex items-start gap-4 p-4 rounded-xl bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(59,130,246,0.05)] border border-transparent hover:border-[rgba(59,130,246,0.20)] transition-all duration-200"
              >
                <div className="p-3 bg-emerald-500/15 rounded-xl shadow-[0_0_12px_rgba(52,211,153,0.20)] flex-shrink-0">
                  <Heart className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <h4 className="text-slate-200 font-semibold text-sm truncate">Update from {update.doctorName}</h4>
                  <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                    {update.diagnosis && `Diagnosis: ${update.diagnosis}. `}
                    {update.prescriptions?.length > 0 && `Medicines: ${update.prescriptions.map(p => p.medicineName).join(', ')}. `}
                    {update.advice && `Advice: ${update.advice}`}
                  </p>
                </div>
                <div className="bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.08)] text-slate-400 text-xs font-medium px-2.5 py-1 rounded-lg whitespace-nowrap">
                  {new Date(update.createdAt).toLocaleDateString()}
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-white/10 flex items-center justify-center mb-4">
              <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center">
                <Activity className="text-slate-600 w-6 h-6" />
              </div>
            </div>
            <h4 className="text-slate-300 font-semibold mt-4">No recent updates</h4>
            <p className="text-slate-600 text-sm mt-2 max-w-xs text-center">Your recent health activities, lab results, and consultation notes will appear here automatically.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default DashboardOverview;
