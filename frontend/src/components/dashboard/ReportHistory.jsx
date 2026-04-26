import React from 'react';
import { FileText, ChevronRight, Clock, Trash2, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import toast from 'react-hot-toast';

const ReportHistory = ({ history, onSelect, onDelete }) => {
  if (!history || history.length === 0) return null;

  const getRiskIcon = (level) => {
    switch (level) {
      case 'Normal': return <CheckCircle className="w-5 h-5 text-emerald-500" style={{ filter: 'drop-shadow(0 0 6px rgba(16,185,129,0.6))' }} />;
      case 'Mild Concern': return <AlertTriangle className="w-5 h-5 text-amber-500" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.6))' }} />;
      case 'Needs Attention': return <ShieldAlert className="w-5 h-5 text-rose-500" style={{ filter: 'drop-shadow(0 0 6px rgba(244,63,94,0.6))' }} />;
      default: return <FileText className="w-5 h-5 text-slate-500" />;
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this report history permanently?")) return;
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patient/report-analyzer/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onDelete(id);
      toast.success('Report history deleted');
    } catch (error) {
      toast.error('Failed to delete report');
    }
  };

  return (
    <div className="mt-12 animate-in fade-in duration-700">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-extrabold text-slate-100 tracking-tight flex items-center border-l-[3px] border-l-[#2563EB] pl-4">
          <Clock className="w-5 h-5 mr-2 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.5))' }} />
          Previous Analyses
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {history.map((item, i) => (
          <motion.div
            key={item._id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            whileHover={{ y: -2 }}
            onClick={() => onSelect(item)}
            className="bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_20px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl p-5 cursor-pointer transition-all duration-300 flex flex-col group relative"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-xl flex items-center justify-center group-hover:border-[rgba(59,130,246,0.30)] group-hover:bg-[rgba(37,99,235,0.08)] transition-all duration-300">
                  {getRiskIcon(item.riskLevel)}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-100 truncate text-sm">{item.originalFileName}</h3>
                  <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <button 
                onClick={(e) => handleDelete(item._id, e)}
                className="p-1.5 rounded-lg text-slate-600 hover:text-rose-400 hover:bg-[rgba(244,63,94,0.08)] border border-transparent hover:border-[rgba(244,63,94,0.20)] transition-all duration-200 opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-auto pt-4 border-t border-[rgba(59,130,246,0.08)] flex items-center justify-between text-sm">
              <span className="text-slate-400 font-medium text-sm">{item.riskLevel}</span>
              <span className="text-blue-400 font-semibold flex items-center group-hover:text-blue-300 transition-colors duration-200">
                View Report <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReportHistory;
