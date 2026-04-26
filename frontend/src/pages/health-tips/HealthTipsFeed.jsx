import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, Eye, FileText, ArrowRight, X } from 'lucide-react';

const CATEGORIES = [
  'All', 'General Health', 'Diabetes', 'Heart Care', 'Skin Care',
  'Seasonal Flu', 'Mental Health', 'Nutrition', 'Women Care', 'Child Health'
];

// Skeleton card shimmer
const SkeletonCard = () => (
  <div className="bg-white/[0.04] border border-white/8 rounded-3xl overflow-hidden animate-pulse">
    <div className="h-48 bg-white/8" />
    <div className="p-5 space-y-3">
      <div className="h-3 bg-white/8 rounded-lg w-1/4" />
      <div className="h-5 bg-white/8 rounded-lg w-3/4" />
      <div className="h-4 bg-white/6 rounded-lg" />
      <div className="h-4 bg-white/5 rounded-lg w-2/3" />
      <div className="h-10 bg-white/5 rounded-xl mt-4" />
    </div>
  </div>
);

const HealthTipsFeed = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { fetchTips(); }, [activeCategory, searchQuery]);

  const fetchTips = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/health-tips', {
        params: { category: activeCategory, search: searchQuery }
      });
      setTips(res.data);
    } catch (err) {
      console.error('Error fetching tips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTips();
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric'
    });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-12">

      {/* ── Search Hero ───────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0D1B35] via-blue-900/60 to-[#0A1628]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18)_0%,transparent_65%)]" />
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute -top-8 right-1/4 w-48 h-48 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"
        />

        <div className="relative p-6 sm:p-8">
          <form onSubmit={handleSearch} className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
            <input
              type="text"
              placeholder="Search health topics, doctors, nutrition…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-28 py-4 rounded-2xl
                         bg-white/10 backdrop-blur-xl border border-white/15 text-white
                         placeholder-white/35 font-medium outline-none
                         focus:border-blue-400/50 focus:ring-2 focus:ring-blue-500/20
                         focus:bg-white/15 focus:shadow-[0_0_28px_rgba(37,99,235,0.25)]
                         transition-all duration-300"
            />
            {searchQuery && (
              <motion.button
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => setSearchQuery('')}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="absolute right-2 top-1/2 -translate-y-1/2
                         bg-gradient-to-r from-blue-600 to-cyan-500 text-white
                         px-5 py-2 rounded-xl font-bold text-sm
                         shadow-[0_4px_14px_rgba(37,99,235,0.4)]
                         hover:shadow-[0_0_22px_rgba(37,99,235,0.55)]
                         transition-all duration-200"
            >
              Search
            </motion.button>
          </form>
        </div>
      </div>

      {/* ── Category Filters ─────────────────── */}
      <div className="flex overflow-x-auto pb-2 gap-2 hide-scrollbar">
        {CATEGORIES.map((cat, idx) => (
          <motion.button
            key={cat}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.03 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setActiveCategory(cat)}
            className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 flex-shrink-0 ${
              activeCategory === cat
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)]'
                : 'bg-white/[0.04] backdrop-blur-sm border border-white/8 text-slate-400 hover:border-blue-500/30 hover:text-blue-300 hover:bg-blue-500/8'
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {/* ── Feed Grid ────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[1,2,3,4,5,6].map(n => <SkeletonCard key={n} />)}
          </motion.div>
        ) : tips.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-3xl p-16
                       text-center flex flex-col items-center
                       shadow-[0_10px_40px_rgba(37,99,235,0.06)]"
          >
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-20 h-20 mx-auto mb-5 rounded-2xl
                         bg-blue-500/10 border border-blue-500/20
                         shadow-[0_0_30px_rgba(37,99,235,0.15)]
                         flex items-center justify-center"
            >
              <Search className="w-9 h-9 text-blue-400/60" />
            </motion.div>
            <h3 className="text-xl font-extrabold text-slate-100 mb-2">No Tips Found</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto mb-6 leading-relaxed">
              We couldn't find any health tips matching your criteria. Try selecting a different category or adjusting your search.
            </p>
            {searchQuery && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setSearchQuery('')}
                className="px-6 py-2.5 rounded-xl font-bold text-sm
                           bg-blue-500/15 border border-blue-500/25 text-blue-300
                           hover:bg-blue-500/25 hover:border-blue-500/40
                           transition-all duration-200"
              >
                Clear Search
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="grid"
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {tips.map((tip) => (
              <motion.div
                key={tip._id}
                variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.35 } } }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={`/patient-dashboard/health-tips/${tip._id}`}
                  className="group bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl
                             overflow-hidden flex flex-col
                             hover:border-blue-500/30 hover:shadow-[0_20px_50px_rgba(37,99,235,0.18)]
                             shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 block"
                >
                  {/* Image area */}
                  {tip.thumbnail ? (
                    <div className="h-48 overflow-hidden relative flex-shrink-0">
                      <img
                        src={tip.thumbnail}
                        alt={tip.title}
                        className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-600"
                        style={{ transition: 'transform 0.6s ease' }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <span className="absolute bottom-3 left-4 text-white text-xs font-bold
                                       px-3 py-1 bg-blue-600/70 backdrop-blur-md rounded-full
                                       border border-blue-400/30">
                        {tip.category}
                      </span>
                    </div>
                  ) : (
                    <div className="h-48 relative flex-shrink-0 overflow-hidden
                                    bg-gradient-to-br from-blue-900 via-blue-800 to-[#0F172A]
                                    flex items-center justify-center">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.25)_0%,transparent_70%)]" />
                      <FileText className="w-16 h-16 text-blue-400/20 -rotate-12" />
                      <span className="absolute bottom-3 left-4 text-white text-xs font-bold
                                       px-3 py-1 bg-blue-600/50 backdrop-blur-md rounded-full
                                       border border-blue-400/25">
                        {tip.category}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <h3 className="text-lg font-extrabold text-slate-100 leading-tight mb-2 line-clamp-2
                                   group-hover:text-blue-400 transition-colors duration-200">
                      {tip.title}
                    </h3>

                    <p className="text-sm text-slate-400 mb-4 line-clamp-2 flex-1 leading-relaxed">
                      {tip.summary || tip.content.substring(0, 120) + '...'}
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4 pl-3 border-l-2 border-blue-500/50">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-600/30 to-cyan-500/20
                                      border border-blue-400/25 flex items-center justify-center
                                      text-blue-300 text-xs font-extrabold flex-shrink-0">
                        {tip.doctorName?.charAt(0) || 'D'}
                      </div>
                      <div>
                        <p className="text-sm font-extrabold text-slate-200 leading-none">{tip.doctorName}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{tip.specialization}</p>
                      </div>
                    </div>

                    {/* Meta row */}
                    <div className="flex items-center justify-between border-t border-white/6 pt-3.5 mt-auto">
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
                        <span className="flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5 text-slate-500" /> {tip.viewsCount}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-slate-500" /> {tip.likes?.length || 0}
                        </span>
                      </div>
                      <span className="text-xs font-extrabold text-blue-400 flex items-center gap-1
                                       group-hover:gap-2 transition-all duration-200">
                        Read <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HealthTipsFeed;
