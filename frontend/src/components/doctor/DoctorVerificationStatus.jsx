import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ShieldCheck, Clock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DoctorVerificationStatus = ({ status, reason, verifiedAt }) => {
  const navigate = useNavigate();
  if (!status) return null;

  const statusConfig = {
    pending: {
      bg: 'bg-amber-500/10',
      border: 'border-amber-500/20',
      text: 'text-amber-500',
      titleColor: 'text-amber-400',
      icon: <Clock className="w-8 h-8 text-amber-500" />,
      title: 'Verification Pending',
      message: 'Your documents are currently under review by our medical board. This process usually takes 24-48 hours. We will notify you once verified.'
    },
    approved: {
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      text: 'text-emerald-500',
      titleColor: 'text-emerald-400',
      icon: <ShieldCheck className="w-8 h-8 text-emerald-500" />,
      title: 'Profile Verified',
      message: 'Congratulations! You are now a verified medical professional on Swasthya Sathi.'
    },
    rejected: {
      bg: 'bg-rose-500/10',
      border: 'border-rose-500/20',
      text: 'text-rose-400',
      titleColor: 'text-rose-500',
      icon: <ShieldAlert className="w-8 h-8 text-rose-500" />,
      title: 'Verification Rejected',
      message: 'There were issues with your application. Please review the feedback below, correct your profile, and resubmit for approval.'
    }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`mb-8 p-6 sm:p-8 rounded-[2rem] border backdrop-blur-xl ${config.bg} ${config.border} shadow-[0_15px_40px_rgba(0,0,0,0.15)] flex flex-col sm:flex-row items-start gap-6 transition-all duration-300 relative overflow-hidden`}
    >
      <div className={`p-4 rounded-2xl bg-black/20 border ${config.border} shadow-inner flex-shrink-0`}>
        {config.icon}
      </div>
      
      <div className="flex-1 w-full">
        <h3 className={`font-extrabold text-2xl tracking-tight mb-2 ${config.titleColor}`}>{config.title}</h3>
        <p className={`text-sm sm:text-base font-medium leading-relaxed ${config.text} opacity-90`}>{config.message}</p>

        {status.toLowerCase() === 'approved' && verifiedAt && (
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-emerald-500/20">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span className="text-xs font-black uppercase tracking-widest text-emerald-400">Verified on {formatDate(verifiedAt)}</span>
          </div>
        )}

        {status.toLowerCase() === 'rejected' && (
          <div className="mt-6 space-y-5">
            <div className="p-5 rounded-2xl bg-black/40 border border-rose-500/20 shadow-inner">
              <p className="text-[10px] font-black uppercase tracking-widest text-rose-500/70 mb-2">Admin Feedback</p>
              <p className="text-sm font-medium text-rose-200 leading-relaxed">{reason || 'Please ensure all documents are clear and valid.'}</p>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/doctor-dashboard/onboarding')}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-600 to-red-600 text-white rounded-xl text-sm font-extrabold shadow-[0_0_20px_rgba(244,63,94,0.3)] hover:shadow-[0_0_30px_rgba(244,63,94,0.5)] transition-all border border-rose-500/50 group"
            >
              Update Profile & Resubmit <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default DoctorVerificationStatus;
