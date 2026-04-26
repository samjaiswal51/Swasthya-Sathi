import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, FileText, CheckCircle2, XCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import PatientApprovalCard from '../../components/update-requests/PatientApprovalCard';

const PatientApprovalDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/update-requests/patient');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pastRequests = requests.filter(r => r.status !== 'pending');

  const displayRequests = activeTab === 'pending' ? pendingRequests : pastRequests;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl mx-auto space-y-6 pb-12 relative"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl bg-[rgba(37,99,235,0.10)] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl bg-[rgba(6,182,212,0.07)] pointer-events-none" />

      {/* Header */}
      <motion.div 
        initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1, duration:0.5 }}
        className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-3xl p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div>
          <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight border-l-[3px] border-l-[#2563EB] pl-4">Medical Record Updates</h1>
          <p className="text-slate-400 mt-2 max-w-xl font-medium ml-5">
            Review and approve medical record updates requested by your doctors. You are in full control of your health data.
          </p>
        </div>
        <div className="bg-[rgba(37,99,235,0.08)] border border-[rgba(59,130,246,0.22)] p-4 rounded-2xl flex items-center gap-4 shadow-[0_0_20px_rgba(37,99,235,0.10)]">
          <ShieldCheck className="w-10 h-10 text-blue-400" style={{ filter:'drop-shadow(0 0 8px rgba(37,99,235,0.6))' }} />
          <div>
            <p className="text-sm font-bold text-slate-100">Privacy First</p>
            <p className="text-xs text-blue-400">Your consent is required.</p>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[rgba(59,130,246,0.12)]">
        <button
          onClick={() => setActiveTab('pending')}
          className={
            activeTab === 'pending' 
              ? 'border-b-2 border-blue-500 text-blue-400 font-bold pb-3 px-4 transition-all' 
              : 'border-b-2 border-transparent text-slate-500 hover:text-slate-300 font-bold pb-3 px-4 transition-all'
          }
        >
          Pending Approval ({pendingRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={
            activeTab === 'past' 
              ? 'border-b-2 border-slate-400 text-slate-200 font-bold pb-3 px-4 transition-all' 
              : 'border-b-2 border-transparent text-slate-500 hover:text-slate-300 font-bold pb-3 px-4 transition-all'
          }
        >
          History
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4">
          <div className="relative w-20 h-20 flex items-center justify-center">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute" />
            <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-12 h-12 rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-500 absolute" />
          </div>
          <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
            className="text-slate-400 text-sm font-medium tracking-wide">
            Loading requests...
          </motion.p>
        </div>
      ) : displayRequests.length === 0 ? (
        <div className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-3xl p-16 text-center flex flex-col items-center">
          <motion.div animate={{ y:[0,-8,0] }} transition={{ repeat:Infinity, duration:3.5, ease:"easeInOut" }} className="w-24 h-24 bg-[rgba(37,99,235,0.08)] border border-[rgba(59,130,246,0.20)] rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
            <FileText className="w-10 h-10 text-blue-500/50" />
          </motion.div>
          <h3 className="text-xl font-extrabold text-slate-100 mb-2">No {activeTab === 'pending' ? 'Pending' : 'Past'} Requests</h3>
          <p className="text-slate-400 max-w-md mx-auto font-medium">
            {activeTab === 'pending' 
              ? 'You have no pending medical record update requests at the moment.' 
              : 'You have not processed any requests yet.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {displayRequests.map((request, idx) => (
            activeTab === 'pending' ? (
              <PatientApprovalCard 
                key={request._id} 
                request={request} 
                onUpdate={fetchRequests} 
              />
            ) : (
              <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay: idx * 0.06 }} key={request._id} className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl p-5 flex items-center justify-between hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_16px_rgba(59,130,246,0.10)] transition-all duration-300">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-100">{request.doctorName}</span>
                    <span className="text-xs text-slate-500">• {new Date(request.reviewedAt).toLocaleDateString()}</span>
                  </div>
                  <p className="text-sm text-slate-400">{request.type} Update Request</p>
                </div>
                <div>
                  {request.status === 'approved' ? (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(16,185,129,0.12)] text-emerald-400 border border-[rgba(16,185,129,0.25)] text-sm font-bold rounded-full">
                      <CheckCircle2 className="w-4 h-4" /> Approved
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[rgba(239,68,68,0.12)] text-red-400 border border-[rgba(239,68,68,0.25)] text-sm font-bold rounded-full">
                      <XCircle className="w-4 h-4" /> Rejected
                    </span>
                  )}
                </div>
              </motion.div>
            )
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PatientApprovalDashboard;
