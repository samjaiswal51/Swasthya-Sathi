import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Eye, Heart, Calendar, MessageCircle, FileText, Users, Award, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';
import StatsCard from '../../../components/doctor/statistics/StatsCard';
import TopPostsTable from '../../../components/doctor/statistics/TopPostsTable';
import GrowthCharts from '../../../components/doctor/statistics/GrowthCharts';

const DoctorStatistics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('thisyear');

  useEffect(() => {
    fetchStats();
  }, [filter]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/doctor-stats?filter=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setData(res.data);
    } catch (err) {
      toast.error('Failed to load doctor statistics', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-6">
        <div className="relative w-16 h-16">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-[3px] border-transparent border-b-teal-400 border-l-teal-400 absolute top-2 left-2" />
        </div>
        <p className="text-emerald-600/80 text-xs font-extrabold tracking-widest uppercase">Loading Analytics...</p>
      </div>
    );
  }

  if (!data) return null;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto space-y-10 pb-16">
      
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(16,185,129,0.2)] flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Abstract Glows */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-emerald-500/30 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-teal-500/30 rounded-full blur-[80px]"></div>
        
        <div className="relative z-10 text-center sm:text-left">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight drop-shadow-sm mb-2">Doctor Statistics</h1>
          <p className="text-emerald-100/80 font-medium text-sm sm:text-base">Track profile growth, patient engagement, and your clinic's overall performance.</p>
        </div>
        
        <div className="relative z-10 w-full sm:w-auto">
          <div className="relative">
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-6 pr-12 py-3.5 rounded-[1.25rem] bg-white/10 backdrop-blur-md border border-white/20 text-sm font-extrabold text-white outline-none focus:ring-4 focus:ring-emerald-500/30 focus:border-white/40 cursor-pointer transition-all shadow-inner"
            >
              <option value="7days" className="text-slate-800 font-bold">Last 7 Days</option>
              <option value="thismonth" className="text-slate-800 font-bold">This Month</option>
              <option value="3months" className="text-slate-800 font-bold">Last 3 Months</option>
              <option value="thisyear" className="text-slate-800 font-bold">This Year</option>
              <option value="all" className="text-slate-800 font-bold">All Time</option>
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/70 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <StatsCard title="Profile Views" value={data.overview.profileViews} icon={Eye} delay={0} />
        <StatsCard title="Total Likes" value={data.overview.totalLikes} icon={Heart} delay={0.1} />
        <StatsCard title="Appointments Booked" value={data.overview.appointments} icon={Calendar} delay={0.2} />
        <StatsCard title="Chat Requests" value={data.overview.chats} icon={MessageCircle} delay={0.3} />
        <StatsCard title="Posts Published" value={data.overview.posts} icon={FileText} delay={0.4} />
        <StatsCard title="Patients Connected" value={data.overview.patients} icon={Users} delay={0.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Engagement Metrics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_50px_rgba(16,185,129,0.05)] border border-emerald-500/10 flex flex-col justify-center relative overflow-hidden group hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] transition-shadow">
          <div className="absolute top-0 right-0 p-6 opacity-[0.03] group-hover:scale-110 group-hover:opacity-[0.05] transition-all duration-500"><Award className="w-48 h-48 text-emerald-900" /></div>
          <h3 className="text-xl font-extrabold text-slate-800 mb-8 relative z-10 tracking-tight">Engagement Metrics</h3>
          <div className="space-y-4 relative z-10">
            <div className="flex justify-between items-center px-5 py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Average Likes / Post</span>
              <span className="font-extrabold text-slate-800 text-lg">{data.engagement.avgLikesPerPost}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total Saves</span>
              <span className="font-extrabold text-slate-800 text-lg">{data.engagement.totalSaves}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Total Followers</span>
              <span className="font-extrabold text-slate-800 text-lg">{data.engagement.followersCount}</span>
            </div>
          </div>
        </motion.div>

        {/* Appointment Analytics */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_50px_rgba(16,185,129,0.05)] border border-emerald-500/10 flex flex-col justify-center group hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] transition-shadow">
          <h3 className="text-xl font-extrabold text-slate-800 mb-8 tracking-tight">Appointment Analytics</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Completed</span>
                <span className="font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">{data.appointmentAnalytics.completedAppointments}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner"><motion.div initial={{ width: 0 }} animate={{ width: `${(data.appointmentAnalytics.completedAppointments / (data.appointmentAnalytics.totalAppointments || 1)) * 100}%` }} transition={{ duration: 1, delay: 0.5 }} className="bg-gradient-to-r from-emerald-400 to-green-500 h-2 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.4)]"></motion.div></div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Cancelled</span>
                <span className="font-extrabold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-md">{data.appointmentAnalytics.cancelledAppointments}</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 shadow-inner"><motion.div initial={{ width: 0 }} animate={{ width: `${(data.appointmentAnalytics.cancelledAppointments / (data.appointmentAnalytics.totalAppointments || 1)) * 100}%` }} transition={{ duration: 1, delay: 0.6 }} className="bg-gradient-to-r from-rose-400 to-red-500 h-2 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.4)]"></motion.div></div>
            </div>

            <div className="flex justify-between items-center mt-6 p-5 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100/50 shadow-sm">
              <span className="font-black uppercase tracking-widest text-[10px] text-emerald-800">Peak Booking Day</span>
              <span className="font-extrabold text-emerald-900 bg-white px-3 py-1 rounded-xl shadow-sm text-sm">{data.appointmentAnalytics.peakBookingDay}</span>
            </div>
          </div>
        </motion.div>

        {/* Patient Interaction */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_50px_rgba(16,185,129,0.05)] border border-emerald-500/10 flex flex-col justify-center group hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] transition-shadow">
          <h3 className="text-xl font-extrabold text-slate-800 mb-8 tracking-tight">Patient Interaction</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center px-5 py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Unique Patients</span>
              <span className="font-extrabold text-slate-800 text-lg">{data.patientStats.totalUniquePatients}</span>
            </div>
            <div className="flex justify-between items-center px-5 py-4 bg-emerald-50/50 rounded-2xl border border-emerald-100/50">
              <span className="text-xs font-black uppercase tracking-widest text-slate-500">Repeat Patients</span>
              <span className="font-extrabold text-teal-600 text-lg">{data.patientStats.repeatPatients}</span>
            </div>
            <div className="flex justify-between items-center p-5 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl shadow-[0_10px_20px_rgba(16,185,129,0.2)] mt-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-50">Response Rate</span>
              <span className="font-black text-white text-3xl drop-shadow-md">{data.patientStats.responseRate}%</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Posts Table */}
      <TopPostsTable posts={data.topPosts} />

      {/* Growth Charts */}
      <GrowthCharts monthlyData={data.monthlyGrowth} />

    </motion.div>
  );
};

export default DoctorStatistics;
