import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, X, Loader2, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const glass = "bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl";
const glassHover = "hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300";

const UploadReportCard = ({ onAnalysisComplete }) => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progressState, setProgressState] = useState(''); // 'extracting', 'analyzing', 'generating'
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const validTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(selectedFile.type)) {
      toast.error('Only PDF, JPG, and PNG files are allowed.');
      return false;
    }
    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB.');
      return false;
    }
    return true;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    setProgressState('extracting');
    
    const formData = new FormData();
    formData.append('report', file);

    try {
      const token = localStorage.getItem('token');
      
      // Simulate progress states for UX
      setTimeout(() => setProgressState('analyzing'), 1500);
      setTimeout(() => setProgressState('generating'), 3000);

      const res = await axios.post('http://localhost:5000/api/patient/report-analyzer/upload', formData, {
        headers: { 
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Report analyzed successfully!');
      onAnalysisComplete(res.data);
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to analyze report.');
    } finally {
      setUploading(false);
      setProgressState('');
    }
  };

  const getProgressMessage = () => {
    switch (progressState) {
      case 'extracting': return 'Extracting text from document...';
      case 'analyzing': return 'Medical AI analyzing parameters...';
      case 'generating': return 'Generating patient-friendly summary...';
      default: return 'Processing...';
    }
  };

  return (
    <div className={`${glass} ${glassHover} p-6 sm:p-8`}>
      {!file ? (
        <div 
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300 ${
            isDragging 
              ? 'border-[rgba(59,130,246,0.55)] bg-[rgba(37,99,235,0.08)] shadow-[0_0_30px_rgba(37,99,235,0.15)]' 
              : 'border-[rgba(59,130,246,0.20)] hover:border-[rgba(59,130,246,0.45)] hover:bg-[rgba(37,99,235,0.04)]'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleFileSelect}
            accept=".pdf,.jpg,.jpeg,.png"
            className="hidden" 
          />
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.22)] shadow-[0_0_20px_rgba(37,99,235,0.2)]">
            <UploadCloud className="w-8 h-8 text-blue-400" style={{ filter: 'drop-shadow(0 0 8px rgba(37,99,235,0.7))' }} />
          </div>
          <h3 className="text-lg font-extrabold text-slate-100 tracking-tight mb-1">Click or drag report to upload</h3>
          <p className="text-sm text-slate-400 font-medium mb-4">Max 10MB</p>
          <div className="flex items-center justify-center gap-2">
            <span className="bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">PDF</span>
            <span className="bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">JPG</span>
            <span className="bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-400">PNG</span>
          </div>
        </div>
      ) : (
        <div className="animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-xl p-4 flex items-center justify-between mb-6 backdrop-blur-sm">
            <div className="flex items-center space-x-4 overflow-hidden">
              <div className="w-12 h-12 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-xl flex items-center justify-center shrink-0">
                {file.type === 'application/pdf' ? <FileText className="w-6 h-6 text-rose-400" /> : <ImageIcon className="w-6 h-6 text-blue-400" />}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-100 truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
              </div>
            </div>
            {!uploading && (
              <button onClick={() => setFile(null)} className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-[rgba(244,63,94,0.08)] border border-transparent hover:border-[rgba(244,63,94,0.20)] transition-all duration-200 shrink-0">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {uploading ? (
            <div className="bg-[rgba(37,99,235,0.06)] border border-[rgba(59,130,246,0.18)] rounded-xl p-6 text-center backdrop-blur-sm">
              <div className="relative w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="w-12 h-12 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute" />
                <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="w-8 h-8 rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-500 absolute" />
              </div>
              <p className="text-sm font-semibold text-blue-300 tracking-wide mb-4">{getProgressMessage()}</p>
              
              <div className="flex justify-center gap-2">
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${progressState === 'extracting' ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-[rgba(255,255,255,0.03)] text-slate-500 border border-[rgba(59,130,246,0.12)]'}`}>
                  Extracting
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${progressState === 'analyzing' ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-[rgba(255,255,255,0.03)] text-slate-500 border border-[rgba(59,130,246,0.12)]'}`}>
                  Analyzing
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${progressState === 'generating' ? 'bg-blue-600 text-white shadow-[0_0_12px_rgba(37,99,235,0.5)]' : 'bg-[rgba(255,255,255,0.03)] text-slate-500 border border-[rgba(59,130,246,0.12)]'}`}>
                  Generating
                </div>
              </div>
            </div>
          ) : (
            <motion.button 
              whileHover={{ scale:1.02 }} 
              whileTap={{ scale:0.95 }}
              onClick={handleUpload}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold py-3 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)] transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Analyze Report with AI</span>
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
};

export default UploadReportCard;
