import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Users, Flame } from 'lucide-react';
import toast from 'react-hot-toast';
import FeedCard from '../../../components/dashboard/FeedCard';

const HealthFeed = () => {
  const [activeTab, setActiveTab] = useState('following'); // 'following' | 'general'
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeed(); }, [activeTab]);

  const fetchFeed = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:5000/api/social/feed?type=${activeTab}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFeed(res.data);
    } catch (error) {
      console.error('Feed error:', error);
      toast.error('Failed to load health feed', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-8 pb-20"
    >
      {/* Tabs */}
      <div className="flex justify-center md:justify-start">
        <div className="inline-flex p-1.5 rounded-full
                        bg-white/80 backdrop-blur-2xl border border-emerald-500/10
                        shadow-[0_8px_30px_rgba(16,185,129,0.08)] gap-2">
          {[
            { key: 'following', icon: <Users className="w-4 h-4" />, label: 'Following' },
            { key: 'general', icon: <Flame className="w-4 h-4" />, label: 'General Feed' },
          ].map(({ key, icon, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`relative px-6 py-3 rounded-full font-extrabold text-sm z-10 flex items-center gap-2 transition-all duration-300 ${
                activeTab === key ? 'text-white' : 'text-slate-500 hover:text-emerald-700 hover:bg-emerald-50/50'
              }`}
            >
              {activeTab === key && (
                <motion.div
                  layoutId="feedTab"
                  className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full -z-10
                             shadow-[0_8px_20px_rgba(16,185,129,0.3)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                />
              )}
              {icon}
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Content */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 space-y-6">
            <div className="relative w-16 h-16">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="w-16 h-16 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-emerald-500 absolute"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                className="w-12 h-12 rounded-full border-[3px] border-transparent border-b-teal-400 border-l-teal-400 absolute top-2 left-2"
              />
            </div>
            <p className="text-emerald-600/80 text-xs font-extrabold tracking-widest uppercase">Loading Feed...</p>
          </div>
        ) : feed.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {feed.map((post, idx) => (
              <motion.div
                key={post._id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: idx * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group"
              >
                {/* 
                  Assuming FeedCard internally handles its own styling. 
                  If we can't edit FeedCard here, wrapping it in a subtle drop shadow helps 
                */}
                <div className="rounded-[2rem] shadow-[0_10px_40px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(16,185,129,0.12)] transition-shadow duration-300">
                  <FeedCard post={post} />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 backdrop-blur-2xl border border-slate-200/80 rounded-[3rem] p-16
                       flex flex-col items-center justify-center text-center
                       shadow-[0_15px_50px_rgba(16,185,129,0.06)]"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="w-24 h-24 bg-emerald-50 rounded-[2rem] flex items-center justify-center mb-6
                         border border-emerald-100 shadow-[0_0_30px_rgba(16,185,129,0.15)] shadow-inner"
            >
              <Activity className="w-10 h-10 text-emerald-500" style={{ filter: 'drop-shadow(0 4px 8px rgba(16,185,129,0.4))' }} />
            </motion.div>
            <h3 className="text-2xl font-extrabold text-slate-800 mb-3">
              {activeTab === 'following' ? "You aren't following anyone yet" : "No posts available"}
            </h3>
            <p className="text-slate-500 text-base font-medium max-w-sm mx-auto leading-relaxed">
              {activeTab === 'following'
                ? "Follow doctors from the 'Find a Doctor' page to see their premium health tips and updates here."
                : "Check back later for trusted medical advice and health tips from our top doctors."}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default HealthFeed;
