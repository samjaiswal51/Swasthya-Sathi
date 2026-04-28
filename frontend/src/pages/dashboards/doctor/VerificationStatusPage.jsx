import React from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, ShieldAlert, Clock, ArrowRight,
  BadgeCheck, Stethoscope, GraduationCap, CalendarDays,
  Hash, Building2, MapPin
} from 'lucide-react';

const VerificationStatusPage = () => {
  const { profile } = useOutletContext() || {};
  const navigate = useNavigate();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const status = profile.verificationStatus || 'pending';

  const statusConfig = {
    pending: {
      icon: <Clock className="w-10 h-10 text-amber-500" />,
      iconBg: 'bg-amber-500/10 border-amber-500/20',
      badge: 'bg-amber-100 text-amber-700 border-amber-200',
      badgeText: 'Under Review',
      title: 'Verification Pending',
      subtitle: 'Your profile is currently under review by our medical board.',
      description: 'This process usually takes 24–48 hours. You will be notified once a decision is made. In the meantime, your profile is not yet visible to patients.',
      glow: '0 0 40px rgba(245,158,11,0.08)',
      accent: 'from-amber-500/5 to-amber-500/0',
      borderColor: 'border-amber-200/40',
    },
    approved: {
      icon: <ShieldCheck className="w-10 h-10 text-emerald-500" />,
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      badge: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      badgeText: 'Verified',
      title: 'Profile Verified',
      subtitle: 'You are a verified medical professional on Swasthya Sathi.',
      description: 'Your profile is now visible to patients. They can discover you via search, book appointments, and contact you directly through the platform.',
      glow: '0 0 40px rgba(16,185,129,0.08)',
      accent: 'from-emerald-500/5 to-emerald-500/0',
      borderColor: 'border-emerald-200/40',
    },
    rejected: {
      icon: <ShieldAlert className="w-10 h-10 text-rose-500" />,
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      badge: 'bg-rose-100 text-rose-700 border-rose-200',
      badgeText: 'Rejected',
      title: 'Verification Rejected',
      subtitle: 'Your application needs corrections before approval.',
      description: 'Please review the admin feedback below, update your profile with accurate documents, and resubmit for verification.',
      glow: '0 0 40px rgba(244,63,94,0.08)',
      accent: 'from-rose-500/5 to-rose-500/0',
      borderColor: 'border-rose-200/40',
    },
  };

  const cfg = statusConfig[status] || statusConfig.pending;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '—';

  const infoCards = [
    { icon: Hash,        label: 'Registration No.',  value: profile.registrationNumber },
    { icon: GraduationCap, label: 'Degree',          value: profile.degree },
    { icon: Stethoscope,  label: 'Specialization',   value: profile.specialization },
    { icon: BadgeCheck,   label: 'Experience',        value: profile.experienceYears ? `${profile.experienceYears} Years` : null },
    { icon: Building2,    label: 'Hospital / Clinic', value: profile.hospitalName },
    { icon: MapPin,       label: 'City',              value: [profile.city, profile.state].filter(Boolean).join(', ') || null },
    { icon: CalendarDays, label: 'Profile Submitted', value: formatDate(profile.createdAt) },
    { icon: CalendarDays, label: 'Last Updated',      value: formatDate(profile.updatedAt) },
  ];

  return (
    <div className="max-w-3xl mx-auto py-4 space-y-6">

      {/* ── Page Header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4"
      >
        <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 shadow-sm">
          <ShieldCheck className="w-6 h-6 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">Verification Status</h1>
          <p className="text-sm text-slate-500 font-medium">Your profile approval details and current standing</p>
        </div>
      </motion.div>

      {/* ── Main Status Card ───────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.07 }}
        className={`relative overflow-hidden rounded-[2rem] border bg-gradient-to-br ${cfg.accent} bg-white/90 backdrop-blur-xl ${cfg.borderColor} shadow-sm p-8`}
        style={{ boxShadow: cfg.glow }}
      >
        {/* Decorative circle */}
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-emerald-400/5 pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
          {/* Icon */}
          <div className={`flex-shrink-0 p-4 rounded-2xl border shadow-sm ${cfg.iconBg}`}>
            {cfg.icon}
          </div>

          {/* Text */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest border ${cfg.badge}`}>
                {cfg.badgeText}
              </span>
              {status === 'approved' && profile.verifiedAt && (
                <span className="text-[11px] text-slate-400 font-semibold">
                  Verified on {formatDate(profile.verifiedAt)}
                </span>
              )}
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-1">{cfg.title}</h2>
            <p className="text-sm font-semibold text-slate-500 mb-2">{cfg.subtitle}</p>
            <p className="text-sm text-slate-400 leading-relaxed">{cfg.description}</p>

            {/* Rejection feedback + resubmit */}
            {status === 'rejected' && (
              <div className="mt-6 space-y-4">
                <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
                  <p className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-2">Admin Feedback</p>
                  <p className="text-sm font-medium text-rose-700 leading-relaxed">
                    {profile.rejectionReason || 'Please ensure all documents are clear, valid, and match your registration details.'}
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/doctor-dashboard/onboarding')}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-rose-600 to-red-500 text-white rounded-xl text-sm font-extrabold shadow-lg shadow-rose-500/20 hover:shadow-rose-500/35 transition-all group"
                >
                  Update Profile & Resubmit
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Profile Info Grid ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
      >
        <h3 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-4 pl-1">
          Submitted Profile Details
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {infoCards.map(({ icon: Icon, label, value }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 + i * 0.04 }}
              className="flex items-center gap-4 p-5 rounded-2xl bg-white/80 backdrop-blur-xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all duration-200"
            >
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex-shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
                <p className="text-sm font-bold text-slate-800 truncate">{value || '—'}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default VerificationStatusPage;
