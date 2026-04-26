import React, { useState } from 'react';
import axios from 'axios';
import { FileText, Download, Trash2, Edit, Star, Pin, Calendar, Building2, User, Eye, File, FileImage, Loader2 } from 'lucide-react';

const DocumentCard = ({ document, onEdit, onDelete, onTogglePin, onToggleFavorite }) => {
  const getFileIcon = (mimeType) => {
    if (mimeType.includes('pdf')) return <FileText className="w-5 h-5 text-red-400" />;
    if (mimeType.includes('image')) return <FileImage className="w-5 h-5 text-blue-400" />;
    return <File className="w-5 h-5 text-slate-500" />;
  };

  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'Prescription': return 'bg-[rgba(37,99,235,0.15)] text-blue-400 border border-[rgba(59,130,246,0.25)]';
      case 'Lab Report':   return 'bg-[rgba(139,92,246,0.15)] text-violet-400 border border-[rgba(139,92,246,0.25)]';
      case 'X-Ray':
      case 'MRI':
      case 'CT Scan':      return 'bg-[rgba(245,158,11,0.15)] text-amber-400 border border-[rgba(245,158,11,0.25)]';
      case 'Vaccination':  return 'bg-[rgba(16,185,129,0.15)] text-emerald-400 border border-[rgba(16,185,129,0.25)]';
      default:             return 'bg-[rgba(255,255,255,0.06)] text-slate-400 border border-[rgba(255,255,255,0.10)]';
    }
  };

  const [viewing, setViewing] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleView = async () => {
    try {
      setViewing(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/patient/documents/${document._id}/view`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      const fileUrl = window.URL.createObjectURL(new Blob([res.data], { type: document.mimeType || res.headers['content-type'] }));
      window.open(fileUrl, '_blank');
    } catch (err) {
      console.error(err);
      alert('Failed to view document securely.');
    } finally {
      setViewing(false);
    }
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/patient/documents/${document._id}/download`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });
      
      const fileUrl = window.URL.createObjectURL(new Blob([res.data]));
      
      // Force download via a hidden anchor tag
      const a = window.document.createElement('a');
      a.href = fileUrl;
      a.download = document.fileName;
      window.document.body.appendChild(a);
      a.click();
      window.document.body.removeChild(a);
      window.URL.revokeObjectURL(fileUrl);
    } catch (err) {
      console.error(err);
      alert('Failed to download document securely.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className={`rounded-2xl border p-5 transition-all duration-300 relative group flex flex-col h-full backdrop-blur-[16px] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
      ${document.isPinned
        ? 'bg-[rgba(37,99,235,0.06)] border-[rgba(59,130,246,0.35)] shadow-[0_0_20px_rgba(37,99,235,0.15)]'
        : 'bg-[rgba(255,255,255,0.03)] border-[rgba(59,130,246,0.12)] hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_20px_rgba(59,130,246,0.12)]'
      }`}>
      
      {/* Top Actions: Pin & Favorite */}
      <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onTogglePin(document._id, !document.isPinned)} className={`p-1.5 rounded-full transition-colors ${document.isPinned ? 'bg-[rgba(37,99,235,0.15)] text-blue-400 opacity-100' : 'bg-[rgba(255,255,255,0.04)] text-slate-500 hover:bg-[rgba(37,99,235,0.10)] hover:text-blue-400'}`}>
          <Pin className="w-4 h-4" fill={document.isPinned ? "currentColor" : "none"} />
        </button>
        <button onClick={() => onToggleFavorite(document._id, !document.isFavorite)} className={`p-1.5 rounded-full transition-colors ${document.isFavorite ? 'bg-[rgba(245,158,11,0.15)] text-amber-400 opacity-100' : 'bg-[rgba(255,255,255,0.04)] text-slate-500 hover:bg-[rgba(245,158,11,0.10)] hover:text-amber-400'}`}>
          <Star className="w-4 h-4" fill={document.isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Persistent indicators if active (when not hovering) */}
      <div className="absolute top-4 right-4 flex space-x-1 group-hover:hidden">
        {document.isPinned && <Pin className="w-4 h-4 text-blue-400" fill="currentColor" />}
        {document.isFavorite && <Star className="w-4 h-4 text-amber-400" fill="currentColor" />}
      </div>

      <div className="flex items-start space-x-3 mb-4 pr-16">
        <div className="p-3 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-xl">
          {getFileIcon(document.mimeType)}
        </div>
        <div>
          <h3 className="font-bold text-slate-100 line-clamp-1" title={document.title}>{document.title}</h3>
          <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium mt-1 ${getTypeBadgeColor(document.type)}`}>
            {document.type}
          </span>
        </div>
      </div>

      <div className="space-y-2.5 mb-6 flex-1">
        <div className="flex items-center text-sm text-slate-400">
          <Calendar className="w-4 h-4 mr-2 text-slate-600" />
          {new Date(document.reportDate).toLocaleDateString()}
        </div>
        {document.hospitalName && (
          <div className="flex items-center text-sm text-slate-400">
            <Building2 className="w-4 h-4 mr-2 text-slate-600" />
            <span className="truncate">{document.hospitalName}</span>
          </div>
        )}
        {document.doctorName && (
          <div className="flex items-center text-sm text-slate-400">
            <User className="w-4 h-4 mr-2 text-slate-600" />
            <span className="truncate">Dr. {document.doctorName}</span>
          </div>
        )}
      </div>

      {document.tags && document.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {document.tags.map(tag => (
            <span key={tag} className="px-2 py-1 bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.20)] text-blue-400 text-xs rounded-md font-medium">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Action Buttons */}
      {/* Bottom Action Buttons */}
      <div className="grid grid-cols-4 gap-2 pt-4 border-t border-[rgba(59,130,246,0.10)] mt-auto">
        <button 
          onClick={handleView}
          disabled={viewing}
          className="col-span-2 flex items-center justify-center space-x-1 py-2 bg-[rgba(37,99,235,0.10)] hover:bg-[rgba(37,99,235,0.20)] text-blue-400 rounded-lg text-sm font-medium transition-all duration-200 border border-[rgba(59,130,246,0.20)] hover:border-[rgba(59,130,246,0.35)] disabled:opacity-50"
        >
          {viewing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Eye className="w-4 h-4" />}
          <span>{viewing ? 'Opening...' : 'View'}</span>
        </button>
        <button 
          onClick={handleDownload}
          disabled={downloading}
          className="flex items-center justify-center py-2 bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-slate-400 hover:text-slate-200 rounded-lg transition-all duration-200 border border-[rgba(255,255,255,0.08)] disabled:opacity-50"
          title="Download"
        >
          {downloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        </button>
        <button 
          onClick={() => onDelete(document._id)}
          className="flex items-center justify-center py-2 bg-[rgba(239,68,68,0.08)] hover:bg-[rgba(239,68,68,0.18)] text-red-400 rounded-lg transition-all duration-200 border border-[rgba(239,68,68,0.15)] hover:border-[rgba(239,68,68,0.35)]"
          title="Delete"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
