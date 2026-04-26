import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IndianRupee, TrendingUp, Calendar, CheckCircle, Wallet, ChevronDown, Activity } from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const DoctorEarnings = () => {
  const [summary, setSummary] = useState(null);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All Time'); 

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [summaryRes, historyRes] = await Promise.all([
        axios.get('http://localhost:5000/api/payment/doctor/earnings-summary', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/payment/doctor', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setSummary(summaryRes.data);
      setPayments(historyRes.data);
    } catch (err) {
      toast.error('Failed to load earnings data', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(p => {
    if (filter === 'All Time') return true;
    const pDate = new Date(p.createdAt);
    const now = new Date();
    if (filter === 'Today') {
      return pDate.toDateString() === now.toDateString();
    }
    if (filter === 'This Month') {
      return pDate.getMonth() === now.getMonth() && pDate.getFullYear() === now.getFullYear();
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-32 space-y-6">
        <div className="relative w-16 h-16">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
        </div>
        <p className="text-emerald-600/80 text-xs font-extrabold tracking-widest uppercase">Syncing Ledger...</p>
      </div>
    );
  }

  const overview = summary?.overview || { totalEarnings: 0, thisMonthEarnings: 0, todayEarnings: 0, totalAppointments: 0 };
  const chartData = summary?.monthlyChartData || [];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(16,185,129,0.06)] border border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Earnings & Payments</h1>
          <p className="text-slate-500 mt-2 text-sm font-medium">Track your revenue, received payments, and financial health in real-time.</p>
        </div>
        <div className="bg-emerald-50 text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest shadow-sm border border-emerald-100 flex items-center gap-2">
          <Activity className="w-4 h-4" /> Live Sync
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Earnings Card (Dark Emerald Luxury) */}
        <motion.div 
          whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300 }}
          className="bg-gradient-to-br from-[#064E3B] to-[#022C22] p-8 rounded-[2rem] shadow-[0_20px_40px_rgba(6,78,59,0.3)] relative overflow-hidden group border border-emerald-900/50"
        >
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-emerald-400/20 rounded-full blur-2xl group-hover:bg-emerald-400/30 transition-colors"></div>
          <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/10 to-transparent"></div>
          
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3.5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/5 shadow-sm group-hover:scale-110 transition-transform">
              <Wallet className="w-6 h-6 text-emerald-300" />
            </div>
          </div>
          <p className="text-emerald-200/70 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">Total Earnings</p>
          <motion.h3 
            initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-4xl font-black text-white flex items-center relative z-10 drop-shadow-lg"
          >
            <IndianRupee className="w-7 h-7 mr-1 text-emerald-400" />{overview.totalEarnings}
          </motion.h3>
        </motion.div>

        {/* This Month */}
        <motion.div whileHover={{ y: -6 }} className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(16,185,129,0.05)] border border-emerald-500/10 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500"><TrendingUp className="w-24 h-24 text-emerald-600" /></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3.5 bg-emerald-50 rounded-2xl border border-emerald-100/50 shadow-sm group-hover:scale-110 transition-transform">
              <TrendingUp className="w-6 h-6 text-emerald-500" />
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">This Month</p>
          <h3 className="text-4xl font-extrabold text-slate-800 flex items-center relative z-10 tracking-tight">
            <IndianRupee className="w-7 h-7 text-slate-400" />{overview.thisMonthEarnings}
          </h3>
        </motion.div>

        {/* Today */}
        <motion.div whileHover={{ y: -6 }} className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(16,185,129,0.05)] border border-emerald-500/10 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500"><Calendar className="w-24 h-24 text-teal-600" /></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3.5 bg-teal-50 rounded-2xl border border-teal-100/50 shadow-sm group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6 text-teal-500" />
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">Today</p>
          <h3 className="text-4xl font-extrabold text-slate-800 flex items-center relative z-10 tracking-tight">
            <IndianRupee className="w-7 h-7 text-slate-400" />{overview.todayEarnings}
          </h3>
        </motion.div>

        {/* Paid Appointments */}
        <motion.div whileHover={{ y: -6 }} className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(16,185,129,0.05)] border border-emerald-500/10 group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-150 transition-transform duration-500"><CheckCircle className="w-24 h-24 text-green-600" /></div>
          <div className="flex justify-between items-start mb-6 relative z-10">
            <div className="p-3.5 bg-green-50 rounded-2xl border border-green-100/50 shadow-sm group-hover:scale-110 transition-transform">
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
          </div>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.2em] mb-2 relative z-10">Paid Appointments</p>
          <h3 className="text-4xl font-extrabold text-slate-800 relative z-10 tracking-tight">
            {overview.totalAppointments}
          </h3>
        </motion.div>
      </div>

      {/* Chart Section */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(16,185,129,0.06)] border border-emerald-500/10">
        <h3 className="text-xl font-extrabold text-slate-800 mb-8 tracking-tight">Monthly Revenue Trend</h3>
        <div className="w-full">
          <ResponsiveContainer width="100%" height={340}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" />
                  <stop offset="100%" stopColor="#059669" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ecfdf5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 11, fontWeight: 700 }} tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                cursor={{ fill: '#f0fdf4' }}
                contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(16,185,129,0.15)', fontWeight: 800 }}
                formatter={(value) => [`₹${value}`, 'Earnings']}
              />
              <Bar dataKey="earnings" fill="url(#revenueGrad)" radius={[8, 8, 8, 8]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* History Table */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_15px_40px_rgba(16,185,129,0.06)] border border-emerald-500/10 overflow-hidden">
        
        <div className="p-8 border-b border-emerald-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50">
          <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Ledger & History</h3>
          <div className="relative w-full sm:w-auto">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="w-full sm:w-auto appearance-none pl-5 pr-10 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-extrabold text-slate-600 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-300 cursor-pointer shadow-sm transition-all"
            >
              <option value="All Time">All Time</option>
              <option value="This Month">This Month</option>
              <option value="Today">Today</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {filteredPayments.length === 0 ? (
          <div className="text-center py-20 bg-white/30">
            <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-emerald-100">
              <Wallet className="w-8 h-8 text-emerald-300" />
            </div>
            <p className="text-slate-500 font-extrabold text-lg tracking-tight">No transactions found</p>
            <p className="text-slate-400 text-sm mt-1 font-medium">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-emerald-50/30 text-emerald-600 text-[10px] uppercase font-black tracking-[0.2em]">
                <tr>
                  <th className="px-8 py-5">Transaction ID</th>
                  <th className="px-8 py-5">Patient Info</th>
                  <th className="px-8 py-5">Amount</th>
                  <th className="px-8 py-5">Date & Slot</th>
                  <th className="px-8 py-5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-emerald-50/50 bg-white/40">
                <AnimatePresence>
                  {filteredPayments.map((payment, index) => (
                    <motion.tr 
                      key={payment._id} 
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}
                      whileHover={{ backgroundColor: 'rgba(236,253,245,0.4)', scale: 1.002 }}
                      className="group cursor-pointer"
                    >
                      <td className="px-8 py-5">
                        <p className="text-[13px] font-black text-slate-700 tracking-wide uppercase">{payment.transactionId}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[15px] font-extrabold text-slate-800">{payment.patientName}</p>
                        <p className="text-xs font-bold text-emerald-600 mt-1 uppercase tracking-wider">{payment.consultationType}</p>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center text-[15px] font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                          <IndianRupee className="w-4 h-4 mr-0.5 text-emerald-500" />{payment.amount}
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <p className="text-[13px] text-slate-600 font-extrabold">{payment.date}</p>
                        <p className="text-[11px] text-slate-400 mt-1 font-bold uppercase tracking-wider">{payment.timeSlot}</p>
                      </td>
                      <td className="px-8 py-5">
                        {payment.status === 'refunded' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-600 border border-rose-100 shadow-sm">
                            <CheckCircle className="w-3.5 h-3.5" /> Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-[0_2px_10px_rgba(16,185,129,0.15)]">
                            <CheckCircle className="w-3.5 h-3.5" /> Paid
                          </span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

    </motion.div>
  );
};

export default DoctorEarnings;
