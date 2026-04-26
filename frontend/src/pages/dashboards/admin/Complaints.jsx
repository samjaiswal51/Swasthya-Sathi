import React, { useState, useEffect } from 'react';
import { CheckCircle, Trash2, AlertCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import adminService from '../../../services/adminService';

const typeColors = {
  'Fake Doctor':      'bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.1)]',
  'Misbehavior':      'bg-orange-500/10 text-orange-400 border-orange-500/20 shadow-[0_0_10px_rgba(249,115,22,0.1)]',
  'Spam':             'bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_10px_rgba(245,158,11,0.1)]',
  'Technical Issue':  'bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_10px_rgba(59,130,246,0.1)]',
  'Other':            'bg-zinc-500/10 text-zinc-400 border-zinc-500/20 shadow-[0_0_10px_rgba(113,113,122,0.1)]',
};

const Complaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await adminService.getComplaints();
      setComplaints(res.data);
    } catch { 
      toast.error('Failed to load complaints', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); 
    }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchComplaints(); }, []);

  const handleResolve = async (id) => {
    try { 
      await adminService.resolveComplaint(id); 
      toast.success('Complaint resolved ✅', { style: { background: '#171717', color: '#34d399', border: '1px solid #064e3b' }}); 
      fetchComplaints(); 
    }
    catch { toast.error('Failed to resolve', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this complaint permanently?')) return;
    try { 
      await adminService.deleteComplaint(id); 
      toast.success('Complaint deleted', { style: { background: '#171717', color: '#34d399', border: '1px solid #064e3b' }}); 
      fetchComplaints(); 
    }
    catch { toast.error('Failed to delete', { style: { background: '#171717', color: '#f87171', border: '1px solid #7f1d1d' }}); }
  };

  const filtered = filter === 'all' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32 relative z-10 px-4">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-900/10 rounded-full blur-[100px]" />
        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-zinc-800 to-black border border-white/10 rounded-[2rem] flex items-center justify-center mb-6 shadow-[0_15px_40px_rgba(0,0,0,0.5)] relative z-10 hover:scale-105 transition-transform duration-500">
          <ShieldAlert className="w-10 h-10 text-zinc-500" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 tracking-tight relative z-10">AI Moderation System Coming Soon</h3>
        <p className="text-zinc-500 font-medium max-w-md mx-auto relative z-10">We are currently building an AI-powered automated complaints and dispute resolution engine. This enterprise module will be unlocked in the next major update.</p>
        <div className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-xs font-black uppercase tracking-widest text-zinc-400 relative z-10">
           <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> In Development
        </div>
      </motion.div>
    </div>
  );
};

export default Complaints;
