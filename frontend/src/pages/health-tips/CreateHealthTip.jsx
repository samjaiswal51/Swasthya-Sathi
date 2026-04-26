import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, Save, Send, ArrowLeft, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  'General Health', 'Diabetes', 'Heart Care', 'Skin Care', 
  'Seasonal Flu', 'Mental Health', 'Nutrition', 'Women Care', 'Child Health'
];

const CreateHealthTip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    category: 'General Health',
    summary: '',
    content: '',
    tags: ''
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image must be less than 5MB');
        return;
      }
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
      setError(null);
    }
  };

  const clearImage = () => {
    setThumbnail(null);
    setPreview(null);
  };

  const handleSubmit = async (status) => {
    try {
      if (!formData.title.trim() || !formData.content.trim()) {
        setError('Title and Content are required');
        return;
      }

      setLoading(true);
      setError(null);

      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('category', formData.category);
      fd.append('summary', formData.summary);
      fd.append('content', formData.content);
      fd.append('tags', formData.tags);
      fd.append('status', status);
      
      if (thumbnail) {
        fd.append('thumbnail', thumbnail);
      }

      await axios.post('http://localhost:5000/api/health-tips', fd, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      alert(`Health tip ${status === 'published' ? 'published' : 'saved as draft'} successfully!`);
      navigate('/doctor-dashboard/blogs');

    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to create health tip');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-5 py-4 rounded-[1.25rem] border-2 border-slate-200/80 bg-slate-50/50 focus:bg-white focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all shadow-sm font-medium text-slate-800 placeholder:text-slate-400";
  const labelCls = "block text-xs font-black text-emerald-600 uppercase tracking-widest mb-2 pl-2";

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(16,185,129,0.06)] border border-emerald-500/10 gap-6">
        <div className="flex items-center gap-5">
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="w-14 h-14 bg-white hover:bg-emerald-50 rounded-2xl flex items-center justify-center shadow-sm border border-slate-200 transition-colors text-slate-500 hover:text-emerald-600"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Create Health Tip</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Share healthcare awareness and trusted advice with your patients.</p>
          </div>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleSubmit('draft')} disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border-2 border-slate-200 bg-white text-slate-600 font-extrabold hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50 transition-all disabled:opacity-50 text-sm shadow-sm"
          >
            <Save className="w-5 h-5" /> Save Draft
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => handleSubmit('published')} disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all disabled:opacity-50 text-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            Publish Now
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {error && (
          <motion.div initial={{ opacity: 0, y: -10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="bg-rose-50/80 backdrop-blur-md text-rose-600 p-5 rounded-2xl border border-rose-200 shadow-[0_10px_20px_rgba(244,63,94,0.1)] font-extrabold flex items-center justify-center text-center">
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Studio Area */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="bg-white/90 backdrop-blur-2xl p-8 sm:p-10 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/80 space-y-8">
            
            <div>
              <label className={labelCls}>Article Title *</label>
              <input type="text" name="title" value={formData.title} onChange={handleInputChange} placeholder="e.g. How to Control Sugar Naturally" required className={inputCls} />
            </div>

            <div>
              <label className={labelCls}>Short Summary</label>
              <textarea name="summary" value={formData.summary} onChange={handleInputChange} placeholder="A brief preview text that appears on the feed card..." rows={3} maxLength={300} className={`${inputCls} resize-none`} />
              <div className="text-right text-[10px] font-black uppercase tracking-widest text-emerald-500/50 mt-2 pr-2">{formData.summary.length}/300</div>
            </div>

            <div>
              <label className={labelCls}>Full Editorial Content *</label>
              <textarea name="content" value={formData.content} onChange={handleInputChange} placeholder="Write your health tip here... Use line breaks to separate paragraphs." rows={16} required className={`${inputCls} leading-relaxed resize-y`} />
            </div>
          </motion.div>
        </div>

        {/* Sidebar Settings Area */}
        <div className="space-y-8">
          
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}
            className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/80 space-y-6">
            
            <div>
              <label className={labelCls}>Category</label>
              <div className="relative">
                <select name="category" value={formData.category} onChange={handleInputChange} className={`${inputCls} appearance-none pr-10 cursor-pointer`}>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>

            <div>
              <label className={labelCls}>Tags</label>
              <input type="text" name="tags" value={formData.tags} onChange={handleInputChange} placeholder="e.g. diet, sugar, health" className={inputCls} />
              <p className="text-[10px] font-bold text-slate-400 mt-2 pl-2 uppercase tracking-widest">Separate tags with commas</p>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
            className="bg-white/90 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] border border-slate-200/80 space-y-4">
            
            <label className={labelCls}>Thumbnail Image</label>
            
            <AnimatePresence mode="wait">
              {preview ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="relative rounded-[1.5rem] overflow-hidden group border-2 border-emerald-100 shadow-sm">
                  <img src={preview} alt="Thumbnail preview" className="w-full h-56 object-cover" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <motion.button whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}
                      onClick={clearImage} className="bg-rose-500 text-white p-3 rounded-2xl shadow-xl border border-rose-400" title="Remove Image">
                      <X className="w-6 h-6" />
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.label initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-emerald-200 bg-emerald-50/30 rounded-[1.5rem] cursor-pointer hover:border-emerald-500 hover:bg-emerald-50 transition-colors group relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/5 to-teal-400/5" />
                  <div className="flex flex-col items-center justify-center relative z-10">
                    <div className="bg-white border border-emerald-100 text-emerald-500 p-4 rounded-[1.25rem] mb-4 shadow-sm group-hover:scale-110 transition-transform">
                      <ImagePlus className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-extrabold text-slate-600 mb-1">Click to upload cover</p>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">JPG, PNG (Max 5MB)</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                </motion.label>
              )}
            </AnimatePresence>
          </motion.div>

        </div>
      </div>
    </motion.div>
  );
};

export default CreateHealthTip;
