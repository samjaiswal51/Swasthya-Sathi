import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, MessageSquare, FileText, CheckCircle, XCircle, Clock, UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const glass = "bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl";
const glassHover = "hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300";

const MyDoctors = () => {
  const [activeTab, setActiveTab] = useState('active');
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchConnections();
  }, []);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/connections/my-doctors');
      setConnections(res.data);
    } catch (err) {
      console.error('Error fetching doctors:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateConnectionStatus = async (linkId, action) => {
    try {
      await axios.put(`http://localhost:5000/api/connections/${linkId}/${action}`);
      fetchConnections();
    } catch (err) {
      alert(`Failed to ${action} connection`);
    }
  };

  const activeDoctors = connections.filter(c => c.relationStatus === 'active');
  const pendingRequests = connections.filter(c => c.relationStatus === 'pending');

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-5xl mx-auto space-y-6 pb-12 relative"
    >
      {/* Decorative orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl bg-[rgba(37,99,235,0.08)] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl bg-[rgba(6,182,212,0.06)] pointer-events-none" />

      {/* Header */}
      <div className={`${glass} ${glassHover} p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10`}>
        <div className="flex items-center">
          <div className="w-11 h-11 bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.22)] rounded-xl flex items-center justify-center shadow-[0_0_14px_rgba(37,99,235,0.2)] mr-4">
            <UserCheck className="w-6 h-6 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.7))' }} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight border-l-[3px] border-l-[#2563EB] pl-4">My Medical Team</h1>
            <p className="text-slate-400 font-medium mt-2 max-w-xl leading-relaxed pl-4">
              Manage your connected doctors. Only active doctors can request updates to your medical records.
            </p>
          </div>
        </div>
        <motion.button 
          whileHover={{ scale: 1.03 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/patient-dashboard/find-doctor')}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_0_24px_rgba(37,99,235,0.55)] transition-all duration-300 whitespace-nowrap"
        >
          <UserCheck className="w-5 h-5 text-white" />
          Find More Doctors
        </motion.button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-[rgba(59,130,246,0.12)] pb-0 relative z-10">
        <button
          onClick={() => setActiveTab('active')}
          className={activeTab === 'active' 
              ? 'border-b-2 border-blue-500 text-blue-400 font-extrabold pb-3 px-4 transition-all duration-200' 
              : 'border-b-2 border-transparent text-slate-500 font-bold pb-3 px-4 hover:text-slate-300 transition-all duration-200'
          }
        >
          Connected Doctors
          <span className="ml-1.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(59,130,246,0.15)] px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide">
            {activeDoctors.length}
          </span>
        </button>
        <button
          onClick={() => setActiveTab('pending')}
          className={activeTab === 'pending' 
              ? 'border-b-2 border-amber-500 text-amber-400 font-extrabold pb-3 px-4 transition-all duration-200' 
              : 'border-b-2 border-transparent text-slate-500 font-bold pb-3 px-4 hover:text-slate-300 transition-all duration-200'
          }
        >
          Connection Requests
          <span className="ml-1.5 bg-[rgba(255,255,255,0.05)] border border-[rgba(59,130,246,0.15)] px-2 py-0.5 rounded-full text-[10px] font-extrabold tracking-wide">
            {pendingRequests.length}
          </span>
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center h-64 space-y-4 relative z-10">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
              className="w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-10 h-10 rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-500 absolute"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
            className="text-slate-400 text-sm font-medium tracking-wide"
          >
            Loading your medical team...
          </motion.p>
        </div>
      ) : activeTab === 'active' ? (
        <div className="space-y-4 relative z-10">
          {activeDoctors.length === 0 ? (
            <div className={`${glass} rounded-3xl p-16 text-center flex flex-col items-center`}>
              <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[rgba(37,99,235,0.08)] border border-[rgba(59,130,246,0.15)] shadow-[0_0_30px_rgba(37,99,235,0.12)]">
                <motion.div animate={{ y:[0,-4,0] }} transition={{ repeat:Infinity, duration:3, ease:"easeInOut" }}>
                  <UserCheck className="w-10 h-10 text-blue-500/40" />
                </motion.div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-100 tracking-tight mb-2">No Connected Doctors</h3>
              <p className="text-slate-400 font-medium">You haven't connected with any doctors yet. Go to Find Doctor to build your medical team.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeDoctors.map((conn, index) => (
                <motion.div 
                  key={conn._id} 
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.4 }}
                  whileHover={{ y: -3 }}
                  className={`${glass} ${glassHover} p-6 rounded-2xl flex flex-col justify-between`}
                >
                  <div className="flex items-start gap-4 mb-6">
                    <img 
                      src={conn.doctorDetails?.profilePhoto || 'https://via.placeholder.com/150'} 
                      alt={conn.doctorName}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-[rgba(59,130,246,0.25)] shadow-[0_0_14px_rgba(37,99,235,0.15)]"
                    />
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-100 flex items-center gap-1.5">
                        {conn.doctorName}
                        <ShieldAlert className="w-4 h-4 text-emerald-500" style={{ filter: 'drop-shadow(0 0 5px rgba(16,185,129,0.5))' }} />
                      </h3>
                      <p className="text-sm font-medium text-slate-400">{conn.doctorDetails?.specialization || 'General Physician'}</p>
                      <p className="text-xs text-slate-500 mt-1">Connected: {new Date(conn.firstConnectedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div className="border-t border-[rgba(59,130,246,0.08)] pt-4 mt-2" />
                  <div className="flex gap-2">
                    <button 
                      onClick={() => navigate('/patient-dashboard/chat')}
                      className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.20)] text-blue-400 font-bold text-sm hover:bg-[rgba(37,99,235,0.18)] hover:border-[rgba(59,130,246,0.38)] hover:shadow-[0_0_12px_rgba(37,99,235,0.2)] transition-all duration-200"
                    >
                      <MessageSquare className="w-4 h-4 text-blue-400" /> Message
                    </button>
                    <button 
                      onClick={() => {
                        if(window.confirm('Are you sure you want to disconnect from this doctor? They will lose access to request updates.')) {
                          updateConnectionStatus(conn._id, 'end');
                        }
                      }}
                      className="flex-1 flex justify-center items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[rgba(244,63,94,0.06)] border border-[rgba(244,63,94,0.18)] text-rose-400 font-bold text-sm hover:bg-[rgba(244,63,94,0.14)] hover:border-[rgba(244,63,94,0.32)] hover:shadow-[0_0_12px_rgba(244,63,94,0.15)] transition-all duration-200"
                    >
                      <XCircle className="w-4 h-4 text-rose-400" /> Disconnect
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4 relative z-10">
          {pendingRequests.length === 0 ? (
            <div className={`${glass} rounded-3xl p-16 text-center flex flex-col items-center`}>
              <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center bg-[rgba(245,158,11,0.08)] border border-[rgba(245,158,11,0.15)] shadow-[0_0_24px_rgba(245,158,11,0.10)]">
                <motion.div animate={{ y:[0,-4,0] }} transition={{ repeat:Infinity, duration:3, ease:"easeInOut" }}>
                  <Clock className="w-10 h-10 text-amber-500/50" />
                </motion.div>
              </div>
              <h3 className="text-xl font-extrabold text-slate-100 mb-2">No Pending Requests</h3>
            </div>
          ) : (
            pendingRequests.map((conn, index) => (
              <motion.div 
                key={conn._id} 
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.4 }}
                className={`${glass} p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border-l-[3px] border-l-[#F59E0B]`}
              >
                <div className="flex items-center gap-4">
                  <img 
                    src={conn.doctorDetails?.profilePhoto || 'https://via.placeholder.com/150'} 
                    alt={conn.doctorName}
                    className="w-14 h-14 rounded-full object-cover border-2 border-[rgba(245,158,11,0.30)] shadow-[0_0_12px_rgba(245,158,11,0.15)]"
                  />
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-100">{conn.doctorName}</h3>
                    <p className={`text-sm font-medium ${conn.initiatedBy === 'patient' ? 'text-blue-400' : 'text-amber-400'}`}>
                      {conn.initiatedBy === 'patient' ? 'You sent a connection request' : 'Requested to connect with you'}
                    </p>
                  </div>
                </div>
                
                {conn.initiatedBy === 'doctor' ? (
                  <div className="flex gap-2 w-full md:w-auto">
                    <button 
                      onClick={() => updateConnectionStatus(conn._id, 'approve')}
                      className="flex justify-center items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-[0_4px_12px_rgba(37,99,235,0.35)] hover:shadow-[0_0_20px_rgba(37,99,235,0.50)] transition-all duration-300"
                    >
                      <CheckCircle className="w-4 h-4 text-white" style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.4))' }} /> Approve
                    </button>
                    <button 
                      onClick={() => updateConnectionStatus(conn._id, 'reject')}
                      className="flex justify-center items-center gap-1.5 px-5 py-2.5 rounded-xl font-bold bg-[rgba(244,63,94,0.06)] border border-[rgba(244,63,94,0.20)] text-rose-400 hover:bg-[rgba(244,63,94,0.14)] hover:border-[rgba(244,63,94,0.35)] hover:shadow-[0_0_14px_rgba(244,63,94,0.15)] transition-all duration-200"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                ) : (
                  <span className="px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.12)] text-slate-400 backdrop-blur-sm">
                    <Clock className="w-4 h-4 text-slate-500" style={{ filter: 'drop-shadow(0 0 4px rgba(148,163,184,0.3))' }} /> Waiting for Doctor
                  </span>
                )}
              </motion.div>
            ))
          )}
        </div>
      )}
    </motion.div>
  );
};

export default MyDoctors;
