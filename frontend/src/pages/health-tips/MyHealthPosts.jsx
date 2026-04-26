import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye, Plus, Heart, Calendar, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyHealthPosts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyPosts();
  }, []);

  const fetchMyPosts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/health-tips/my-posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this health tip?')) {
      try {
        await axios.delete(`http://localhost:5000/api/health-tips/${id}`);
        setPosts(posts.filter(p => p._id !== id));
      } catch (err) {
        console.error('Error deleting post:', err);
        alert('Failed to delete post');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto space-y-8 pb-12">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(16,185,129,0.06)] border border-emerald-500/10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-50 border border-emerald-100/50 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-inner">
            <FileText className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">My Health Tips</h1>
            <p className="text-sm font-medium text-slate-500 mt-1">Manage your published articles and drafts.</p>
          </div>
        </div>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Link 
            to="/doctor-dashboard/blogs/create" 
            className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Create New Post
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col justify-center items-center h-64 space-y-6">
          <div className="relative w-16 h-16">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
              className="w-16 h-16 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
          </div>
          <p className="text-emerald-600/80 text-xs font-extrabold tracking-widest uppercase">Loading Posts...</p>
        </div>
      ) : posts.length === 0 ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
          className="bg-white/80 backdrop-blur-2xl rounded-[3rem] p-16 text-center border border-slate-200/80 shadow-[0_15px_50px_rgba(16,185,129,0.06)] flex flex-col items-center">
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-6 border border-emerald-100 shadow-inner">
            <FileText className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h3 className="text-2xl font-extrabold text-slate-800 mb-3">No Health Tips Yet</h3>
          <p className="text-slate-500 text-base font-medium max-w-md mx-auto mb-8">
            Start sharing your medical knowledge to educate patients and build trust within the community.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link 
              to="/doctor-dashboard/blogs/create" 
              className="px-8 py-3.5 bg-emerald-50 border border-emerald-100 text-emerald-600 font-extrabold text-sm uppercase tracking-widest rounded-2xl shadow-sm hover:bg-emerald-100 transition-colors inline-block"
            >
              Write Your First Post
            </Link>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div 
          initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } }, hidden: {} }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div key={post._id} variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }} exit={{ opacity: 0, scale: 0.9 }} whileHover={{ y: -6 }}
                className="bg-white/90 backdrop-blur-2xl rounded-[2.5rem] border border-slate-200/60 shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(16,185,129,0.12)] hover:border-emerald-200 overflow-hidden flex flex-col transition-all group relative">
                
                {/* Image Section */}
                {post.thumbnail ? (
                  <div className="h-56 overflow-hidden relative">
                    <motion.img whileHover={{ scale: 1.05 }} transition={{ duration: 0.8 }} src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md backdrop-blur-md border ${
                        post.status === 'published' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-amber-500/90 text-white border-amber-400'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="h-56 bg-gradient-to-br from-emerald-50 to-teal-50 flex flex-col justify-center items-center relative border-b border-emerald-100/50">
                    <FileText className="w-14 h-14 text-emerald-200 mb-3" />
                    <span className="text-emerald-500/50 font-extrabold uppercase tracking-widest text-xs">{post.category}</span>
                    <div className="absolute top-4 right-4">
                      <span className={`px-3 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-xl shadow-md backdrop-blur-md border ${
                        post.status === 'published' ? 'bg-emerald-500/90 text-white border-emerald-400' : 'bg-amber-500/90 text-white border-amber-400'
                      }`}>
                        {post.status}
                      </span>
                    </div>
                  </div>
                )}
                
                {/* Content Section */}
                <div className="p-6 md:p-8 flex-1 flex flex-col bg-white relative z-10">
                  <div className="text-[10px] font-black text-emerald-500 mb-3 uppercase tracking-[0.2em]">
                    {post.category}
                  </div>
                  <h3 className="text-xl font-extrabold text-slate-800 leading-tight mb-3 line-clamp-2 group-hover:text-emerald-600 transition-colors" title={post.title}>
                    {post.title}
                  </h3>
                  <p className="text-[15px] font-medium text-slate-500 leading-relaxed line-clamp-2 mb-6 flex-1">
                    {post.summary || post.content.substring(0, 100) + '...'}
                  </p>
                  
                  {/* Stats Row */}
                  <div className="flex items-center gap-5 text-xs text-slate-400 mb-6 font-extrabold uppercase tracking-widest bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-emerald-400" /> {formatDate(post.createdAt)}</span>
                    <span className="flex items-center gap-1.5"><Eye className="w-4 h-4 text-teal-400" /> {post.viewsCount}</span>
                    <span className="flex items-center gap-1.5"><Heart className="w-4 h-4 text-rose-400" /> {post.likes.length}</span>
                  </div>

                  {/* Actions Row */}
                  <div className="grid grid-cols-3 gap-3 border-t border-slate-100 pt-5 mt-auto">
                    <Link 
                      to={`/patient-dashboard/health-tips/${post._id}`}
                      className="flex justify-center items-center gap-2 py-2.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-100/50 rounded-xl hover:bg-emerald-100 hover:shadow-sm transition-all uppercase tracking-widest"
                    >
                      <Eye className="w-4 h-4" /> View
                    </Link>
                    <button 
                      onClick={() => alert('Edit feature coming soon!')}
                      className="flex justify-center items-center gap-2 py-2.5 text-xs font-extrabold text-slate-600 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100 hover:shadow-sm transition-all uppercase tracking-widest"
                    >
                      <Edit className="w-4 h-4" /> Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(post._id)}
                      className="flex justify-center items-center gap-2 py-2.5 text-xs font-extrabold text-rose-500 bg-rose-50 border border-rose-100/50 rounded-xl hover:bg-rose-100 hover:shadow-sm transition-all uppercase tracking-widest"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MyHealthPosts;
