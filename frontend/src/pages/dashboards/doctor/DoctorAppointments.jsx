import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, CreditCard, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const map = {
    pending_approval: 'bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.15)]',
    confirmed:        'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.15)]',
    completed:        'bg-teal-500/10 text-teal-600 border border-teal-500/20',
    cancelled:        'bg-rose-500/10 text-rose-500 border border-rose-500/20',
  };
  const label = status === 'pending_approval' ? 'Pending Approval' : status;
  return (
    <span className={`px-3 py-1.5 rounded-full text-[10px] font-extrabold uppercase tracking-widest backdrop-blur-md ${map[status] || map.confirmed}`}>
      {label}
    </span>
  );
};

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/appointments/doctor', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      toast.error('Failed to load appointments', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, action) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/appointments/${id}/${action}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const actionMap = { approve: 'approved', reject: 'rejected', complete: 'completed', cancel: 'cancelled' };
      toast.success(`Appointment ${actionMap[action]}`, { style: { background: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' } });
      fetchAppointments();
    } catch (err) {
      toast.error(`Failed to update appointment status`, { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-32 gap-4">
      <div className="relative w-16 h-16">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-4 border-transparent border-b-teal-400 border-l-teal-400 absolute top-2 left-2" />
      </div>
      <motion.p animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 2 }} className="text-emerald-600/80 text-sm font-extrabold tracking-widest uppercase">
        Loading Appointments...
      </motion.p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-6xl mx-auto space-y-8 pb-12 relative"
    >
      {/* Header Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden bg-gradient-to-br from-[#022C22] via-[#064E3B] to-emerald-900 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_20px_60px_rgba(16,185,129,0.15)] border border-emerald-500/20">
        
        {/* Floating Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-400/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 bg-white/10 border border-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center shadow-inner">
              <Calendar className="w-8 h-8 text-emerald-300" style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.5))' }} />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-1 drop-shadow-sm">Appointments</h1>
              <p className="text-emerald-50/80 text-sm font-medium">Manage your upcoming and completed consultations.</p>
            </div>
          </div>
          {appointments.length > 0 && (
            <div className="px-5 py-2.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md text-emerald-100 font-extrabold text-sm shadow-sm">
              {appointments.length} Total Appointments
            </div>
          )}
        </div>
      </motion.div>

      {/* Content */}
      {appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-[3rem] p-16 text-center shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
        >
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-emerald-50 border border-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.1)] flex items-center justify-center"
          >
            <Calendar className="w-12 h-12 text-emerald-400" />
          </motion.div>
          <h3 className="text-2xl font-extrabold text-slate-800 mb-2">No Appointments Yet</h3>
          <p className="text-slate-500 font-medium max-w-sm mx-auto">When patients book slots with you, they will appear here in your schedule.</p>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
        >
          {appointments.map((apt) => (
            <motion.div
              key={apt._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
              whileHover={{ y: -6 }}
              className="bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-[2.5rem] overflow-hidden hover:border-emerald-300 hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all duration-300 flex flex-col group"
            >
              {/* Top Accent Line */}
              <div className="h-1.5 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-300 flex-shrink-0" />

              {/* Patient Info + Status */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[1rem] bg-gradient-to-br from-emerald-100 to-teal-50 border border-emerald-200/50 flex items-center justify-center flex-shrink-0 shadow-inner">
                      <User className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-extrabold text-slate-800 text-base truncate group-hover:text-emerald-700 transition-colors">{apt.patientId?.name || 'Patient'}</h4>
                      <p className="text-xs font-semibold text-slate-400 truncate">{apt.patientId?.email || 'N/A'}</p>
                    </div>
                  </div>
                </div>
                <div className="self-start">
                  <StatusBadge status={apt.appointmentStatus} />
                </div>
              </div>

              {/* Details Info Rows */}
              <div className="p-6 space-y-3.5 flex-1 bg-white">
                {[
                  { icon: <Calendar className="w-4 h-4 text-emerald-500" />, value: new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
                  { icon: <Clock className="w-4 h-4 text-teal-500" />, value: apt.time },
                  { icon: <CreditCard className="w-4 h-4 text-green-500" />, value: <span className="font-extrabold">{apt.paymentStatus} (₹{apt.fee})</span> },
                  { icon: <MapPin className="w-4 h-4 text-emerald-400" />, value: apt.consultationType },
                ].map(({ icon, value }, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 border border-emerald-100/50 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {icon}
                    </div>
                    <span className="text-slate-600 font-bold text-xs uppercase tracking-wide">{value}</span>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="p-5 border-t border-slate-100 bg-slate-50/50">
                {apt.appointmentStatus === 'pending_approval' && (
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(apt._id, 'approve')}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] transition-all">
                      <CheckCircle className="w-4 h-4" /> Approve
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(apt._id, 'reject')}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-extrabold border-2 border-rose-100 bg-white text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all">
                      <XCircle className="w-4 h-4" /> Cancel & Refund
                    </motion.button>
                  </div>
                )}

                {apt.appointmentStatus === 'confirmed' && (
                  <div className="grid grid-cols-2 gap-3">
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(apt._id, 'complete')}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] transition-all">
                      <CheckCircle className="w-4 h-4" /> Complete
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleStatusUpdate(apt._id, 'cancel')}
                      className="flex flex-col items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-extrabold border-2 border-rose-100 bg-white text-rose-500 hover:bg-rose-50 hover:border-rose-200 transition-all">
                      <XCircle className="w-4 h-4" /> Cancel & Refund
                    </motion.button>
                  </div>
                )}

                {apt.appointmentStatus === 'completed' && (
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold text-teal-600 bg-teal-50 border border-teal-100">
                    <CheckCircle className="w-4 h-4" /> Consultation Completed
                  </div>
                )}

                {apt.appointmentStatus === 'cancelled' && (
                  <div className="flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-extrabold text-slate-400 bg-slate-100 border border-slate-200">
                    <XCircle className="w-4 h-4" /> Cancelled
                  </div>
                )}
              </div>

            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default DoctorAppointments;
