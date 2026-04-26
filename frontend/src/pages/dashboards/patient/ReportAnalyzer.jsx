import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Stethoscope } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import UploadReportCard from '../../../components/dashboard/UploadReportCard';
import AnalysisResult from '../../../components/dashboard/AnalysisResult';
import ReportHistory from '../../../components/dashboard/ReportHistory';

const ReportAnalyzer = () => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [activeResult, setActiveResult] = useState(null); // Full result object to display

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/patient/report-analyzer/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load analysis history');
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAnalysisComplete = (newResult) => {
    setActiveResult(newResult);
    setHistory([newResult, ...history]); // Prepend new result to history list
  };

  const handleSelectHistoryItem = async (item) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/patient/report-analyzer/${item._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveResult(res.data);
    } catch (error) {
      toast.error('Failed to load the full report');
    }
  };

  const handleRemoveHistoryItem = (id) => {
    setHistory(history.filter(h => h._id !== id));
    if (activeResult && activeResult._id === id) {
      setActiveResult(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-5xl mx-auto space-y-6 pb-20 relative"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl bg-[rgba(37,99,235,0.10)] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl bg-[rgba(6,182,212,0.07)] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 w-64 h-64 rounded-full blur-3xl bg-[rgba(6,182,212,0.05)] pointer-events-none -translate-x-1/2 -translate-y-1/2" />
      
      {/* Header */}
      {!activeResult && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-3">
            <div
              className="w-11 h-11 bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.22)] rounded-xl flex items-center justify-center shadow-[0_0_14px_rgba(37,99,235,0.2)]"
            >
              <Stethoscope className="w-6 h-6 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.7))' }} />
            </div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight border-l-[3px] border-l-[#2563EB] pl-4">
              AI Report Analyzer
            </h1>
          </div>
          <p className="text-slate-400 text-base font-medium ml-[3.75rem] leading-relaxed">
            Upload your medical report and let AI translate it into simple, understandable insights instantly.
          </p>
        </motion.div>
      )}

      {/* Main Content Area */}
      {activeResult ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <AnalysisResult result={activeResult} onBack={() => setActiveResult(null)} />
        </motion.div>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <UploadReportCard onAnalysisComplete={handleAnalysisComplete} />
          </motion.div>
          
          {loadingHistory ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
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
                Loading analysis history...
              </motion.p>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.5 }}
            >
              <ReportHistory 
                history={history} 
                onSelect={handleSelectHistoryItem} 
                onDelete={handleRemoveHistoryItem} 
              />
            </motion.div>
          )}
        </>
      )}
      
    </motion.div>
  );
};

export default ReportAnalyzer;
