import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin, Phone, Mail, Award, Building2, Clock, Globe,
  FileText, ExternalLink, Download, RefreshCw, Edit3, CheckCircle, XCircle, AlertCircle,
  Briefcase
} from 'lucide-react';

const VerificationBadge = ({ status }) => {
  const map = {
    pending:  { label: 'Verification Pending', color: 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/10', icon: <AlertCircle className="w-4 h-4" /> },
    approved: { label: 'Verified Doctor',       color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-emerald-500/10', icon: <CheckCircle className="w-4 h-4" /> },
    rejected: { label: 'Verification Rejected', color: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-rose-500/10',     icon: <XCircle className="w-4 h-4" /> },
  };
  const cfg = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold tracking-wide uppercase border shadow-sm backdrop-blur-sm ${cfg.color}`}>
      {cfg.icon} {cfg.label}
    </span>
  );
};

const InfoRow = ({ icon: Icon, label, value }) => (
  value ? (
    <div className="flex items-start gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
      <div className="p-2.5 rounded-xl bg-slate-100 text-emerald-600 flex-shrink-0 shadow-sm border border-slate-200/50">
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">{label}</p>
        <p className="text-sm font-bold text-slate-800">{value}</p>
      </div>
    </div>
  ) : null
);

const Card = ({ title, children }) => (
  <motion.div whileHover={{ y: -2 }} className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 hover:shadow-[0_20px_50px_rgba(16,185,129,0.06)] transition-all duration-300">
    <h3 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-6 flex items-center gap-2">
      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
      {title}
    </h3>
    {children}
  </motion.div>
);

const DocModal = ({ url, onClose }) => (
  <AnimatePresence>
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6">
      <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} 
        className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <p className="font-extrabold text-slate-800">Document Preview</p>
          <button onClick={onClose} className="p-2 rounded-xl bg-white text-slate-400 hover:text-slate-800 shadow-sm border border-slate-200 transition-colors">✕</button>
        </div>
        <div className="flex-1 overflow-auto bg-slate-100 p-4 sm:p-8 flex justify-center">
          {url.toLowerCase().endsWith('.pdf')
            ? <iframe src={url} title="doc" className="w-full h-[70vh] rounded-xl shadow-sm border border-slate-200 bg-white" />
            : <img src={url} alt="document" className="max-w-full rounded-xl shadow-sm border border-slate-200 object-contain" />
          }
        </div>
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-wrap justify-end gap-3">
          <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors">
            <ExternalLink className="w-4 h-4" /> Open in Browser
          </a>
          <a href={url} download className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-colors">
            <Download className="w-4 h-4" /> Download File
          </a>
        </div>
      </motion.div>
    </motion.div>
  </AnimatePresence>
);

const DocItem = ({ label, url }) => {
  const [open, setOpen] = useState(false);
  if (!url) return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-100 rounded-xl"><FileText className="w-4 h-4 text-slate-300" /></div>
        <p className="text-xs font-bold text-slate-400">{label} — Pending Upload</p>
      </div>
    </div>
  );
  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all gap-4">
        <div className="flex items-center gap-4">
          <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-100 text-emerald-600">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-sm font-extrabold text-slate-800">{label}</p>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button onClick={() => setOpen(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> View
          </button>
          <a href={url} download className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-colors">
            <Download className="w-3.5 h-3.5" /> Get
          </a>
        </div>
      </div>
      {open && <DocModal url={url} onClose={() => setOpen(false)} />}
    </>
  );
};

const DoctorProfileView = ({ profile, onEdit, onRefresh }) => {
  const p = profile;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      
      {/* Rejection banner */}
      {p.verificationStatus === 'rejected' && p.rejectionReason && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} 
          className="bg-rose-50 border border-rose-200 rounded-[2rem] p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex gap-4">
            <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl flex-shrink-0"><XCircle className="w-6 h-6" /></div>
            <div>
              <p className="font-extrabold text-rose-900 text-lg">Action Required: Profile Rejected</p>
              <p className="text-sm font-medium text-rose-700 mt-1 leading-relaxed max-w-xl">{p.rejectionReason}</p>
            </div>
          </div>
          <button onClick={onEdit} className="w-full sm:w-auto px-6 py-3 bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 hover:bg-rose-700 transition-colors">
            Update Profile
          </button>
        </motion.div>
      )}

      {/* Hero Card */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} 
        className="bg-gradient-to-br from-[#022C22] via-[#064E3B] to-emerald-900 rounded-[2.5rem] p-8 sm:p-12 text-white relative overflow-hidden shadow-2xl border border-emerald-500/20">
        
        {/* Floating Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-400/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center gap-8 relative z-10">
          {/* Avatar */}
          <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl bg-white/5 flex-shrink-0 relative group">
            {p.profilePhoto
              ? <img src={p.profilePhoto} alt="Doctor" className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-5xl font-extrabold text-emerald-100/50">{p.fullName?.charAt(0) || 'D'}</div>
            }
            <div className="absolute inset-0 border-2 border-emerald-400/50 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>

          {/* Info */}
          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/10 border border-white/20 rounded-lg text-xs font-bold tracking-widest uppercase text-emerald-100">{p.degree}</span>
              <VerificationBadge status={p.verificationStatus} />
            </div>
            
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mb-2 text-white drop-shadow-sm">{p.fullName}</h1>
            
            <p className="text-emerald-100/90 text-lg font-medium flex flex-wrap items-center gap-2 mb-5">
              <Briefcase className="w-4 h-4 text-emerald-400" /> {p.specialization} 
              <span className="text-emerald-500/50">•</span> {p.experienceYears} Years Exp.
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-white/10 backdrop-blur-md">
                <Building2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-50">{p.hospitalName}</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-black/20 border border-white/10 backdrop-blur-md">
                <span className="text-sm font-bold text-emerald-400">₹</span>
                <span className="text-sm font-bold text-emerald-50">{p.consultationFee} / Visit</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-row md:flex-col w-full md:w-auto gap-3 self-end md:self-start">
            <button onClick={onEdit} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-emerald-900 font-extrabold text-sm shadow-xl shadow-emerald-900/20 hover:bg-emerald-50 transition-colors">
              <Edit3 className="w-4 h-4" /> Edit Profile
            </button>
            <button onClick={onRefresh} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-bold text-sm hover:bg-white/20 transition-colors backdrop-blur-md">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
          </div>
        </div>
      </motion.div>

      {/* Detail Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* About */}
        <Card title="About Doctor">
          {p.bio ? <p className="text-slate-600 text-sm leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-100">{p.bio}</p> : <p className="text-slate-400 text-sm italic p-4">No bio added yet.</p>}
          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2">
            <InfoRow icon={Phone} label="Mobile" value={p.mobile} />
            <InfoRow icon={Mail} label="Email" value={p.email} />
            <div className="sm:col-span-2">
              <InfoRow icon={Award} label="Registration No." value={p.registrationNumber} />
            </div>
          </div>
        </Card>



        {/* Address */}
        <Card title="Clinic Address">
          <div className="flex items-start gap-4 p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl shadow-sm"><MapPin className="w-5 h-5" /></div>
            <div>
              <p className="font-extrabold text-slate-800 leading-snug">{p.clinicAddress}</p>
              {(p.city || p.state || p.pincode) && (
                <p className="text-sm font-medium text-slate-500 mt-2 flex items-center gap-2">
                  {[p.city, p.state, p.pincode].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* Languages */}
        <Card title="Languages Spoken">
          {p.languages?.length > 0
            ? <div className="flex flex-wrap gap-2.5">
                {p.languages.map(l => (
                  <span key={l} className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-sm text-xs font-extrabold">
                    <Globe className="w-3.5 h-3.5 text-emerald-500" /> {l}
                  </span>
                ))}
              </div>
            : <p className="text-slate-400 text-sm italic">No languages added.</p>
          }
        </Card>
      </div>

      {/* Documents */}
      <Card title="Verification Documents">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DocItem label="Medical Degree Certificate" url={p.documents?.degreeCertificate} />
          <DocItem label="Medical License Certificate" url={p.documents?.licenseCertificate} />
          <DocItem label="ID Proof (Aadhar/PAN)" url={p.documents?.idProof} />
        </div>
      </Card>
    </div>
  );
};

export default DoctorProfileView;
