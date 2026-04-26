import React, { useState } from 'react';
import axios from 'axios';
import { Calendar, User, ShieldAlert, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PatientApprovalCard = ({ request, onUpdate }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  const handleApprove = async () => {
    if (!window.confirm('Are you sure you want to approve this medical record update?')) return;
    
    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/update-requests/${request._id}/approve`);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to approve request');
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }

    try {
      setLoading(true);
      await axios.put(`http://localhost:5000/api/update-requests/${request._id}/reject`, {
        reason: rejectionReason
      });
      onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to reject request');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`backdrop-blur-[16px] rounded-2xl overflow-hidden transition-all duration-300 border-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]
        ${request.priority === 'Urgent'
          ? 'bg-[rgba(239,68,68,0.04)] border-[rgba(239,68,68,0.25)] hover:border-[rgba(239,68,68,0.45)] hover:shadow-[0_0_20px_rgba(239,68,68,0.10)]'
          : request.priority === 'Important'
          ? 'bg-[rgba(245,158,11,0.04)] border-[rgba(245,158,11,0.25)] hover:border-[rgba(245,158,11,0.45)] hover:shadow-[0_0_20px_rgba(245,158,11,0.10)]'
          : 'bg-[rgba(255,255,255,0.03)] border-[rgba(59,130,246,0.15)] hover:border-[rgba(59,130,246,0.35)] hover:shadow-[0_0_20px_rgba(37,99,235,0.12)]'
        }`}
    >
      {/* Header */}
      <div className={`p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 border-b
        ${request.priority === 'Urgent'
          ? 'bg-[rgba(239,68,68,0.05)] border-[rgba(239,68,68,0.15)]'
          : request.priority === 'Important'
          ? 'bg-[rgba(245,158,11,0.05)] border-[rgba(245,158,11,0.15)]'
          : 'bg-[rgba(255,255,255,0.02)] border-[rgba(59,130,246,0.10)]'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.25)] rounded-full flex items-center justify-center text-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.15)]">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-100 text-lg flex items-center gap-2">
              {request.doctorName}
              <ShieldAlert className="w-4 h-4 text-emerald-400" title="Verified Doctor" />
            </h3>
            <p className="text-sm text-slate-500 font-medium">Requested: {formatDate(request.createdAt)}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-auto">
          {request.priority === 'Urgent' && (
            <span className="px-3 py-1 bg-[rgba(239,68,68,0.15)] text-red-400 border border-[rgba(239,68,68,0.30)] text-xs font-bold uppercase rounded-full flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Urgent
            </span>
          )}
          {request.priority === 'Important' && (
            <span className="px-3 py-1 bg-[rgba(245,158,11,0.15)] text-amber-400 border border-[rgba(245,158,11,0.30)] text-xs font-bold uppercase rounded-full">
              Important
            </span>
          )}
          <span className="px-3 py-1 bg-[rgba(255,255,255,0.05)] border border-[rgba(255,255,255,0.10)] text-slate-400 text-xs font-bold rounded-full">
            {request.type} Update
          </span>
        </div>
      </div>

      {/* Summary Body */}
      <div className="p-6">
        <p className="text-slate-400 mb-4 font-medium leading-relaxed">
          Dr. {request.doctorName.replace('Dr. ', '')} is requesting to update your medical records with new clinical information. Please review the details below.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="px-5 py-2.5 rounded-xl border border-[rgba(255,255,255,0.10)] text-slate-300 font-bold hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(59,130,246,0.30)] hover:text-blue-400 transition-all duration-200"
          >
            {showDetails ? 'Hide Details' : 'View Full Details'}
          </button>
          
          <div className="flex gap-3 sm:ml-auto">
            {showRejectInput ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input 
                  type="text" 
                  placeholder="Reason for rejection (optional)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  className="px-3 py-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(239,68,68,0.25)] rounded-lg text-sm text-slate-200 placeholder:text-slate-600 w-full sm:w-48 outline-none focus:border-red-400 focus:ring-1 focus:ring-red-400/30 transition-all"
                />
                <button 
                  onClick={handleReject}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-500 text-white font-bold rounded-lg hover:shadow-[0_0_16px_rgba(239,68,68,0.4)] transition-all whitespace-nowrap disabled:opacity-50"
                >
                  Confirm Reject
                </button>
                <button 
                  onClick={() => setShowRejectInput(false)}
                  className="px-3 py-2 text-slate-500 hover:bg-[rgba(255,255,255,0.05)] hover:text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <button 
                  onClick={handleReject}
                  className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[rgba(239,68,68,0.25)] bg-[rgba(239,68,68,0.06)] text-red-400 font-bold hover:bg-[rgba(239,68,68,0.15)] hover:border-[rgba(239,68,68,0.45)] transition-all duration-200"
                >
                  <XCircle className="w-5 h-5" /> Reject
                </button>
                <button 
                  onClick={handleApprove}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)] transition-all duration-300 disabled:opacity-50"
                >
                  <CheckCircle className="w-5 h-5" /> {loading ? 'Approving...' : 'Approve'}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="mt-6 overflow-hidden"
            >
              <div className="p-5 bg-[rgba(255,255,255,0.02)] border border-[rgba(59,130,246,0.12)] rounded-xl space-y-4 text-sm">
                <h4 className="font-bold text-slate-500 uppercase tracking-wider text-xs border-b border-[rgba(59,130,246,0.12)] pb-2">Proposed Changes to Record</h4>
                
                {request.changes.diagnosis && (
                  <div>
                    <span className="font-bold text-slate-300">Diagnosis Added:</span>
                    <p className="text-slate-400 mt-1 leading-relaxed">{request.changes.diagnosis}</p>
                  </div>
                )}
                
                {request.changes.allergies && (
                  <div>
                    <span className="font-bold text-slate-300">Allergies Updated:</span>
                    <p className="text-slate-400 mt-1 leading-relaxed">{request.changes.allergies}</p>
                  </div>
                )}

                {request.changes.prescriptions && request.changes.prescriptions.length > 0 && (
                  <div>
                    <span className="font-bold text-slate-300 block mb-2">New Prescriptions:</span>
                    <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(59,130,246,0.12)] rounded-lg overflow-hidden">
                      <table className="w-full text-left">
                        <thead className="bg-[rgba(255,255,255,0.03)] text-xs uppercase text-slate-500 border-b border-[rgba(59,130,246,0.10)]">
                          <tr>
                            <th className="px-4 py-2 font-bold">Medicine</th>
                            <th className="px-4 py-2 font-bold">Dose</th>
                            <th className="px-4 py-2 font-bold">Freq</th>
                            <th className="px-4 py-2 font-bold">Duration</th>
                          </tr>
                        </thead>
                        <tbody className="text-slate-400 divide-y divide-[rgba(59,130,246,0.08)]">
                          {request.changes.prescriptions.map((p, idx) => (
                            <tr key={idx}>
                              <td className="px-4 py-2 font-semibold text-slate-200">{p.medicineName}</td>
                              <td className="px-4 py-2">{p.dose}</td>
                              <td className="px-4 py-2">{p.frequency}</td>
                              <td className="px-4 py-2">{p.duration}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {request.changes.tests && (
                  <div>
                    <span className="font-bold text-slate-300">Recommended Tests:</span>
                    <p className="text-slate-400 mt-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] p-3 rounded-lg leading-relaxed">{request.changes.tests}</p>
                  </div>
                )}

                {request.changes.advice && (
                  <div>
                    <span className="font-bold text-slate-300">Medical Advice:</span>
                    <p className="text-slate-400 mt-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] p-3 rounded-lg leading-relaxed italic">{request.changes.advice}</p>
                  </div>
                )}
                
                {request.changes.notes && (
                  <div>
                    <span className="font-bold text-slate-300">Doctor's Notes:</span>
                    <p className="text-slate-400 mt-1 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] p-3 rounded-lg leading-relaxed">{request.changes.notes}</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default PatientApprovalCard;
