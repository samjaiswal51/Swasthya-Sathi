import React from 'react';
import { ShieldAlert, CheckCircle, AlertTriangle, UserPlus, HeartPulse, FileText, Download, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const glass = "bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl";

const AnalysisResult = ({ result, onBack }) => {
  if (!result) return null;

  const getRiskColor = (level) => {
    switch (level) {
      case 'Normal': return 'border-l-[3px] border-l-emerald-500 bg-[rgba(16,185,129,0.06)]';
      case 'Mild Concern': return 'border-l-[3px] border-l-amber-500 bg-[rgba(245,158,11,0.06)]';
      case 'Needs Attention': return 'border-l-[3px] border-l-rose-500 bg-[rgba(244,63,94,0.06)]';
      default: return 'border-l-[3px] border-l-slate-500 bg-[rgba(255,255,255,0.02)]';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'Normal': return <CheckCircle className="w-8 h-8 text-emerald-500" style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.6))' }} />;
      case 'Mild Concern': return <AlertTriangle className="w-8 h-8 text-amber-500" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.6))' }} />;
      case 'Needs Attention': return <ShieldAlert className="w-8 h-8 text-rose-500" style={{ filter: 'drop-shadow(0 0 8px rgba(244,63,94,0.6))' }} />;
      default: return <FileText className="w-8 h-8 text-slate-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'bg-[rgba(16,185,129,0.12)] text-emerald-400 border border-[rgba(16,185,129,0.25)]';
      case 'High': return 'bg-[rgba(244,63,94,0.12)] text-rose-400 border border-[rgba(244,63,94,0.25)]';
      case 'Low': return 'bg-[rgba(245,158,11,0.12)] text-amber-400 border border-[rgba(245,158,11,0.25)]';
      default: return 'bg-[rgba(255,255,255,0.05)] text-slate-400 border border-[rgba(255,255,255,0.10)]';
    }
  };

  const downloadPDF = () => {
    window.print(); // Simple trick to download as PDF. In a real app, use html2pdf or jsPDF.
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="space-y-6"
    >
      
      {/* Header Actions */}
      <div className="flex justify-between items-center mb-6">
        <button onClick={onBack} className="flex items-center space-x-2 text-slate-400 font-medium hover:text-blue-400 transition-colors duration-200 group">
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
          <span>Back to Analyzer</span>
        </button>
        <button onClick={downloadPDF} className="flex items-center space-x-2 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.20)] text-slate-300 hover:text-slate-100 hover:border-[rgba(59,130,246,0.40)] hover:bg-[rgba(37,99,235,0.08)] px-4 py-2 rounded-xl font-medium transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
          <Download className="w-4 h-4 text-blue-400" />
          <span>Download Summary</span>
        </button>
      </div>

      <div id="print-area" className={`${glass} rounded-3xl overflow-hidden`}>
        
        {/* Top Status Card */}
        <div className={`p-8 border-b border-[rgba(59,130,246,0.12)] ${getRiskColor(result.riskLevel)}`}>
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-2xl flex items-center justify-center backdrop-blur-sm p-3">
              {getRiskIcon(result.riskLevel)}
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-1">Overall Assessment</p>
              <h2 className="text-3xl font-extrabold text-slate-100 tracking-tight">{result.riskLevel}</h2>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-8">
          
          {/* AI Explanation */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h3 className="text-lg font-extrabold text-slate-100 tracking-tight flex items-center mb-3">
              <HeartPulse className="w-5 h-5 mr-2 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.6))' }} />
              Simple Explanation
            </h3>
            <div className="bg-[rgba(37,99,235,0.06)] border border-[rgba(59,130,246,0.18)] rounded-xl p-5 backdrop-blur-sm">
              <p className="text-slate-300 leading-relaxed text-base font-medium">
                {result.aiSummary}
              </p>
            </div>
          </motion.section>

          {/* Abnormal Values Table */}
          {result.abnormalValues && result.abnormalValues.length > 0 && (
            <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-lg font-extrabold text-slate-100 tracking-tight flex items-center mb-4">
                <FileText className="w-5 h-5 mr-2 text-blue-400" />
                Detected Parameters
              </h3>
              <div className="overflow-hidden rounded-xl border border-[rgba(59,130,246,0.15)]">
                <table className="min-w-full divide-y divide-[rgba(59,130,246,0.08)]">
                  <thead className="bg-[rgba(255,255,255,0.02)]">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-bold">Parameter</th>
                      <th scope="col" className="px-6 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-bold">Value</th>
                      <th scope="col" className="px-6 py-3 text-left text-[10px] uppercase tracking-widest text-slate-500 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[rgba(59,130,246,0.08)]">
                    {result.abnormalValues.map((val, idx) => (
                      <tr key={idx} className="hover:bg-[rgba(37,99,235,0.05)] transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-100">{val.parameter}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-300">{val.value}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${getStatusColor(val.status)}`}>
                            {val.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.section>
          )}

          {/* Doctor Recommendation */}
          <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(59,130,246,0.12)] rounded-2xl p-6 flex items-start space-x-4 border-l-[3px] border-l-[#2563EB]">
            <div className="w-12 h-12 bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.22)] rounded-xl flex items-center justify-center shrink-0">
              <UserPlus className="w-6 h-6 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.6))' }} />
            </div>
            <div>
              <h4 className="font-extrabold text-slate-100 text-base">Recommended Next Step</h4>
              <p className="text-sm text-slate-400 mt-1">
                Based on these findings, we recommend consulting a <span className="font-bold text-blue-400">{result.recommendedDoctor}</span> for a professional clinical diagnosis.
              </p>
            </div>
          </motion.section>

        </div>
      </div>
    </motion.div>
  );
};

export default AnalysisResult;
