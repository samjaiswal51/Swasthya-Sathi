import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// SVG Icons for buttons
const UserPlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const LoginIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
  </svg>
);

// Decorative elements
const FloatingOrbs = () => (
  <>
    <motion.div
      className="absolute w-64 h-64 rounded-full bg-[#4F772D]/20 blur-3xl -top-32 -left-32"
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
    <motion.div
      className="absolute w-48 h-48 rounded-full bg-[#ECF39E]/30 blur-2xl -bottom-24 -right-24"
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.2, 0.4, 0.2],
      }}
      transition={{
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />
  </>
);

function AuthPage() {
  const navigate = useNavigate();

  // Navigation handlers - core functionality remains unchanged
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        when: "beforeChildren",
        staggerChildren: 0.2,
      },
    },
  };

  const leftColumnVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeInOut" },
    },
  };

  const rightColumnVariants = {
    hidden: { opacity: 0, x: 50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.7, ease: "easeInOut", delay: 0.2 },
    },
  };

  const buttonVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(79, 119, 45, 0.4), 0 10px 10px -5px rgba(79, 119, 45, 0.2)",
      transition: { duration: 0.3, ease: "easeInOut" }
    },
    tap: { scale: 0.98 }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-[#132A13] via-[#1e3e1e] to-[#31572C] font-['Inter'] relative overflow-hidden">
      {/* Background decorative elements */}
      <FloatingOrbs />
      
      {/* Main glassmorphism container */}
      <motion.div
        className="flex w-[90vw] max-w-7xl min-h-[75vh] rounded-3xl shadow-2xl overflow-hidden bg-gradient-to-br from-[#132A13]/40 via-[#1e3e1e]/30 to-[#31572C]/40 backdrop-blur-2xl border border-[#4F772D]/30 relative"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Subtle inner glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#90A955]/5 to-[#ECF39E]/5 pointer-events-none" />
        
        {/* Left Column: Branding and Information */}
        <motion.div
          className="w-1/2 p-12 lg:p-16 flex flex-col justify-center items-start hidden lg:flex relative"
          variants={leftColumnVariants}
        >
          {/* Decorative accent */}
          <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-[#90A955] to-[#ECF39E]" />
          
          <motion.div
            className="mb-10"
            whileHover={{ y: -5 }}
            transition={{ duration: 0.3 }}
          >
            <motion.img
              src="/src/assets/logo.png"
              alt="Swasthya Sathi Logo"
              className="w-28 h-28 rounded-2xl shadow-lg border-2 border-[#90A955]/30"
              whileHover={{ 
                scale: 1.05,
                rotate: 2,
                boxShadow: "0 15px 30px -10px rgba(144, 169, 85, 0.4)"
              }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
            />
          </motion.div>
          
          <motion.h1
            className="text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight mb-6 bg-gradient-to-r from-[#90A955] via-[#c5da8c] to-[#ECF39E] bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            Swasthya Sathi
          </motion.h1>
          
          <motion.h2 
            className="text-2xl xl:text-3xl font-semibold text-[#ECF39E]/90 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
          >
            Your trusted partner on the path to wellness.
          </motion.h2>
          
          <motion.p 
            className="text-[#ECF39E]/80 text-lg max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            Join our community to manage your health, connect with professionals, and take control of your well-being in a simple and secure way.
          </motion.p>
          
          {/* Decorative elements */}
          <div className="absolute bottom-8 left-16 flex space-x-2">
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-[#90A955]/50"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </div>
        </motion.div>

        {/* Right Column: Action and Form */}
        <motion.div
          className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center items-center relative"
          variants={rightColumnVariants}
        >
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgdmlld0JveD0iMCAwIDYwIDYwIj48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMTUiLz48L2c+PC9zdmc+')]"></div>
          
          <div className="w-full max-w-md text-center relative z-10">
            <motion.h3 
              className="text-3xl font-bold text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
            >
              Begin Your Wellness Journey
            </motion.h3>
            

            {/* Create Account Button (Primary) */}
            <motion.button
              onClick={handleRegisterClick}
              className="w-full text-lg font-bold p-5 rounded-2xl text-[#132A13] bg-gradient-to-r from-[#90A955] to-[#ECF39E] mb-2 relative overflow-hidden group"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              {/* Shimmer effect on hover */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 transform translate-x-[-100%] group-hover:animate-shimmer" />
              
              <span className="flex items-center justify-center gap-x-3 relative z-10">
                <UserPlusIcon />
                Create Account
              </span>
            </motion.button>

            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#4F772D]/40"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-3 text-[#90A955]/80 bg-transparent">Already a member?</span>
              </div>
            </div>

            {/* Sign In Button (Secondary) */}
            <motion.button
              onClick={handleLoginClick}
              className="w-full text-lg font-bold p-5 rounded-2xl text-[#ECF39E] bg-transparent border-2 border-[#90A955]/50 shadow-lg group hover:bg-[#4F772D]/20 transition-colors duration-300"
              variants={buttonVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              whileTap="tap"
            >
              <span className="flex items-center justify-center gap-x-3">
                <LoginIcon />
                Sign In
              </span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Add custom animation style */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .group-hover\\:animate-shimmer {
          animation: shimmer 1.5s infinite;
        }
      `}</style>
    </div>
  );
}

export default AuthPage;