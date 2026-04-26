import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Stethoscope, Heart, TrendingUp, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import adminService from '../../../services/adminService';

const StatPill = ({ label, value, icon: Icon, color, delay }) => (
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
    </div>
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-black/80 backdrop-blur-md border border-white/10 p-4 rounded-2xl shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <p className="text-xs font-black uppercase tracking-widest text-zinc-500 mb-2">{label}</p>
        <p className="text-lg font-extrabold text-white flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-zinc-300" />
          {payload[0].value} <span className="text-sm text-zinc-400 font-medium">users</span>
        </p>
      </div>
    );
  }
  return null;
};

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getAnalytics()
      .then(res => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-32 bg-white/[0.03] backdrop-blur-xl rounded-[2rem] border border-white/5 animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-80 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 animate-pulse" />
        <div className="h-80 bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/5 animate-pulse flex items-center justify-center">
           <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-white border-l-zinc-500 animate-spin" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Summary pills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatPill label="Active Doctors"  value={data?.activeDoctors}  icon={Stethoscope} color="text-zinc-300" delay={0.1} />
        <StatPill label="Active Patients" value={data?.activePatients} icon={Heart}       color="text-rose-400" delay={0.2} />
        <StatPill label="7-Day Signups"   value={data?.dailySignups?.reduce((a, d) => a + d.signups, 0)} icon={TrendingUp} color="text-emerald-400" delay={0.3} />
        <StatPill label="Total Months"    value={data?.monthlyGrowth?.length ?? 6}   icon={Activity}    color="text-amber-400" delay={0.4} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Daily Signups Bar Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 relative overflow-hidden group min-w-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-8 relative z-10">Daily Signups — Last 7 Days</h3>
          
          <div className="relative z-10 w-full">
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <BarChart data={data?.dailySignups || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e5e5e5" stopOpacity={1} />
                    <stop offset="100%" stopColor="#525252" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#737373', fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#737373', fontWeight: 800 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff', opacity: 0.05 }} />
                <Bar dataKey="signups" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Monthly Growth Line Chart */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6 }}
          className="bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] p-8 relative overflow-hidden group min-w-0"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
          <h3 className="text-sm font-black uppercase tracking-widest text-zinc-400 mb-8 relative z-10">Monthly User Growth — Last 6 Months</h3>
          
          <div className="relative z-10 w-full">
            <ResponsiveContainer width="100%" height={250} minWidth={0}>
              <LineChart data={data?.monthlyGrowth || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff" strokeOpacity={0.05} vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#737373', fontWeight: 800 }} axisLine={false} tickLine={false} dy={10} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#737373', fontWeight: 800 }} axisLine={false} tickLine={false} dx={-10} />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff', strokeOpacity: 0.1, strokeWidth: 2 }} />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#e5e5e5" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#000', stroke: '#e5e5e5', strokeWidth: 2 }} 
                  activeDot={{ r: 6, fill: '#fff', stroke: '#000', strokeWidth: 2 }} 
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
