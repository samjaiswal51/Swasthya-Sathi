import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, XCircle, CreditCard, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const map = {
    pending_approval: 'bg-amber-500/15 text-amber-400 border border-amber-500/25',
    confirmed:        'bg-blue-500/15 text-blue-400 border border-blue-500/25 shadow-[0_0_8px_rgba(37,99,235,0.2)]',
    completed:        'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25',
    cancelled:        'bg-rose-500/15 text-rose-400 border border-rose-500/25',
  };
  const label = status === 'pending_approval' ? 'Pending Approval' : status;
  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${map[status] || map.confirmed}`}>
      {label}
    </span>
  );
};

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/appointments/patient', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAppointments(res.data);
    } catch (err) {
      toast.error('Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/appointments/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Appointment cancelled successfully');
      fetchAppointments();
    } catch (err) {
      toast.error('Failed to cancel appointment');
    }
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-24 gap-4">
      <div className="relative w-14 h-14">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute" />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-500 absolute top-2 left-2" />
      </div>
      <p className="text-slate-400 text-sm font-medium">Loading your appointments...</p>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-5xl mx-auto space-y-6 relative"
    >
      {/* Ambient orb */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl bg-blue-600/6 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/25 rounded-xl flex items-center justify-center">
            <Calendar className="w-5 h-5 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.6))' }} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight border-l-[3px] border-l-blue-500 pl-3">
              My Appointments
            </h2>
            <p className="text-slate-400 text-sm mt-0.5 pl-3">View and manage your upcoming consultations.</p>
          </div>
        </div>
        {appointments.length > 0 && (
          <span className="px-4 py-1.5 rounded-full text-xs font-extrabold
                           bg-blue-500/15 border border-blue-500/25 text-blue-300">
            {appointments.length} Appointment{appointments.length !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {appointments.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-3xl p-16 text-center
                     shadow-[0_10px_40px_rgba(37,99,235,0.06)]"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-20 h-20 mx-auto mb-5 rounded-2xl
                       bg-blue-500/10 border border-blue-500/20
                       shadow-[0_0_30px_rgba(37,99,235,0.15)]
                       flex items-center justify-center"
          >
            <Calendar className="w-10 h-10 text-blue-500/50" />
          </motion.div>
          <h3 className="text-xl font-extrabold text-slate-100 mb-2">No Appointments Yet</h3>
          <p className="text-slate-400 text-sm mb-6 max-w-xs mx-auto">Book an appointment with a doctor to get started.</p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/patient-dashboard/find-doctor')}
            className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white rounded-xl
                       font-extrabold shadow-[0_4px_16px_rgba(37,99,235,0.4)]
                       hover:shadow-[0_0_24px_rgba(37,99,235,0.55)] transition-all duration-300"
          >
            Find a Doctor
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
        >
          {appointments.map((apt) => (
            <motion.div
              key={apt._id}
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
              whileHover={{ y: -4 }}
              className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl overflow-hidden
                         hover:border-blue-500/25 hover:shadow-[0_20px_50px_rgba(37,99,235,0.15)]
                         shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 flex flex-col"
            >
              {/* Top accent */}
              <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 flex-shrink-0" />

              {/* Doctor info */}
              <div className="p-5 border-b border-white/6 flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600/25 to-cyan-500/15
                                border border-blue-400/25 flex items-center justify-center
                                font-bold text-blue-300 text-lg overflow-hidden flex-shrink-0">
                  {apt.doctorId?.profilePhoto
                    ? <img src={apt.doctorId.profilePhoto} alt="Doctor" className="w-full h-full object-cover" />
                    : apt.doctorId?.name?.charAt(0) || 'D'
                  }
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-100 text-sm truncate">{apt.doctorId?.name || 'Dr. Unknown'}</h4>
                  <p className="text-xs text-slate-500 truncate">{apt.doctorId?.email || 'N/A'}</p>
                </div>
              </div>

              {/* Info rows */}
              <div className="p-5 space-y-2.5 flex-1">
                <div className="flex items-center justify-between mb-3">
                  <StatusBadge status={apt.appointmentStatus} />
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    apt.paymentStatus === 'paid'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
                      : 'bg-white/5 text-slate-500 border border-white/8'
                  }`}>
                    {apt.paymentStatus}
                  </span>
                </div>

                {[
                  { icon: <Calendar className="w-3.5 h-3.5 text-blue-400" />, value: new Date(apt.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }) },
                  { icon: <Clock className="w-3.5 h-3.5 text-cyan-400" />, value: apt.time },
                  { icon: <MapPin className="w-3.5 h-3.5 text-indigo-400" />, value: `${apt.consultationType} Consultation` },
                  { icon: <CreditCard className="w-3.5 h-3.5 text-emerald-400" />, value: `₹${apt.fee}` },
                ].map(({ icon, value }, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm">
                    <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                      {icon}
                    </div>
                    <span className="text-slate-300 font-medium text-xs">{value}</span>
                  </div>
                ))}
              </div>

              {/* Actions */}
              {apt.appointmentStatus === 'confirmed' && (
                <div className="p-4 border-t border-white/6 grid grid-cols-2 gap-2">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/patient-dashboard/chat', { state: { openChatWith: apt.doctorId?._id } })}
                    className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-extrabold
                               text-blue-400 bg-blue-500/10 border border-blue-500/20
                               hover:bg-blue-500/20 hover:border-blue-500/35
                               hover:shadow-[0_0_12px_rgba(37,99,235,0.2)] transition-all duration-200"
                  >
                    <MessageCircle className="w-4 h-4" /> Message
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { if(window.confirm('Are you sure you want to cancel this appointment?')) handleCancel(apt._id); }}
                    className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-extrabold
                               text-rose-400 bg-rose-500/8 border border-rose-500/18
                               hover:bg-rose-500/15 hover:border-rose-500/30
                               hover:shadow-[0_0_10px_rgba(244,63,94,0.15)] transition-all duration-200"
                  >
                    <XCircle className="w-4 h-4" /> Cancel
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyAppointments;
