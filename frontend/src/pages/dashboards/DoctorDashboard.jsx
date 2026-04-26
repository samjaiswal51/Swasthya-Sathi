import React, { useState, useEffect, useContext, useRef } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import DoctorSidebar from '../../components/doctor/DoctorSidebar';
import DoctorHeader from '../../components/doctor/DoctorHeader';
import DoctorVerificationStatus from '../../components/doctor/DoctorVerificationStatus';
import { AuthContext } from '../../context/AuthContext';

const DoctorDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  // Prevent re-fetching every time location.pathname changes (avoids infinite loop)
  const hasFetched = useRef(false);

  useEffect(() => {
    if (!user || hasFetched.current) return;

    const fetchProfile = async () => {
      hasFetched.current = true;
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/doctor/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data);

        // If profile is incomplete and not already on onboarding, redirect once
        if (!res.data.isProfileComplete && location.pathname !== '/doctor-dashboard/onboarding') {
          navigate('/doctor-dashboard/onboarding', { replace: true });
        }
      } catch (err) {
        console.error('Error fetching doctor profile:', err);
        // 404 = no profile yet → send to onboarding (only once, not in a loop)
        if (err.response?.status === 404 && location.pathname !== '/doctor-dashboard/onboarding') {
          navigate('/doctor-dashboard/onboarding', { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]); // ← only re-run when the logged-in user changes

  // ── Loading Screen ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
           style={{ background: 'linear-gradient(135deg, #022C22 0%, #052E16 50%, #022C22 100%)' }}>
        <div className="relative w-16 h-16">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-transparent absolute"
            style={{ borderTopColor: '#10B981', borderRightColor: '#10B981' }}
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-11 h-11 rounded-full border-4 border-transparent absolute top-2.5 left-2.5"
            style={{ borderBottomColor: '#34D399', borderLeftColor: '#34D399' }}
          />
        </div>
        <p className="text-emerald-400/70 text-sm font-medium">Loading your workspace...</p>
      </div>
    );
  }

  // ── Suspended Account Screen ─────────────────────────────────
  if (user?.isSuspended) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6"
           style={{ background: 'linear-gradient(135deg, #022C22 0%, #0A0A0A 100%)' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full p-8 text-center rounded-3xl"
          style={{
            background: 'rgba(255,255,255,0.03)',
            backdropFilter: 'blur(24px)',
            border: '1px solid rgba(239,68,68,0.2)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.6), 0 0 40px rgba(239,68,68,0.06)',
          }}
        >
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
               style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <svg className="w-10 h-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-extrabold text-white mb-3">Account Suspended</h2>
          <p className="text-sm leading-relaxed mb-8" style={{ color: '#6B7280' }}>
            Your account has been temporarily suspended by the administration. You cannot access the doctor dashboard
            or perform any actions at this time. Please contact support.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => { localStorage.removeItem('token'); window.location.href = '/login'; }}
            className="w-full py-3.5 rounded-2xl font-bold text-sm text-white transition-all"
            style={{
              background: 'linear-gradient(135deg, #DC2626, #B91C1C)',
              boxShadow: '0 8px 20px rgba(220,38,38,0.3)',
            }}
          >
            Logout
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ── Main Dashboard Layout ────────────────────────────────────
  return (
    <div className="min-h-screen font-sans flex"
         style={{ background: 'linear-gradient(160deg, #F0FDF4 0%, #ECFDF5 50%, #F0FDF4 100%)' }}>

      {/* Sidebar */}
      <DoctorSidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        doctorProfile={profile}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-[280px] transition-all duration-300">
        <DoctorHeader setSidebarOpen={setIsSidebarOpen} profile={profile} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
          <div className="max-w-7xl mx-auto">
            {/* Show verification status banner globally if not approved, or specifically on verification page */}
            {profile && (location.pathname === '/doctor-dashboard/verification' || profile.verificationStatus !== 'approved') && (
              <DoctorVerificationStatus
                status={profile.verificationStatus}
                reason={profile.rejectionReason}
                verifiedAt={profile.verifiedAt}
              />
            )}
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <Outlet context={{ profile, setProfile }} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DoctorDashboard;
