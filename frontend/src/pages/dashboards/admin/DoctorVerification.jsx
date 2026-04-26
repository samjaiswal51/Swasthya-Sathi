import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Eye, FileText, Clock, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../../services/adminService';

const Modal = ({ open, title, children, onClose }) => {
  if (!open) return null;
  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-[#0A0A0A] rounded-[2rem] border border-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.8)] w-full max-w-md p-7 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500/50 to-transparent" />
          <h3 className="text-xl font-extrabold text-white mb-5 tracking-tight">{title}</h3>
          {children}
          <button 
            onClick={onClose} 
            className="mt-4 w-full py-3 rounded-xl border border-white/10 text-sm font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const StatusBadge = ({ status }) => {
  const map = { 
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]', 
    approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]', 
    rejected: 'bg-rose-500/10 text-rose-500 border-rose-500/20 shadow-[0_0_10px_rgba(243,64,64,0.1)]' 
  };
  return <span className={`px-3 py-1 rounded-full border text-[11px] font-black uppercase tracking-widest ${map[status] || map.pending}`}>{status}</span>;
};

const DoctorRow = ({ doctor, onApprove, onReject, index }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -2 }}
      className="bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg overflow-hidden transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.5)] group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-6">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 shadow-inner flex items-center justify-center text-white font-black text-xl flex-shrink-0 group-hover:from-zinc-600 group-hover:to-zinc-800 transition-colors">
            {doctor.fullName?.charAt(0) || 'D'}
          </div>
          <div>
            <p className="font-extrabold text-white text-lg tracking-tight">{doctor.fullName || 'N/A'}</p>
            <p className="text-sm text-zinc-400 font-medium">{doctor.specialization || '—'}</p>
            <p className="text-xs text-zinc-500 mt-1 font-medium tracking-wide">
              Reg: <span className="text-zinc-300">{doctor.registrationNumber || '—'}</span> &nbsp;|&nbsp; <span className="text-zinc-300">{doctor.experienceYears || '0'} yrs</span> exp
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">
          <StatusBadge status={doctor.verificationStatus} />
          
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setExpanded(!expanded)} 
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 text-zinc-300 text-xs font-bold hover:bg-white/10 hover:text-white border border-white/5 transition-all"
          >
            <Eye className="w-4 h-4" /> {expanded ? 'Close' : 'Details'} {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </motion.button>

          {doctor.verificationStatus === 'pending' && (
            <>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={() => onApprove(doctor._id)} 
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold hover:bg-emerald-500/20 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all"
              >
                <CheckCircle className="w-4 h-4" /> Approve
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }}
                onClick={() => onReject(doctor)} 
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold hover:bg-rose-500/20 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all"
              >
                <XCircle className="w-4 h-4" /> Reject
              </motion.button>
            </>
          )}
        </div>
      </div>
      
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-white/5 bg-black/40 px-6 pb-6 pt-5 grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm"
          >
            <div><p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Hospital</p><p className="font-medium text-white">{doctor.hospitalName || '—'}</p></div>
            <div><p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Degree</p><p className="font-medium text-white">{doctor.degree || '—'}</p></div>
            <div><p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">City</p><p className="font-medium text-white">{doctor.city || '—'}</p></div>
            <div><p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Email</p><p className="font-medium text-white">{doctor.user?.email || '—'}</p></div>
            <div><p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Submitted</p><p className="font-medium text-white">{doctor.createdAt ? new Date(doctor.createdAt).toLocaleDateString('en-IN') : '—'}</p></div>
            <div><p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mb-1">Fee</p><p className="font-medium text-white">₹{doctor.consultationFee || '—'}</p></div>
            <div className="col-span-2 sm:col-span-3 flex flex-wrap gap-3 mt-2">
              {doctor.documents?.degreeCertificate && <a href={doctor.documents.degreeCertificate} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all"><FileText className="w-4 h-4 text-zinc-400" /> Degree Cert</a>}
              {doctor.documents?.licenseCertificate && <a href={doctor.documents.licenseCertificate} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all"><FileText className="w-4 h-4 text-zinc-400" /> License</a>}
              {doctor.documents?.idProof && <a href={doctor.documents.idProof} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-zinc-300 text-xs font-bold hover:bg-white/10 hover:text-white hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] transition-all"><FileText className="w-4 h-4 text-zinc-400" /> ID Proof</a>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const DoctorVerification = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [rejectModal, setRejectModal] = useState({ open: false, doctor: null });
  const [rejectReason, setRejectReason] = useState('');

  const fetchDoctors = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAllDoctors();
      const all = res.data;
      setDoctors(filter === 'all' ? all : all.filter(d => d.verificationStatus === filter));
    } catch {
      toast.error('Failed to load doctors', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }});
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDoctors(); }, [filter]);

  const handleApprove = async (id) => {
    try { 
      await adminService.approveDoctor(id); 
      toast.success('Doctor approved ✅', { style: { background: '#171717', color: '#34d399', border: '1px solid #064e3b' }}); 
      fetchDoctors(); 
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to approve', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); 
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) { toast.error('Please enter a reason', { style: { background: '#171717', color: '#a3a3a3', border: '1px solid #404040' }}); return; }
    try {
      await adminService.rejectDoctor(rejectModal.doctor._id, rejectReason);
      toast.success('Doctor rejected', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }});
      setRejectModal({ open: false, doctor: null });
      setRejectReason('');
      fetchDoctors();
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Failed to reject', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); 
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/5 backdrop-blur-xl border border-white/10 p-2 sm:p-2.5 rounded-[2rem] sm:rounded-full">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['pending','approved','rejected','all'].map(t => (
            <button 
              key={t} 
              onClick={() => setFilter(t)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-full text-sm font-extrabold capitalize transition-all duration-300 ${
                filter === t 
                  ? 'bg-gradient-to-r from-zinc-200 to-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)] scale-105' 
                  : 'bg-transparent text-zinc-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {t === 'all' ? 'All Docs' : t}
            </button>
          ))}
        </div>
        <span className="text-sm font-bold text-zinc-500 flex items-center gap-2 px-4">
          <Clock className="w-4 h-4 text-zinc-400" />
          {doctors.length} result{doctors.length !== 1 ? 's' : ''}
        </span>
      </div>

      {loading ? (
        <div className="flex flex-col justify-center items-center py-32 space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-zinc-800 border-t-white border-l-zinc-500 animate-spin" />
          <p className="text-zinc-500 text-sm font-black uppercase tracking-widest">Loading Records...</p>
        </div>
      ) : doctors.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="text-center py-24 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-zinc-800/30 rounded-full blur-[80px]" />
          <div className="relative z-10 w-20 h-20 mx-auto bg-gradient-to-br from-zinc-800 to-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center mb-5 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            <ShieldCheck className="w-10 h-10 text-zinc-400" />
          </div>
          <h3 className="text-2xl font-extrabold text-white mb-2 relative z-10">No {filter} doctors</h3>
          <p className="text-zinc-500 font-medium relative z-10">Nothing to review in this category right now.</p>
        </motion.div>
      ) : (
        <div className="space-y-5">
          {doctors.map((doc, idx) => (
            <DoctorRow key={doc._id} doctor={doc} index={idx} onApprove={handleApprove} onReject={(d) => setRejectModal({ open: true, doctor: d })} />
          ))}
        </div>
      )}

      <Modal open={rejectModal.open} title={`Reject Dr. ${rejectModal.doctor?.fullName || ''}?`} onClose={() => setRejectModal({ open: false, doctor: null })}>
        <p className="text-sm text-zinc-400 mb-4 font-medium">Provide a reason so the doctor can correct and resubmit their application.</p>
        <textarea 
          rows={4} 
          value={rejectReason} 
          onChange={e => setRejectReason(e.target.value)}
          placeholder="e.g. Identity proof is blurred..."
          className="w-full px-5 py-4 rounded-2xl bg-black border border-white/10 focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 outline-none text-sm text-white placeholder-zinc-600 transition-all resize-none shadow-inner" 
        />
        <motion.button 
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleRejectSubmit} 
          className="mt-6 w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(244,63,94,0.6)] transition-all border border-rose-500/50"
        >
          Confirm Rejection
        </motion.button>
      </Modal>
    </div>
  );
};

export default DoctorVerification;
