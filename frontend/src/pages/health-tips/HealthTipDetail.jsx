import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ArrowLeft, Heart, Bookmark, Eye, Calendar, Share2, User } from 'lucide-react';
import { motion } from 'framer-motion';

const HealthTipDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [tip, setTip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTip();
  }, [id]);

  const fetchTip = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/health-tips/${id}`);
      setTip(res.data);
    } catch (err) {
      console.error('Error fetching tip:', err);
      setError('Health tip not found or has been removed.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/health-tips/${id}/like`);
      setTip({ ...tip, likes: res.data.likes });
    } catch (err) {
      console.error('Error liking post:', err);
    }
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/health-tips/${id}/save`);
      setTip({ ...tip, saves: res.data.saves });
    } catch (err) {
      console.error('Error saving post:', err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('Link copied to clipboard!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long', day: 'numeric', year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-6">
        <div className="relative w-16 h-16">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
            className="w-16 h-16 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
            className="w-12 h-12 rounded-full border-[3px] border-transparent border-b-teal-400 border-l-teal-400 absolute top-2 left-2" />
        </div>
        <p className="text-emerald-600/80 text-xs font-extrabold tracking-widest uppercase">Loading Article...</p>
      </div>
    );
  }

  if (error || !tip) {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white/80 backdrop-blur-2xl text-slate-800 p-10 rounded-[2.5rem] text-center border border-rose-500/10 shadow-[0_15px_40px_rgba(244,63,94,0.06)] max-w-2xl mx-auto mt-12">
        <h3 className="text-2xl font-extrabold mb-3 text-rose-500 drop-shadow-sm">Oops!</h3>
        <p className="text-slate-500 font-medium mb-8">{error}</p>
        <button onClick={() => navigate(-1)} className="px-8 py-3 bg-white text-slate-700 rounded-xl font-extrabold shadow-sm border border-slate-200 hover:bg-slate-50 hover:shadow-md transition-all">
          Go Back
        </button>
      </motion.div>
    );
  }

  const isLiked = tip.likes.includes(user?.id || user?._id);
  const isSaved = tip.saves.includes(user?.id || user?._id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto pb-20 relative">
      <motion.button 
        whileHover={{ x: -4 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/60 backdrop-blur-md border border-white/20 text-slate-600 hover:text-emerald-700 hover:bg-white shadow-sm rounded-xl transition-all mb-8 font-extrabold text-sm uppercase tracking-widest"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Feed
      </motion.button>

      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1, duration: 0.5 }}
        className="bg-white/90 backdrop-blur-2xl rounded-[3rem] shadow-[0_20px_60px_rgba(16,185,129,0.08)] border border-emerald-500/10 overflow-hidden relative">
        
        {/* Hero Image */}
        {tip.thumbnail && (
          <div className="w-full h-72 md:h-[450px] relative overflow-hidden group">
            <motion.img 
              whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }}
              src={tip.thumbnail} alt={tip.title} className="w-full h-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />
          </div>
        )}

        <div className="p-8 md:p-12 lg:p-16 relative">
          {/* Header Info */}
          <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
            <span className="px-4 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-black uppercase tracking-[0.2em] rounded-lg mb-8 shadow-sm border border-emerald-100/50">
              {tip.category}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] tracking-tight mb-10 drop-shadow-sm">
              {tip.title}
            </h1>
            
            <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-sm text-slate-500 font-extrabold uppercase tracking-widest">
              <div className="flex items-center gap-4 bg-slate-50/80 px-4 py-2 rounded-2xl border border-slate-100">
                <div className="w-10 h-10 bg-white shadow-sm rounded-[0.8rem] flex items-center justify-center border border-slate-200">
                  <User className="w-5 h-5 text-emerald-500" />
                </div>
                <div className="text-left leading-tight">
                  <p className="text-slate-800 text-xs">{tip.doctorName}</p>
                  <p className="text-[10px] text-slate-400">{tip.specialization}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> {formatDate(tip.createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-teal-400" /> {tip.viewsCount} Views
              </div>
            </div>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 mx-auto rounded-full mb-12 opacity-50" />

          {/* Article Content */}
          <div className="max-w-3xl mx-auto">
            {tip.summary && (
              <p className="text-2xl text-slate-700 font-medium leading-relaxed mb-10 italic border-l-[6px] border-emerald-400 pl-8 bg-emerald-50/30 py-6 rounded-r-2xl">
                "{tip.summary}"
              </p>
            )}

            <div className="prose prose-slate prose-lg md:prose-xl max-w-none text-slate-800 leading-[1.8] font-medium">
              {tip.content.split('\n').map((paragraph, idx) => (
                paragraph.trim() ? <p key={idx} className="mb-8">{paragraph}</p> : <br key={idx} />
              ))}
            </div>

            {/* Tags */}
            {tip.tags && tip.tags.length > 0 && (
              <div className="mt-16 flex flex-wrap gap-2">
                {tip.tags.map((tag, idx) => (
                  <span key={idx} className="px-4 py-2 bg-slate-50 border border-slate-100 text-emerald-600 text-xs font-black uppercase tracking-widest rounded-xl shadow-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="bg-slate-50/80 border-t border-slate-200/60 p-6 md:p-8 backdrop-blur-md">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-sm ${
                  isLiked ? 'bg-rose-50 text-rose-500 border border-rose-200 shadow-rose-500/10' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-rose-500'
                }`}
              >
                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                <span>{tip.likes.length} Likes</span>
              </motion.button>
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleShare}
                className="flex items-center gap-2.5 px-6 py-3.5 bg-white text-slate-600 border border-slate-200 rounded-2xl font-extrabold text-sm hover:bg-slate-50 hover:text-blue-500 transition-all shadow-sm"
              >
                <Share2 className="w-5 h-5" /> <span className="hidden sm:inline">Share</span>
              </motion.button>
            </div>
            <motion.button 
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-extrabold text-sm transition-all shadow-sm ${
                isSaved ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-emerald-500/10' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-emerald-600'
              }`}
            >
              <Bookmark className={`w-5 h-5 ${isSaved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{isSaved ? 'Saved' : 'Save Article'}</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default HealthTipDetail;
