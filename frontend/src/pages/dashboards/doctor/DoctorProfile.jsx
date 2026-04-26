import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import DoctorProfileView from './DoctorProfileView';
import DoctorProfileEditForm from './DoctorProfileEditForm';
import DoctorOnboardingStepper from './DoctorOnboardingStepper';

const DoctorProfile = () => {
  const {} = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/doctor/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(res.data);
    } catch (err) {
      if (err.response?.status === 404) {
        setProfile(null); // no profile yet
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col justify-center items-center gap-4">
        <div className="relative w-16 h-16">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-4 border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-4 border-transparent border-b-teal-400 border-l-teal-400 absolute top-2 left-2" />
        </div>
        <p className="text-sm font-semibold text-emerald-600/70 tracking-wide animate-pulse">Loading Identity...</p>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {/* First-time doctor: no profile exists */}
      {!profile ? (
        <motion.div key="onboarding" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
          <DoctorOnboardingStepper onComplete={fetchProfile} />
        </motion.div>
      ) : editing ? (
        /* Has profile and clicked Edit */
        <motion.div key="edit" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
          <DoctorProfileEditForm
            profile={profile}
            onSave={(updated) => { setProfile(updated); setEditing(false); }}
            onCancel={() => setEditing(false)}
          />
        </motion.div>
      ) : (
        /* Default: show profile view */
        <motion.div key="view" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.4 }}>
          <DoctorProfileView
            profile={profile}
            onEdit={() => setEditing(true)}
            onRefresh={fetchProfile}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DoctorProfile;
