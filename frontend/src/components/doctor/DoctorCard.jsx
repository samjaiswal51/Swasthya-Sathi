import React from 'react';
import { MapPin, Building2, IndianRupee, Clock, Shield, Heart, MessageSquare, CalendarCheck, UserPlus, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const DAYS_SHORT = { Mon: 'M', Tue: 'T', Wed: 'W', Thu: 'T', Fri: 'F', Sat: 'S', Sun: 'S' };
const ALL_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DoctorCard = ({ doctor, onView, onChat, onFavorite, isFavorite, connectionStatus, onConnect, onFollow, isFollowing }) => {
  const d = doctor;
  const navigate = useNavigate();
  const initial = d.fullName?.charAt(0)?.toUpperCase() || 'D';
  const todayDay = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][new Date().getDay()];
  const availableToday = d.availability?.days?.includes(todayDay);
  const doctorUserId = d.user?._id || d.user;

  const modeColor = {
    Online:  'bg-blue-500/15 text-blue-400 border border-blue-500/25',
    Offline: 'bg-slate-500/15 text-slate-300 border border-slate-500/20',
    Both:    'bg-cyan-500/15 text-cyan-400 border border-cyan-500/25',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden group
                 hover:border-blue-500/30 hover:shadow-[0_25px_70px_rgba(37,99,235,0.25)]
                 shadow-[0_10px_40px_rgba(37,99,235,0.08)] transition-all duration-300 flex flex-col"
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-400 flex-shrink-0" />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row */}
        <div className="flex gap-4">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-[72px] h-[72px] rounded-2xl overflow-hidden border-2 border-blue-500/20
                            bg-gradient-to-br from-blue-600/20 to-cyan-500/20
                            shadow-[0_0_20px_rgba(37,99,235,0.2)]">
              {d.profilePhoto
                ? <img src={d.profilePhoto} alt={d.fullName} className="w-full h-full object-cover" />
                : <div className="w-full h-full flex items-center justify-center text-2xl font-bold text-blue-400">{initial}</div>
              }
            </div>
            {/* Verified badge */}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="absolute -bottom-1 -right-1 bg-gradient-to-br from-blue-500 to-cyan-500
                         text-white rounded-full p-1 border-2 border-[#0F172A] shadow-[0_0_8px_rgba(37,99,235,0.6)]"
              title="Verified Doctor"
            >
              <Shield className="w-2.5 h-2.5" />
            </motion.div>
          </div>

          {/* Name + specialty */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <h3 className="font-bold text-slate-100 text-base group-hover:text-blue-400 transition-colors truncate">
                {d.fullName}
              </h3>
              <motion.button
                whileTap={{ scale: 1.3 }}
                onClick={() => onFavorite?.(d._id)}
                className={`flex-shrink-0 p-1.5 rounded-xl transition-all duration-200 ${
                  isFavorite
                    ? 'bg-red-500/20 text-red-400 shadow-[0_0_10px_rgba(239,68,68,0.3)]'
                    : 'bg-white/5 text-slate-500 hover:bg-red-500/15 hover:text-red-400'
                }`}
              >
                <Heart className="w-4 h-4" fill={isFavorite ? 'currentColor' : 'none'} />
              </motion.button>
            </div>
            <p className="text-blue-400 font-semibold text-sm mt-0.5">{d.specialization}</p>
            <p className="text-slate-500 text-xs mt-0.5 uppercase tracking-wider font-medium">{d.degree}</p>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className={`text-xs font-semibold px-2 py-1 rounded-full ${modeColor[d.consultationMode] || modeColor.Both}`}>
                {d.consultationMode}
              </span>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${
                availableToday
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/25'
              }`}>
                {availableToday ? '🟢 Available Today' : '🟡 Check Schedule'}
              </span>
            </div>
          </div>
        </div>

        {/* Info rows */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <span className="truncate">{d.hospitalName || '—'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 text-sm">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="truncate">{[d.city, d.state].filter(Boolean).join(', ') || '—'}</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-slate-400 text-sm">
              <div className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <span>{d.experienceYears || '—'} yrs experience</span>
            </div>
            <div className="flex items-center gap-1 text-blue-400 font-bold text-sm bg-blue-500/10 px-2 py-1 rounded-lg border border-blue-500/20">
              <IndianRupee className="w-3 h-3" />
              <span>{d.consultationFee || '—'}</span>
            </div>
          </div>
        </div>

        {/* Availability days strip */}
        {d.availability?.days?.length > 0 && (
          <div className="mt-3 flex gap-1">
            {ALL_DAYS.map(day => (
              <span key={day}
                className={`w-7 h-7 rounded-lg text-xs font-bold flex items-center justify-center transition-all ${
                  d.availability.days.includes(day)
                    ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_0_8px_rgba(37,99,235,0.4)]'
                    : 'bg-white/5 text-slate-600'
                }`}>
                {DAYS_SHORT[day]}
              </span>
            ))}
          </div>
        )}

        {/* Action buttons */}
        <div className="mt-4 pt-4 border-t border-white/5 space-y-2 mt-auto">
          {/* Top row: View Profile + Follow */}
          <div className="grid grid-cols-2 gap-2">
            <motion.button
              whileTap={{ scale: 0.96 }}
              onClick={() => onView?.(d)}
              className="py-2.5 rounded-xl border border-white/10 text-slate-300 text-xs font-bold
                         hover:bg-blue-500/10 hover:border-blue-500/30 hover:text-blue-400
                         transition-all flex items-center justify-center gap-1 backdrop-blur-sm"
            >
              Profile
            </motion.button>

            {/* Follow / Following Button */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={(e) => { e.stopPropagation(); onFollow?.(d); }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 border ${
                isFollowing
                  ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-red-500/10 hover:border-red-500/25 hover:text-red-400'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 border-transparent text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.5)]'
              }`}
            >
              {isFollowing ? (
                <><UserCheck className="w-3.5 h-3.5" />Following</>
              ) : (
                <><UserPlus className="w-3.5 h-3.5" />Follow</>
              )}
            </motion.button>
          </div>

          {/* Bottom row: Chat / Connect / Book */}
          <div className="grid grid-cols-1 gap-2">
            {connectionStatus === 'active' ? (
              <div className="grid grid-cols-2 gap-2">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => { e.stopPropagation(); onChat?.(d); }}
                  className="py-2.5 rounded-xl border border-blue-500/25 text-blue-400 text-xs font-bold
                             hover:bg-blue-500/15 hover:border-blue-500/40
                             transition-all flex items-center justify-center gap-1 backdrop-blur-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" /> Chat
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={(e) => { e.stopPropagation(); navigate(`/patient-dashboard/book-appointment/${doctorUserId}`); }}
                  className="py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-bold
                             hover:shadow-[0_0_20px_rgba(37,99,235,0.5)] transition-all
                             shadow-[0_4px_14px_rgba(37,99,235,0.3)] flex items-center justify-center gap-1"
                >
                  <CalendarCheck className="w-3.5 h-3.5" /> Book
                </motion.button>
              </div>
            ) : connectionStatus === 'pending' ? (
              <button
                disabled
                className="w-full py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-bold flex items-center justify-center gap-1"
              >
                <Clock className="w-3.5 h-3.5" /> Pending Approval
              </button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={(e) => { e.stopPropagation(); onConnect?.(d); }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500
                           text-white text-xs font-bold transition-all
                           shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_0_24px_rgba(37,99,235,0.5)]
                           flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5" /> Connect as Patient
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DoctorCard;
