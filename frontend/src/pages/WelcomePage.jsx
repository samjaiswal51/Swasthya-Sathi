import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

import logo from '../assets/logo.png';

const taglines = [
  "Your Trusted Smart Digital Healthcare Companion",
  "Healthcare Made Simple & Connected",
  "Smarter Care for Every Family",
  "Digital Health, Human Care"
];

const WelcomePage = () => {
  const navigate = useNavigate();
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTaglineIndex((prev) => (prev + 1) % taglines.length);
    }, 4000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="min-h-screen overflow-hidden relative font-sans flex items-center justify-center"
         style={{ background: '#000000' }}>

      {/* ── Cinematic background ────────────────────────── */}
      {/* Spotlight center glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 40%, rgba(255,255,255,0.04) 0%, transparent 70%)' }} />

      {/* Animated dark blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
          transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
          className="absolute -top-[10%] -left-[10%] w-[40vw] h-[40vw] rounded-full blur-3xl"
          style={{ background: 'rgba(64,64,64,0.25)' }}
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 50, 0] }}
          transition={{ repeat: Infinity, duration: 10, ease: 'easeInOut' }}
          className="absolute -bottom-[10%] -right-[10%] w-[35vw] h-[35vw] rounded-full blur-3xl"
          style={{ background: 'rgba(38,38,38,0.35)' }}
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.3, 0.15] }}
          transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
          className="absolute top-[40%] left-[60%] w-[20vw] h-[20vw] rounded-full blur-3xl"
          style={{ background: 'rgba(82,82,82,0.2)' }}
        />
        {/* subtle grid noise overlay */}
        <div className="absolute inset-0 opacity-[0.025]"
             style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cpath d=\'M0 0h40v40H0z\' fill=\'none\'/%3E%3Cpath d=\'M0 0h1v40H0zM39 0h1v40h-1zM0 0h40v1H0zM0 39h40v1H0z\' fill=\'%23ffffff\'/%3E%3C/svg%3E")' }} />
      </div>

      {/* ── Main content ──────────────────────────────────── */}
      <div className="max-w-7xl w-full mx-auto px-6 py-12 lg:py-20 relative z-10
                      flex flex-col lg:flex-row items-center gap-12 lg:gap-24 h-full">

        {/* ═══ LEFT SIDE ════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="flex-1 flex flex-col items-center text-center lg:items-start lg:text-left space-y-8"
        >
          {/* Logo + Status badge group */}
          <div className="w-full flex flex-col items-center lg:items-start space-y-4">

            {/* Status badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center space-x-2 px-4 py-2 rounded-full border"
              style={{
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(16px)',
                borderColor: 'rgba(255,255,255,0.12)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
              }}
            >
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400" />
              </div>
              <span className="text-sm font-semibold tracking-wide" style={{ color: '#D4D4D4' }}>Live &amp; Secure</span>
            </motion.div>

            {/* Logo card */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl flex items-center justify-center p-4"
              style={{
                background: 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 0 40px rgba(255,255,255,0.06), 0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <img src={logo} alt="Swasthya Sathi Logo" className="w-16 h-16 lg:w-20 lg:h-20 object-contain" />
            </motion.div>
          </div>

          {/* Headline + tagline */}
          <div className="space-y-4">
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-none"
                style={{ color: '#FFFFFF' }}>
              Swasthya{' '}
              <span style={{
                backgroundImage: 'linear-gradient(135deg, #E5E5E5 0%, #737373 50%, #E5E5E5 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}>
                Sathi
              </span>
            </h1>

            <div className="h-20 lg:h-14 flex items-center justify-center lg:justify-start">
              <AnimatePresence mode="wait">
                <motion.h2
                  key={currentTaglineIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl lg:text-2xl font-medium"
                  style={{ color: '#A3A3A3' }}
                >
                  {taglines[currentTaglineIndex]}
                </motion.h2>
              </AnimatePresence>
            </div>

            <p className="text-base lg:text-lg max-w-lg mx-auto lg:mx-0 leading-relaxed"
               style={{ color: '#6B6B6B' }}>
              Connecting Patients, Doctors, Families, and Care through one secure healthcare ecosystem.
            </p>
          </div>

          {/* Trust badge */}
          <div className="pt-2">
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg"
                 style={{
                   background: 'rgba(255,255,255,0.04)',
                   border: '1px solid rgba(255,255,255,0.1)',
                 }}>
              <svg className="w-4 h-4" style={{ color: '#A3A3A3' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span className="text-sm font-medium" style={{ color: '#A3A3A3' }}>Trusted Healthcare Platform</span>
            </div>
          </div>
        </motion.div>

        {/* ═══ RIGHT SIDE — CTA CARD ════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
          className="flex-1 w-full max-w-md lg:max-w-lg relative"
        >
          {/* Card ambient glow */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none"
               style={{
                 background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.06) 0%, transparent 70%)',
                 filter: 'blur(24px)',
               }} />

          {/* Card */}
          <div className="relative rounded-3xl p-8 lg:p-12 space-y-8 z-10"
               style={{
                 background: 'rgba(15,15,15,0.92)',
                 backdropFilter: 'blur(32px)',
                 border: '1px solid rgba(255,255,255,0.1)',
                 boxShadow: '0 32px 80px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.08)',
               }}>

            {/* Card header */}
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold" style={{ color: '#E5E5E5' }}>Welcome to</h3>
              <p className="text-xl font-semibold"
                 style={{
                   backgroundImage: 'linear-gradient(135deg, #FFFFFF 0%, #A3A3A3 100%)',
                   WebkitBackgroundClip: 'text',
                   WebkitTextFillColor: 'transparent',
                   backgroundClip: 'text',
                 }}>
                Swasthya Sathi
              </p>
            </div>

            {/* Buttons */}
            <div className="space-y-4 pt-4">

              {/* Primary — Register */}
              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 10px 30px rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register')}
                className="w-full py-4 px-6 rounded-2xl font-bold text-base flex justify-center items-center group relative overflow-hidden transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #D4D4D4 100%)',
                  color: '#0A0A0A',
                  boxShadow: '0 8px 24px rgba(255,255,255,0.1), 0 2px 8px rgba(0,0,0,0.4)',
                }}
              >
                <span className="relative z-10 flex items-center">
                  Create New Account
                  <svg
                    className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-200"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </span>
                {/* shimmer sweep */}
                <div className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                     style={{ background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)' }} />
              </motion.button>

              {/* Secondary — Login */}
              <motion.button
                whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/login')}
                className="w-full py-4 px-6 rounded-2xl font-semibold text-base flex justify-center items-center transition-all duration-200"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#E5E5E5',
                }}
              >
                Login to Existing Account
              </motion.button>
            </div>

            {/* Trust footer row */}
            <div className="pt-6 flex items-center justify-center space-x-3 text-sm font-medium"
                 style={{ borderTop: '1px solid rgba(255,255,255,0.06)', color: '#525252' }}>
              <span>Secure</span>
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#404040' }} />
              <span>Trusted</span>
              <span className="w-1 h-1 rounded-full inline-block" style={{ background: '#404040' }} />
              <span>Modern Healthcare</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* ── Footer ─────────────────────────────────────────── */}
      <div className="absolute bottom-6 left-0 right-0 text-center text-sm"
           style={{ color: '#404040' }}>
        © {new Date().getFullYear()} Swasthya Sathi
      </div>
    </div>
  );
};

export default WelcomePage;
