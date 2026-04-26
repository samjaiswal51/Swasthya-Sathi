import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Calendar as CalendarIcon, Clock, Save, Trash2, PlusCircle, IndianRupee, Globe, Video, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ManageAvailability = () => {
  const [loading, setLoading] = useState(true);
  const [availabilities, setAvailabilities] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form State
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('17:00');
  const [feePerHour, setFeePerHour] = useState(500);
  const [mode, setMode] = useState('Both');

  useEffect(() => {
    fetchAvailabilities();
  }, []);

  const fetchAvailabilities = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/availability/my', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailabilities(res.data);
    } catch (err) {
      toast.error('Failed to load availability', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveDate = async (e) => {
    e.preventDefault();
    if (!date) return toast.error('Please select a date');
    
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/availability/add', {
        date, startTime, endTime, mode, feePerHour
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`Availability added for ${date}`, { style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' } });
      setShowAddForm(false);
      setDate('');
      fetchAvailabilities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add availability', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this availability date?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/availability/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Availability deleted successfully', { style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' } });
      fetchAvailabilities();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const upcomingAvailabilities = availabilities.filter(a => a.date >= today);

  const inputCls = "w-full pl-11 pr-4 py-3.5 rounded-2xl border-2 border-slate-200/80 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-slate-800 font-extrabold transition-all shadow-sm";
  const iconCls = "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5";

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-32 gap-4">
      <div className="relative w-16 h-16">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
      </div>
      <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-emerald-600/80 text-sm font-extrabold tracking-widest uppercase">
        Loading Schedule...
      </motion.p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-2xl p-6 sm:p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.04)] border border-slate-200/80 gap-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <CalendarIcon className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">Manage Availability</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Configure your schedule for specific dates.</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-lg w-full md:w-auto justify-center ${
            showAddForm 
              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200 shadow-none' 
              : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-emerald-500/25'
          }`}
        >
          {showAddForm ? 'Close Form' : <><PlusCircle className="w-5 h-5" /> Add New Date</>}
        </motion.button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div 
            initial={{ opacity: 0, height: 0, scale: 0.95 }} 
            animate={{ opacity: 1, height: 'auto', scale: 1 }} 
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            className="overflow-hidden"
          >
            <div className="bg-white/90 backdrop-blur-xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.06)] border-2 border-emerald-500/10 mb-8">
              <h3 className="text-sm font-extrabold text-emerald-600 uppercase tracking-widest mb-8 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Configure New Date
              </h3>
              
              <form onSubmit={handleSaveDate} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">Select Date *</label>
                  <div className="relative group">
                    <CalendarIcon className={iconCls} />
                    <input type="date" min={today} required value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">Start Time *</label>
                    <div className="relative group">
                      <Clock className={iconCls} />
                      <input type="time" required value={startTime} onChange={(e) => setStartTime(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">End Time *</label>
                    <div className="relative group">
                      <Clock className={iconCls} />
                      <input type="time" required value={endTime} onChange={(e) => setEndTime(e.target.value)} className={inputCls} />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">Consultation Mode *</label>
                  <div className="relative group">
                    <Globe className={iconCls} />
                    <select value={mode} onChange={(e) => setMode(e.target.value)} className={inputCls}>
                      <option value="Online">Online Video</option>
                      <option value="Offline">Clinic Visit</option>
                      <option value="Both">Both (Patient Choice)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-2">Hourly Fee (₹) *</label>
                  <div className="relative group">
                    <IndianRupee className={iconCls} />
                    <input type="number" required value={feePerHour} onChange={(e) => setFeePerHour(Number(e.target.value))} className={inputCls} />
                  </div>
                </div>

                <div className="md:col-span-2 pt-4">
                  <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} type="submit" 
                    className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#022C22] text-white font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-[#022C22]/20 hover:bg-[#064E3B] transition-colors">
                    <Save className="w-5 h-5" /> Save Availability Schedule
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Title */}
      <h3 className="text-xl font-extrabold text-slate-800 pl-4 border-l-4 border-emerald-500">Upcoming Configured Dates</h3>
      
      {/* Cards Section */}
      {upcomingAvailabilities.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-[3rem] shadow-sm flex flex-col items-center">
          <div className="w-20 h-20 bg-emerald-50 text-emerald-400 rounded-full flex items-center justify-center mb-6 shadow-inner border border-emerald-100/50">
            <CalendarIcon className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mb-2">No upcoming availability configured</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto mb-6">Create your schedule to allow patients to book appointments with you.</p>
          <button onClick={() => setShowAddForm(true)} className="text-emerald-600 font-extrabold hover:text-emerald-700 hover:underline">
            + Add your first date
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden" animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
        >
          {upcomingAvailabilities.map((avail, i) => (
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              whileHover={{ y: -4 }}
              key={avail._id} 
              className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-6 border border-slate-200/80 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] hover:border-emerald-200 relative overflow-hidden group transition-all"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleDelete(avail._id)}
                  className="w-10 h-10 bg-rose-50 border border-rose-100 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm"
                  title="Delete Date"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-[1.25rem] bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-700 flex flex-col items-center justify-center font-extrabold border border-emerald-200/50 shadow-inner">
                  <span className="text-2xl leading-none tracking-tight">{avail.date.split('-')[2]}</span>
                  <span className="text-[10px] uppercase tracking-widest mt-0.5">{new Date(avail.date).toLocaleString('default', { month: 'short' })}</span>
                </div>
                <div className="pt-1">
                  <h4 className="text-lg font-extrabold text-slate-800">{new Date(avail.date).toLocaleDateString('en-US', { weekday: 'long' })}</h4>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-100/50 text-emerald-600 inline-block mt-1.5">
                    {avail.slots.filter(s => !s.booked).length} Slots Free
                  </p>
                </div>
              </div>

              <div className="space-y-3 bg-slate-50/80 p-5 rounded-[1.5rem] border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-teal-500"><Clock className="w-4 h-4"/></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Time Range</p>
                    <p className="text-sm font-extrabold text-slate-700">{avail.startTime} - {avail.endTime}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-green-500"><IndianRupee className="w-4 h-4"/></div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Consultation Fee</p>
                    <p className="text-sm font-extrabold text-slate-700">₹{avail.feePerHour} / hr</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm text-emerald-500">
                    {avail.mode === 'Online' ? <Video className="w-4 h-4"/> : avail.mode === 'Offline' ? <User className="w-4 h-4"/> : <Globe className="w-4 h-4"/>}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Mode</p>
                    <p className="text-sm font-extrabold text-slate-700">{avail.mode}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ManageAvailability;
