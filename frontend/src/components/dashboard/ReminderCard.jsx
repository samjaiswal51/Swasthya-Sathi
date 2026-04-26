import React from 'react';
import { Pill, Clock, Edit, Trash2, CheckCircle2, XCircle, AlertCircle, Pause, Play, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const glass = "bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl";
const glassHover = "hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300";

const ReminderCard = ({ reminder, onEdit, onDelete, onAction }) => {
  const isPaused = reminder.status === 'paused';

  const formatTime = (time) => time; // It's already "08:00 AM"

  const getMealBadgeColor = (meal) => {
    switch (meal) {
      case 'Before Meal': return 'bg-[rgba(245,158,11,0.12)] text-amber-400 border border-[rgba(245,158,11,0.25)] rounded-full';
      case 'After Meal': return 'bg-[rgba(16,185,129,0.12)] text-emerald-400 border border-[rgba(16,185,129,0.25)] rounded-full';
      case 'Empty Stomach': return 'bg-[rgba(244,63,94,0.12)] text-rose-400 border border-[rgba(244,63,94,0.25)] rounded-full';
      case 'With Food': return 'bg-[rgba(37,99,235,0.12)] text-blue-400 border border-[rgba(59,130,246,0.25)] rounded-full';
      default: return 'bg-[rgba(255,255,255,0.05)] text-slate-400 border border-[rgba(255,255,255,0.1)] rounded-full';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className={isPaused 
        ? "bg-[rgba(255,255,255,0.015)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.06)] rounded-2xl p-5 opacity-60 flex flex-col h-full"
        : `${glass} ${glassHover} p-5 flex flex-col h-full`
      }
    >
      
      {/* Top Section */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={isPaused 
            ? "w-12 h-12 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] rounded-xl flex items-center justify-center text-slate-600"
            : "w-12 h-12 bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.22)] rounded-xl flex items-center justify-center shadow-[0_0_14px_rgba(37,99,235,0.2)] text-blue-400"
          } style={!isPaused ? { filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.6))' } : {}}>
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isPaused ? 'text-slate-500' : 'text-slate-100'}`}>{reminder.medicineName}</h3>
            <p className="text-sm font-medium text-slate-400">{reminder.dose} {reminder.purpose && `• ${reminder.purpose}`}</p>
          </div>
        </div>
        
        {/* Top Right Actions */}
        <div className="flex space-x-1">
          <button onClick={() => onEdit(reminder)} className="p-1.5 rounded-lg text-slate-500 border border-transparent hover:text-blue-400 hover:bg-[rgba(37,99,235,0.08)] hover:border-[rgba(59,130,246,0.20)] transition-all duration-200">
            <Edit className="w-4 h-4" />
          </button>
          <button onClick={() => onAction(reminder._id, 'Paused')} className="p-1.5 rounded-lg text-slate-500 border border-transparent hover:text-amber-400 hover:bg-[rgba(245,158,11,0.08)] hover:border-[rgba(245,158,11,0.20)] transition-all duration-200" title={isPaused ? "Resume" : "Pause"}>
            {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
          </button>
          <button onClick={() => onDelete(reminder._id)} className="p-1.5 rounded-lg text-slate-500 border border-transparent hover:text-rose-400 hover:bg-[rgba(244,63,94,0.08)] hover:border-[rgba(244,63,94,0.20)] transition-all duration-200">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Schedule Info */}
      <div className="flex-1 space-y-3 mb-6">
        <div className="flex items-start space-x-2 text-sm">
          <Clock className="w-4 h-4 text-slate-500 mt-0.5" />
          <div>
            <span className="text-slate-300 font-medium text-sm">{reminder.frequency}</span>
            <div className="flex flex-wrap gap-1 mt-1.5">
              {reminder.times.map(time => (
                <span key={time} className={isPaused
                  ? "bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.06)] text-slate-500 px-2 py-1 text-xs font-bold rounded-md"
                  : "bg-[rgba(37,99,235,0.12)] border border-[rgba(59,130,246,0.22)] text-blue-300 px-2 py-1 text-xs font-bold rounded-md"
                }>
                  {formatTime(time)}
                </span>
              ))}
            </div>
          </div>
        </div>

        {reminder.mealTiming !== 'Any Time' && (
          <div className="flex items-center space-x-2 text-sm mt-3">
            <span className={`px-2.5 py-0.5 text-xs font-medium ${getMealBadgeColor(reminder.mealTiming)}`}>
              {reminder.mealTiming}
            </span>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {!isPaused ? (
        <div className="grid grid-cols-2 gap-2 mt-auto pt-4 border-t border-[rgba(59,130,246,0.08)]">
          <motion.button 
            whileTap={{ scale: 0.93 }}
            onClick={() => onAction(reminder._id, 'Taken', reminder.times[0])} // Approximating closest time for simplicity
            className="flex items-center justify-center space-x-2 py-2.5 bg-[rgba(16,185,129,0.10)] border border-[rgba(16,185,129,0.20)] text-emerald-400 font-bold text-sm rounded-xl hover:bg-[rgba(16,185,129,0.18)] hover:border-[rgba(16,185,129,0.35)] hover:shadow-[0_0_12px_rgba(16,185,129,0.2)] transition-all duration-200"
          >
            <CheckCircle2 className="w-4 h-4" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))' }} />
            <span>Taken</span>
          </motion.button>
          <div className="grid grid-cols-2 gap-2">
            <motion.button 
              whileTap={{ scale: 0.93 }}
              onClick={() => onAction(reminder._id, 'Snoozed', reminder.times[0])}
              className="flex items-center justify-center py-2.5 bg-[rgba(245,158,11,0.10)] border border-[rgba(245,158,11,0.20)] text-amber-400 rounded-xl hover:bg-[rgba(245,158,11,0.18)] hover:border-[rgba(245,158,11,0.35)] hover:shadow-[0_0_12px_rgba(245,158,11,0.2)] transition-all duration-200"
              title="Snooze 10 mins"
            >
              <AlertCircle className="w-4 h-4" />
            </motion.button>
            <motion.button 
              whileTap={{ scale: 0.93 }}
              onClick={() => onAction(reminder._id, 'Skipped', reminder.times[0])}
              className="flex items-center justify-center py-2.5 bg-[rgba(244,63,94,0.10)] border border-[rgba(244,63,94,0.20)] text-rose-400 rounded-xl hover:bg-[rgba(244,63,94,0.18)] hover:border-[rgba(244,63,94,0.35)] hover:shadow-[0_0_12px_rgba(244,63,94,0.2)] transition-all duration-200"
              title="Skip Dose"
            >
              <XCircle className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
      ) : (
        <div className="mt-auto pt-4 border-t border-[rgba(255,255,255,0.04)] text-center">
          <span className="text-sm font-medium text-slate-500 tracking-wide italic">Reminder Paused</span>
        </div>
      )}
    </motion.div>
  );
};

export default ReminderCard;
