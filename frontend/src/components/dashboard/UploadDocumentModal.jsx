import React, { useState } from 'react';
import axios from 'axios';
import { X, UploadCloud, File, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const UploadDocumentModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    type: 'Prescription',
    doctorName: '',
    hospitalName: '',
    reportDate: '',
    notes: '',
    tags: ''
  });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size exceeds 10MB limit");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }

    setUploading(true);
    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('document', file);

    try {
      await axios.post('http://localhost:5000/api/patient/documents', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success("Medical record uploaded successfully");
      onUploadSuccess();
      onClose();
      // Reset form
      setFormData({ title: '', type: 'Prescription', doctorName: '', hospitalName: '', reportDate: '', notes: '', tags: '' });
      setFile(null);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to upload document");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0A1628] border border-[rgba(59,130,246,0.20)] rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.8)] w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 z-10 bg-[#0A1628] border-b border-[rgba(59,130,246,0.12)] px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-extrabold text-slate-100">Upload New Record</h2>
          <button onClick={onClose} className="p-2 text-slate-500 hover:text-slate-300 rounded-lg hover:bg-[rgba(255,255,255,0.06)] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* File Upload Zone */}
          <div>
            <label className="block text-sm font-semibold text-slate-400 mb-1.5">Document File <span className="text-red-400">*</span></label>
            {!file ? (
              <div className="border-2 border-dashed border-[rgba(59,130,246,0.25)] rounded-2xl p-8 text-center bg-[rgba(37,99,235,0.04)] hover:bg-[rgba(37,99,235,0.08)] hover:border-[rgba(59,130,246,0.45)] transition-all duration-300 cursor-pointer relative">
                <input type="file" required onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <div className="w-12 h-12 bg-[rgba(37,99,235,0.12)] border border-[rgba(59,130,246,0.25)] rounded-full flex items-center justify-center mx-auto mb-3 shadow-[0_0_16px_rgba(37,99,235,0.2)]">
                  <UploadCloud className="w-6 h-6 text-blue-400" style={{ filter:'drop-shadow(0 0 6px rgba(37,99,235,0.7))' }} />
                </div>
                <p className="text-sm font-semibold text-slate-200">Click to upload or drag and drop</p>
                <p className="text-xs text-slate-500 mt-1">PDF, JPG, PNG, DOC (max 10MB)</p>
              </div>
            ) : (
              <div className="flex items-center justify-between p-4 bg-[rgba(37,99,235,0.06)] border border-[rgba(59,130,246,0.20)] rounded-xl">
                <div className="flex items-center space-x-3 overflow-hidden">
                  <div className="p-2 bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg">
                    <File className="w-6 h-6 text-blue-400" />
                  </div>
                  <div className="truncate">
                    <p className="text-sm font-semibold text-slate-100 truncate">{file.name}</p>
                    <p className="text-xs text-slate-500">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
                <button type="button" onClick={() => setFile(null)} className="p-2 text-red-400 hover:bg-[rgba(239,68,68,0.10)] rounded-lg transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Record Title <span className="text-red-400">*</span></label>
              <input required type="text" name="title" value={formData.title} onChange={handleChange} placeholder="e.g. Sugar Test March 2026" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Record Type <span className="text-red-400">*</span></label>
              <select required name="type" value={formData.type} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300" style={{ colorScheme: 'dark' }}>
                {['Prescription', 'Lab Report', 'X-Ray', 'MRI', 'CT Scan', 'ECG', 'BP Reading', 'Sugar Reading', 'Vaccination', 'Discharge Summary', 'Other'].map(type => (
                  <option key={type} value={type} className="bg-[#0b1526]">{type}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Report Date <span className="text-red-400">*</span></label>
              <input required type="date" name="reportDate" value={formData.reportDate} onChange={handleChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300" style={{ colorScheme: 'dark' }} />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Doctor Name</label>
              <input type="text" name="doctorName" value={formData.doctorName} onChange={handleChange} placeholder="Dr. John Doe" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300" />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Hospital / Clinic</label>
              <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleChange} placeholder="City Care Hospital" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Tags (comma separated)</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleChange} placeholder="e.g. Diabetes, Heart, Allergy" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300" />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-400 mb-1.5">Notes (optional)</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} rows="3" placeholder="Any additional details..." className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300"></textarea>
            </div>
          </div>

          <div className="sticky bottom-0 bg-[#0A1628] pt-4 pb-2 border-t border-[rgba(59,130,246,0.12)] flex justify-end space-x-3">
            <button type="button" onClick={onClose} disabled={uploading} className="px-6 py-2.5 rounded-xl border border-[rgba(255,255,255,0.10)] text-slate-400 font-semibold hover:bg-[rgba(255,255,255,0.05)] hover:text-slate-200 transition-all disabled:opacity-50">
              Cancel
            </button>
            <button type="submit" disabled={uploading} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-bold flex items-center space-x-2 shadow-[0_4px_14px_rgba(37,99,235,0.35)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
              {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <UploadCloud className="w-5 h-5" />}
              <span>{uploading ? 'Uploading...' : 'Upload Record'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal;
