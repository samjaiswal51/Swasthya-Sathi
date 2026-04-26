import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, delay = 0 }) => {
  // Overriding colorClass completely to enforce the GREEN palette for ALL cards.
  // Instead of using multi-colored cards, we make them premium emerald/teal glass cards.
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, type: "spring", stiffness: 100 }}
      whileHover={{ y: -6 }}
      className="bg-white/80 backdrop-blur-2xl p-6 rounded-[2rem] shadow-[0_10px_40px_rgba(16,185,129,0.05)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.15)] border border-emerald-500/10 relative overflow-hidden group transition-shadow"
    >
      {/* Decorative top accent strip */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-teal-400 opacity-50 group-hover:opacity-100 transition-opacity" />

      {/* Abstract radial glow */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-emerald-400 rounded-full opacity-[0.08] blur-2xl transition-transform duration-700 group-hover:scale-150 group-hover:opacity-[0.12]"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100/50 shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-emerald-600" />
        </div>
      </div>
      
      <div className="relative z-10">
        <p className="text-slate-500 text-xs font-black uppercase tracking-widest mb-2">{title}</p>
        <motion.h3 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 100, delay: delay + 0.2 }}
          className="text-4xl font-extrabold text-slate-800 tracking-tight"
        >
          {value}
        </motion.h3>
      </div>
    </motion.div>
  );
};

export default StatsCard;
