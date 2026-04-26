import React, { useState, useEffect } from 'react';
import { Users, Stethoscope, Heart, TrendingUp, Clock, AlertCircle, UserX } from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from '../../../services/adminService';

const StatCard = ({ label, value, icon: Icon, color, subtext, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
    whileHover={{ y: -5 }}
    className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-7 border border-white/10 shadow-[0_15px_40px_rgba(0,0,0,0.4)] flex items-center gap-6 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)] transition-all duration-300 relative overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent pointer-events-none" />
    <div className={`p-4 rounded-2xl border border-white/10 bg-black/50 shadow-inner flex-shrink-0 group-hover:scale-110 transition-transform duration-500 ${color}`}>
      <Icon className="w-7 h-7 currentColor" />
    </div>
    <div className="relative z-10">
      <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-1">{label}</p>
      <p className="text-4xl font-extrabold text-white tracking-tight leading-none">{value ?? '—'}</p>
      {subtext && <p className="text-[11px] font-bold text-zinc-400 mt-2 tracking-wide">{subtext}</p>}
    </div>
  </motion.div>
);

const QuickStat = ({ label, value, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay }}
    whileHover={{ scale: 1.02 }}
    className="bg-black/40 backdrop-blur-md rounded-2xl p-5 border border-white/5 shadow-lg flex items-center justify-between group hover:border-white/10 transition-all"
  >
    <p className="text-xs font-black uppercase tracking-widest text-zinc-400 group-hover:text-zinc-300 transition-colors">{label}</p>
    <span className={`text-2xl font-extrabold tracking-tight ${color}`}>{value ?? '—'}</span>
  </motion.div>
);

const SkeletonCard = () => (
  <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] p-7 border border-white/5 shadow-lg animate-pulse flex items-center gap-6">
    <div className="w-16 h-16 rounded-2xl bg-white/10" />
    <div className="space-y-3 flex-1">
      <div className="h-3 w-24 bg-white/10 rounded-full" />
      <div className="h-8 w-16 bg-white/10 rounded-xl" />
      <div className="h-2 w-32 bg-white/5 rounded-full" />
    </div>
  </div>
);

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getDashboardStats()
      .then(res => setStats(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const mainStats = [
    { label: 'Total Users',      value: stats?.totalUsers,         icon: Users,       color: 'text-zinc-300',    subtext: 'ALL REGISTERED ACCOUNTS' },
    { label: 'Total Doctors',    value: stats?.totalDoctors,       icon: Stethoscope, color: 'text-emerald-400', subtext: 'VERIFIED PLATFORM DOCTORS' },
    { label: 'Total Patients',   value: stats?.totalPatients,      icon: Heart,       color: 'text-rose-400',    subtext: 'ACTIVE PATIENT ACCOUNTS' },
    { label: 'New Today',        value: stats?.todayRegistrations, icon: TrendingUp,  color: 'text-amber-400',   subtext: 'REGISTERED IN LAST 24H' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Hero Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}
        className="bg-gradient-to-r from-[#111] via-[#1a1a1a] to-black rounded-[2.5rem] p-8 sm:p-10 text-white relative overflow-hidden border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-zinc-800/20 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative z-10">
          <p className="text-zinc-400 text-xs font-black uppercase tracking-[0.2em] mb-3">
            {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">Welcome back, Executive <span className="inline-block animate-bounce ml-2">👋</span></h2>
          <p className="text-zinc-500 text-sm font-medium tracking-wide">Here's a high-level overview of the Swasthya Sathi platform today.</p>
        </div>
      </motion.div>

      {/* Main stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : mainStats.map((s, idx) => <StatCard key={s.label} {...s} delay={idx * 0.1} />)
        }
      </div>

      {/* Quick Overview Panel */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
        className="pt-4"
      >
        <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-3">
          <div className="h-px bg-white/10 flex-1" />
          Attention Required
          <div className="h-px bg-white/10 flex-1" />
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <QuickStat label="⏳ Pending Approvals" value={stats?.pendingDoctors}  color="text-amber-400" delay={0.6} />
          <QuickStat label="🚫 Suspended Users"   value={stats?.suspendedUsers}  color="text-rose-500" delay={0.7} />
          <QuickStat label="🚨 Open Complaints"   value={stats?.openComplaints}  color="text-rose-400" delay={0.8} />
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardOverview;
