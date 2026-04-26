import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ShieldCheck, Clock, CheckCircle2, XCircle, ChevronRight, FileText } from 'lucide-react';

const DoctorSentRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/update-requests/doctor');
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching sent requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const StatusBadge = ({ status }) => {
    switch (status) {
      case 'approved':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-full"><CheckCircle2 className="w-3.5 h-3.5" /> Approved</span>;
      case 'rejected':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full"><XCircle className="w-3.5 h-3.5" /> Rejected</span>;
      case 'expired':
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-full"><Clock className="w-3.5 h-3.5" /> Expired</span>;
      default:
        return <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full"><Clock className="w-3.5 h-3.5 animate-pulse" /> Pending Patient</span>;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Sent Update Requests</h1>
          <p className="text-slate-500 mt-2 max-w-xl">
            Track the status of the medical record updates you have requested from your patients.
          </p>
        </div>
        <div className="bg-emerald-50 p-4 rounded-2xl flex items-center gap-4">
          <ShieldCheck className="w-10 h-10 text-emerald-500" />
          <div>
            <p className="text-sm font-bold text-emerald-800">Consent-Based System</p>
            <p className="text-xs text-emerald-600">Records update only upon patient approval.</p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-10 h-10 rounded-full border-4 border-emerald-200 border-t-emerald-500 animate-spin" />
        </div>
      ) : requests.length === 0 ? (
        <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm flex flex-col items-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <FileText className="w-10 h-10 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-800 mb-2">No Sent Requests</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            You haven't sent any record update requests to your patients yet. Go to "My Patients" to start.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {requests.map(req => (
            <div key={req._id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:border-emerald-200 transition-colors flex flex-col md:flex-row gap-6 justify-between md:items-center group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-bold text-slate-500">REQ-{req._id.substring(req._id.length - 6).toUpperCase()}</span>
                  <StatusBadge status={req.status} />
                  {req.priority === 'Urgent' && (
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[10px] font-bold uppercase rounded border border-red-100">Urgent</span>
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">
                  Update requested for Patient
                </h3>
                <p className="text-sm font-medium text-emerald-600 mb-3">
                  Type: {req.type}
                </p>
                <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                  <span>Sent: {formatDate(req.createdAt)}</span>
                  {req.reviewedAt && <span>Reviewed: {formatDate(req.reviewedAt)}</span>}
                </div>
                
                {req.status === 'rejected' && req.patientResponseNote && (
                  <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 text-sm text-red-800 rounded-r-lg">
                    <span className="font-bold">Rejection Reason:</span> {req.patientResponseNote}
                  </div>
                )}
              </div>

              <div className="w-full md:w-auto">
                <button 
                  onClick={() => alert(JSON.stringify(req.changes, null, 2))}
                  className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border-2 border-slate-100 text-slate-600 font-bold hover:bg-slate-50 hover:border-slate-200 transition-all"
                >
                  View Details <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorSentRequests;
