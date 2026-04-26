import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Search, IndianRupee, Users, TrendingUp, Wallet } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const AdminPayments = () => {
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const [historyRes, summaryRes] = await Promise.all([
        axios.get('http://localhost:5000/api/payment/admin', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:5000/api/payment/admin/summary', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setPayments(historyRes.data);
      setSummary(summaryRes.data);
    } catch (err) {
      toast.error('Failed to load payments data', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }});
    } finally {
      setLoading(false);
    }
  };

  const filtered = payments.filter(p => 
    p.patientName?.toLowerCase().includes(search.toLowerCase()) || 
    p.doctorName?.toLowerCase().includes(search.toLowerCase()) ||
    p.transactionId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-12">
      
      {/* Header Hero */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-zinc-900 via-[#111] to-black p-8 sm:p-10 rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-between"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-40 h-40 bg-zinc-800/20 rounded-full blur-[60px] pointer-events-none" />
        
        <div className="relative z-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Global Payments Monitor</h2>
          <p className="text-zinc-400 text-sm mt-2 font-medium tracking-wide">Track all system transactions and platform revenue in real-time.</p>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-40 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/5 animate-pulse" />
            ))}
          </div>
          <div className="h-96 bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/5 animate-pulse flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-white border-l-zinc-500 animate-spin" />
              <p className="text-zinc-500 text-sm font-black uppercase tracking-widest">Loading Ledger...</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Analytics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-zinc-800 to-black p-8 rounded-3xl shadow-[0_15px_40px_rgba(0,0,0,0.6)] border border-white/10 relative overflow-hidden group"
            >
              <div className="absolute -right-6 -top-6 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all duration-500" />
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="p-3 bg-white/10 border border-white/10 rounded-xl backdrop-blur-md shadow-inner">
                  <IndianRupee className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-zinc-400 text-xs font-black uppercase tracking-widest mb-2 relative z-10">Total System Revenue</p>
              <h3 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-400 flex items-center relative z-10">
                ₹{summary?.totalRevenue?.toLocaleString('en-IN') || 0}
              </h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-white/10 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl"><TrendingUp className="w-6 h-6 text-zinc-300" /></div>
              </div>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Today's Revenue</p>
              <h3 className="text-3xl font-black text-white flex items-center">
                ₹{summary?.todayRevenue?.toLocaleString('en-IN') || 0}
              </h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              whileHover={{ y: -5 }}
              className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-white/10 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl"><CreditCard className="w-6 h-6 text-zinc-300" /></div>
              </div>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Total Transactions</p>
              <h3 className="text-3xl font-black text-white">
                {summary?.totalTransactions?.toLocaleString('en-IN') || 0}
              </h3>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
              whileHover={{ y: -5 }}
              className="bg-white/[0.03] backdrop-blur-xl p-8 rounded-3xl border border-white/5 hover:border-white/10 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="p-3 bg-white/5 border border-white/10 rounded-xl"><Users className="w-6 h-6 text-zinc-300" /></div>
              </div>
              <p className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-2">Earning Doctors</p>
              <h3 className="text-3xl font-black text-white">
                {summary?.activeDoctorsEarning?.toLocaleString('en-IN') || 0}
              </h3>
            </motion.div>
          </div>

          {/* Transactions Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
            className="bg-white/[0.03] backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)] overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
            
            <div className="p-6 sm:p-8 border-b border-white/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 relative z-10">
              <h3 className="text-xl font-extrabold text-white tracking-tight">Transaction Log</h3>
              <div className="relative w-full sm:w-80 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search TXN, Patient, Doctor..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-5 py-3.5 rounded-2xl bg-black border border-white/10 text-sm text-white placeholder-zinc-600 focus:border-white/30 focus:ring-2 focus:ring-white/10 outline-none shadow-inner transition-all"
                />
              </div>
            </div>

            <div className="overflow-x-auto relative z-10 hide-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10">
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Transaction ID</th>
                    <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Patient</th>
                    <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Doctor</th>
                    <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Date & Time</th>
                    <th className="px-8 py-5 text-[10px] font-black text-zinc-500 uppercase tracking-widest">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="py-24 text-center">
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <div className="w-20 h-20 mx-auto bg-black border border-white/10 rounded-2xl flex items-center justify-center mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                              <Wallet className="w-8 h-8 text-zinc-600" />
                            </div>
                            <p className="text-white font-extrabold text-xl tracking-tight mb-1">No transactions found</p>
                            <p className="text-zinc-500 text-sm font-medium">Try adjusting your search criteria.</p>
                          </motion.div>
                        </td>
                      </tr>
                    ) : filtered.map((payment, index) => (
                      <motion.tr 
                        key={payment._id} 
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.02 }}
                        className="hover:bg-white/[0.03] transition-colors group"
                      >
                        <td className="px-8 py-5 font-mono text-[11px] text-zinc-400 font-bold tracking-wider">{payment.transactionId}</td>
                        <td className="px-6 py-5 text-sm font-extrabold text-white">{payment.patientName}</td>
                        <td className="px-6 py-5 text-sm font-bold text-zinc-300">Dr. {payment.doctorName}</td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-sm font-black text-emerald-400">
                            <IndianRupee className="w-3.5 h-3.5 mr-0.5" />{payment.amount?.toLocaleString('en-IN')}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm font-bold text-zinc-300">{new Date(payment.createdAt).toLocaleDateString('en-IN')}</p>
                          <p className="text-[11px] text-zinc-500 font-bold mt-1 tracking-wider uppercase">{new Date(payment.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                        </td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                            payment.status === 'refunded' 
                              ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' 
                              : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${payment.status === 'refunded' ? 'bg-rose-500' : 'bg-emerald-500'}`} />
                            {payment.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-white/5 flex justify-end">
              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 bg-white/5 px-4 py-2 rounded-full border border-white/5">
                {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
};

export default AdminPayments;
