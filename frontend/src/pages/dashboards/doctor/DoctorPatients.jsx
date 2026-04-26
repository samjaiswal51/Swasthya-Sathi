import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ArrowRight, ShieldCheck, User, CheckCircle, XCircle, Clock, Link as LinkIcon, MessageSquare } from 'lucide-react';
import { toast } from 'react-hot-toast';

const DoctorPatients = () => {
  const [activeTab, setActiveTab] = useState('connected');
  const [searchQuery, setSearchQuery] = useState('');
  const [globalPatients, setGlobalPatients] = useState([]);
  const [myConnections, setMyConnections] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyConnections();
  }, []);

  const fetchMyConnections = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/connections/my-patients');
      setMyConnections(res.data);
    } catch (err) {
      console.error('Error fetching connections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGlobalSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/update-requests/patients/search', {
        params: { query: searchQuery }
      });
      setGlobalPatients(res.data);
    } catch (err) {
      console.error('Error searching patients:', err);
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const requestConnection = async (patientId) => {
    try {
      await axios.post('http://localhost:5000/api/connections/request', { targetUserId: patientId });
      toast.success('Connection request sent to patient! ✅');
      fetchMyConnections();
      setActiveTab('pending');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to request connection');
    }
  };

  const updateConnectionStatus = async (linkId, action) => {
    try {
      await axios.put(`http://localhost:5000/api/connections/${linkId}/${action}`);
      toast.success(`Connection ${action}ed successfully!`);
      fetchMyConnections();
    } catch (err) {
      toast.error(`Failed to ${action} connection`);
    }
  };

  const activePatients = myConnections.filter(c => c.relationStatus === 'active');
  const pendingRequests = myConnections.filter(c => c.relationStatus === 'pending');

  const tabs = [
    { id: 'connected', label: 'My Patients', count: activePatients.length },
    { id: 'pending',   label: 'Pending Requests', count: pendingRequests.length },
    { id: 'find',      label: 'Find Patients' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Hero */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} 
        className="relative overflow-hidden bg-gradient-to-br from-[#022C22] via-[#064E3B] to-emerald-900 rounded-[2.5rem] p-8 sm:p-12 shadow-[0_20px_60px_rgba(16,185,129,0.15)] border border-emerald-500/20">
        
        {/* Floating Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-400/20 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-400/10 rounded-full blur-[60px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 backdrop-blur-md mb-4 text-emerald-100 text-xs font-extrabold uppercase tracking-widest">
              <LinkIcon className="w-3.5 h-3.5" /> Healthcare Network
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight mb-2 drop-shadow-sm">Patient Directory</h1>
            <p className="text-emerald-50/80 text-lg font-medium max-w-xl leading-relaxed">
              Manage your connected patients and create secure healthcare links.
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/doctor-dashboard/sent-requests')}
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md text-white font-extrabold shadow-xl hover:bg-white/20 hover:shadow-emerald-500/20 transition-all whitespace-nowrap"
          >
            <ShieldCheck className="w-5 h-5 text-emerald-300" />
            Record Update Requests
          </motion.button>
        </div>
      </motion.div>

      {/* Segmented Control Tabs */}
      <div className="bg-white/60 backdrop-blur-xl border border-slate-200/60 p-1.5 rounded-full shadow-sm max-w-max mx-auto md:mx-0 overflow-x-auto hide-scrollbar flex w-full md:w-auto">
        <div className="flex gap-1 min-w-max w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="relative px-6 py-3 rounded-full text-sm font-extrabold transition-colors flex-1 md:flex-none text-center outline-none"
            >
              {activeTab === tab.id && (
                <motion.div layoutId="patientTab" className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full shadow-[0_8px_20px_rgba(16,185,129,0.2)]" />
              )}
              <span className={`relative z-10 flex items-center justify-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                {tab.label}
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-lg text-[10px] ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {tab.count}
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {loading && activeTab !== 'find' && (
        <div className="flex justify-center items-center py-20">
          <div className="w-12 h-12 rounded-full border-4 border-emerald-100 border-t-emerald-500 animate-spin shadow-[0_0_15px_rgba(16,185,129,0.3)]" />
        </div>
      )}

      {/* Content Area */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: CONNECTED PATIENTS */}
          {!loading && activeTab === 'connected' && (
            <motion.div key="connected" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-4">
              {activePatients.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border border-slate-200/60 shadow-sm flex flex-col items-center">
                  <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-lg shadow-emerald-500/10">
                    <User className="w-10 h-10 text-emerald-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-2">No Connected Patients</h3>
                  <p className="text-slate-500 font-medium">Head over to "Find Patients" to search and securely connect.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {activePatients.map(conn => (
                    <motion.div whileHover={{ y: -4 }} key={conn._id} className="bg-white/90 backdrop-blur-xl p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] border border-slate-200/60 transition-all flex flex-col justify-between h-full group">
                      <div className="flex items-start gap-5 mb-6">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-100 to-teal-50 text-emerald-700 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-inner border border-emerald-200/50">
                          {conn.patientName.charAt(0)}
                        </div>
                        <div className="pt-1">
                          <h3 className="text-lg font-extrabold text-slate-800 group-hover:text-emerald-700 transition-colors">{conn.patientName}</h3>
                          <p className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">Connected: {new Date(conn.firstConnectedAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => navigate(`/doctor-dashboard/request-update/${conn.patientId}`)}
                          className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-md hover:shadow-lg hover:shadow-emerald-500/25 transition-all text-sm">
                          <ShieldCheck className="w-4 h-4" /> Update Record
                        </button>
                        <button onClick={() => navigate('/doctor-dashboard/chat', { state: { openChatWith: conn.patientId } })}
                          className="flex justify-center items-center gap-2 px-6 py-3 rounded-xl border-2 border-slate-200/80 bg-white text-slate-600 font-extrabold hover:border-emerald-300 hover:text-emerald-600 transition-all text-sm shadow-sm">
                          <MessageSquare className="w-4 h-4" /> Chat
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* TAB 2: PENDING REQUESTS */}
          {!loading && activeTab === 'pending' && (
            <motion.div key="pending" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-4">
              {pendingRequests.length === 0 ? (
                <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] p-16 text-center border border-slate-200/60 shadow-sm flex flex-col items-center">
                  <div className="w-24 h-24 bg-amber-50 rounded-full flex items-center justify-center mb-6 border-8 border-white shadow-lg shadow-amber-500/10">
                    <Clock className="w-10 h-10 text-amber-400" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-800 mb-2">No Pending Requests</h3>
                  <p className="text-slate-500 font-medium">You're all caught up with your patient connections.</p>
                </div>
              ) : (
                pendingRequests.map(conn => (
                  <motion.div whileHover={{ y: -2 }} key={conn._id} className="bg-white/90 backdrop-blur-xl p-5 sm:p-6 rounded-[2rem] shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-200/60 hover:border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-5 transition-all">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-100 to-orange-50 text-amber-700 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-inner border border-amber-200/50">
                        {conn.patientName.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-extrabold text-slate-800">{conn.patientName}</h3>
                        <p className="text-sm font-semibold text-slate-500 mt-0.5">
                          {conn.initiatedBy === 'doctor' ? 'Waiting for patient to accept your request' : 'Patient requested a secure connection'}
                        </p>
                      </div>
                    </div>
                    
                    {conn.initiatedBy === 'patient' ? (
                      <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                        <button onClick={() => updateConnectionStatus(conn._id, 'approve')}
                          className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-md hover:shadow-lg hover:shadow-emerald-500/25 transition-all">
                          <CheckCircle className="w-4 h-4" /> Accept
                        </button>
                        <button onClick={() => updateConnectionStatus(conn._id, 'reject')}
                          className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 py-3 rounded-xl border-2 border-rose-100 bg-rose-50/50 text-rose-600 font-extrabold hover:bg-rose-100 hover:border-rose-200 transition-all">
                          <XCircle className="w-4 h-4" /> Reject
                        </button>
                      </div>
                    ) : (
                      <div className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-amber-50 text-amber-700 font-extrabold rounded-xl text-sm border border-amber-200/50">
                        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" /> Pending Patient Approval
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* TAB 3: FIND PATIENTS */}
          {activeTab === 'find' && (
            <motion.div key="find" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8">
              
              <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-slate-200/80">
                <form onSubmit={handleGlobalSearch} className="relative max-w-3xl mx-auto">
                  <div className="relative group">
                    <input type="text" placeholder="Search patients by name or exact email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-36 py-4 rounded-2xl border-2 border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all shadow-sm text-lg font-medium text-slate-800 placeholder:text-slate-400" />
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                    <button type="submit" disabled={loading}
                      className="absolute right-2 top-2 bottom-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-8 rounded-xl font-extrabold shadow-md hover:shadow-lg hover:shadow-emerald-500/25 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px]">
                      {loading ? <div className="w-5 h-5 rounded-full border-2 border-white/30 border-t-white animate-spin" /> : 'Search'}
                    </button>
                  </div>
                </form>
              </div>

              {globalPatients.length > 0 && (
                <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_15px_40px_rgba(0,0,0,0.05)] border border-slate-200/60 overflow-hidden">
                  <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-sm font-extrabold text-slate-500 uppercase tracking-widest">Search Results ({globalPatients.length})</h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {globalPatients.map(patient => {
                      const existingConn = myConnections.find(c => c.patientId === patient._id);
                      
                      return (
                        <div key={patient._id} className="p-6 sm:px-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-emerald-50/30 transition-colors">
                          <div className="flex items-center gap-5 w-full md:w-auto">
                            <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 text-slate-600 rounded-2xl flex items-center justify-center font-extrabold text-xl shadow-inner border border-slate-200/80 flex-shrink-0">
                              {patient.name.charAt(0)}
                            </div>
                            <div>
                              <h3 className="text-lg font-extrabold text-slate-800">{patient.name}</h3>
                              <p className="text-slate-500 font-medium text-sm mt-0.5">{patient.email}</p>
                            </div>
                          </div>
                          
                          <div className="w-full md:w-auto flex-shrink-0">
                            {existingConn ? (
                              existingConn.relationStatus === 'active' ? (
                                <span className="w-full md:w-auto px-6 py-3 bg-emerald-50 border border-emerald-100 text-emerald-700 font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm">
                                  <CheckCircle className="w-4 h-4" /> Already Connected
                                </span>
                              ) : existingConn.relationStatus === 'pending' ? (
                                <span className="w-full md:w-auto px-6 py-3 bg-amber-50 border border-amber-100 text-amber-700 font-extrabold rounded-xl flex items-center justify-center gap-2 shadow-sm text-sm">
                                  <Clock className="w-4 h-4" /> Request Pending
                                </span>
                              ) : (
                                <button onClick={() => requestConnection(patient._id)}
                                  className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-md hover:shadow-lg hover:shadow-emerald-500/25 transition-all group">
                                  Reconnect <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </button>
                              )
                            ) : (
                              <button onClick={() => requestConnection(patient._id)}
                                className="w-full md:w-auto flex justify-center items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-md hover:shadow-lg hover:shadow-emerald-500/25 transition-all group">
                                Send Link Request <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
};

export default DoctorPatients;
