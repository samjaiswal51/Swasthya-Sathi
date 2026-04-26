import React from 'react';
import { motion } from 'framer-motion';
import { HeartPulse } from 'lucide-react';
import HealthFeed from './HealthFeed';

const WellnessHub = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-7xl mx-auto space-y-6 pb-20 relative"
    >
      {/* Ambient orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl bg-blue-600/8 pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-56 h-56 rounded-full blur-3xl bg-cyan-500/6 pointer-events-none" />

      {/* ── Hero Header ──────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-blue-900 to-[#1e3a6e]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.35)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.2)_0%,transparent_55%)]" />

        {/* Floating blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.12, 0.22, 0.12] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.08, 0.18, 0.08] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-12 left-1/3 w-64 h-64 rounded-full bg-cyan-500/12 blur-3xl pointer-events-none"
        />

        <div className="relative p-8 sm:p-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center">
                <HeartPulse className="w-5 h-5 text-blue-300" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.7))' }} />
              </div>
              <span className="text-blue-300 text-xs font-bold tracking-widest uppercase">Wellness Platform</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Wellness <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Hub</span>
            </h1>
            <p className="text-blue-200/75 text-sm sm:text-base max-w-lg leading-relaxed">
              Discover expert guidance, healthy habits, and updates from trusted doctors.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Social Health Feed ───────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="w-full relative min-h-[500px]"
      >
        <HealthFeed />
      </motion.div>
    </motion.div>
  );
};

export default WellnessHub;
