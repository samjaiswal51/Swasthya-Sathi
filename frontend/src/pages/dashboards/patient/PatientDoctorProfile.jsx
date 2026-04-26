import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, MapPin, Building2, Clock, Globe, Shield, Heart,
  MessageSquare, CalendarCheck, IndianRupee, Award,
} from 'lucide-react';

const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const PatientDoctorProfile = ({ doctor: d, isFavorite, onFavorite, onClose }) => {
  const navigate = useNavigate();
  const [chatLoading, setChatLoading] = useState(false);
  const todayDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
  const availableToday = d.availability?.days?.includes(todayDay);

  const handleChatNow = async () => {
    setChatLoading(true);
    try {
      // d.user holds the User ObjectId of the doctor
      const doctorUserId = d.user?._id || d.user;
      await axios.post('http://localhost:5000/api/chat/conversations', {
        participantId: doctorUserId,
      });
      onClose();
      navigate('/patient-dashboard/chat', { state: { openChatWith: doctorUserId } });
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setChatLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-[#030712]/80 backdrop-blur-[10px] z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 40 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="bg-[#0A1628]/95 backdrop-blur-2xl border border-white/10
                     w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl
                     shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(37,99,235,0.12)]
                     max-h-[92vh] flex flex-col overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Drag handle (mobile) */}
          <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

          {/* Header / hero */}
          <div className="relative flex-shrink-0 overflow-hidden">
            {/* Gradient bg */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-[#0F172A]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.3)_0%,transparent_60%)]" />
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-blue-500/10 blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-cyan-500/10 blur-2xl" />

            <div className="relative p-6 text-white">
              <button onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all border border-white/10">
                <X className="w-4 h-4" />
              </button>

              <div className="flex gap-5">
                {/* Photo */}
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-blue-400/40
                                shadow-[0_0_30px_rgba(37,99,235,0.4)] flex-shrink-0
                                bg-gradient-to-br from-blue-600/30 to-cyan-500/20">
                  {d.profilePhoto
                    ? <img src={d.profilePhoto} alt={d.fullName} className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-blue-300">
                        {d.fullName?.charAt(0) || 'D'}
                      </div>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start gap-2">
                    <h2 className="text-xl font-extrabold leading-tight truncate text-white">{d.fullName}</h2>
                    <motion.button
                      whileTap={{ scale: 1.3 }}
                      onClick={() => onFavorite?.(d._id)}
                      className={`flex-shrink-0 p-1.5 rounded-xl transition-all duration-200 border ${
                        isFavorite
                          ? 'bg-red-500/30 text-red-300 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                          : 'bg-white/10 text-white/50 border-white/10 hover:bg-red-500/25 hover:text-red-300'
                      }`}
                    >
                      <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
                    </motion.button>
                  </div>
                  <p className="text-blue-300 font-semibold text-sm mt-0.5">{d.specialization}</p>
                  <p className="text-blue-400/70 text-xs mt-0.5">{d.degree} · {d.experienceYears} yrs exp</p>

                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    <span className="flex items-center gap-1 text-xs bg-blue-500/30 border border-blue-400/30 text-blue-200 px-2.5 py-1 rounded-full font-semibold">
                      <Shield className="w-3 h-3" /> Verified
                    </span>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold border ${
                      availableToday
                        ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300'
                        : 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                    }`}>
                      {availableToday ? '🟢 Available Today' : '🟡 Check Schedule'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
            {/* Fee + mode */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-center
                              shadow-[0_0_20px_rgba(37,99,235,0.08)]">
                <p className="text-xs text-blue-400 font-medium mb-1">Consultation Fee</p>
                <div className="flex items-center justify-center gap-1 text-blue-300 font-extrabold text-xl">
                  <IndianRupee className="w-4 h-4" />{d.consultationFee || '—'}
                </div>
              </div>
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-2xl p-4 text-center
                              shadow-[0_0_20px_rgba(6,182,212,0.08)]">
                <p className="text-xs text-cyan-400 font-medium mb-1">Consultation Mode</p>
                <p className="text-cyan-300 font-extrabold text-lg">{d.consultationMode || '—'}</p>
              </div>
            </div>

            {/* About */}
            {d.bio && (
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">About</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{d.bio}</p>
              </div>
            )}

            {/* Clinic info */}
            <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
              <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Clinic Info</h4>
              <div className="space-y-2.5">
                {d.hospitalName && (
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 bg-blue-500/15 border border-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-4 h-4 text-blue-400" />
                    </div>
                    {d.hospitalName}
                  </div>
                )}
                {(d.clinicAddress || d.city) && (
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 bg-cyan-500/15 border border-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-cyan-400" />
                    </div>
                    <span>{[d.clinicAddress, d.city, d.state].filter(Boolean).join(', ')}</span>
                  </div>
                )}
                {d.registrationNumber && (
                  <div className="flex items-center gap-3 text-sm text-slate-300">
                    <div className="w-8 h-8 bg-indigo-500/15 border border-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Award className="w-4 h-4 text-indigo-400" />
                    </div>
                    Reg. No: {d.registrationNumber}
                  </div>
                )}
              </div>
            </div>

            {/* Availability */}
            {d.availability?.days?.length > 0 && (
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-3">Availability</h4>
                <div className="flex gap-1.5 mb-3">
                  {ALL_DAYS.map(day => (
                    <span key={day}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold text-center transition-all ${
                        d.availability.days.includes(day)
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)]'
                          : 'bg-white/5 text-slate-600'
                      }`}>
                      {day.slice(0, 1)}
                    </span>
                  ))}
                </div>
                <div className="flex gap-3 flex-wrap">
                  {d.availability.morningStart && (
                    <div className="flex items-center gap-2 text-sm text-amber-300 bg-amber-500/10 border border-amber-500/20 rounded-xl px-3 py-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      {d.availability.morningStart} – {d.availability.morningEnd}
                    </div>
                  )}
                  {d.availability.eveningStart && (
                    <div className="flex items-center gap-2 text-sm text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-xl px-3 py-2">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      {d.availability.eveningStart} – {d.availability.eveningEnd}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Languages */}
            {d.languages?.length > 0 && (
              <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-4">
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-2">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {d.languages.map(l => (
                    <span key={l}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                                 bg-blue-500/15 border border-blue-500/25 text-blue-300 text-sm font-semibold">
                      <Globe className="w-3 h-3" /> {l}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action buttons — sticky footer */}
          <div className="flex-shrink-0 p-4 border-t border-white/8
                          bg-[#0A1628]/80 backdrop-blur-xl">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleChatNow}
              disabled={chatLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl
                         bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold text-sm
                         hover:shadow-[0_0_28px_rgba(37,99,235,0.55)] transition-all duration-200
                         shadow-[0_4px_20px_rgba(37,99,235,0.4)] disabled:opacity-60"
            >
              {chatLoading
                ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : <MessageSquare className="w-4 h-4" />} Chat Now
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PatientDoctorProfile;
