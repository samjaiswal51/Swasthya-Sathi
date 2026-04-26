import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, MessageCircle, Bookmark, Share2, BadgeCheck, Clock } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FeedCard = ({ post }) => {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likesCount, setLikesCount] = useState(post.likesCount || 0);

  const handleLike = async () => {
    // Optimistic UI update
    const newLikedStatus = !isLiked;
    setIsLiked(newLikedStatus);
    setLikesCount(prev => newLikedStatus ? prev + 1 : prev - 1);

    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/social/like/${post._id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      // Revert if error
      setIsLiked(!newLikedStatus);
      setLikesCount(prev => !newLikedStatus ? prev + 1 : prev - 1);
      toast.error('Failed to update like');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6
                 hover:border-blue-500/25 hover:shadow-[0_20px_50px_rgba(37,99,235,0.14)]
                 shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300"
    >
      {/* Header: Doctor Info */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl overflow-hidden
                          border border-blue-400/25 bg-gradient-to-br from-blue-600/25 to-cyan-500/15
                          shadow-[0_0_14px_rgba(37,99,235,0.2)] flex items-center justify-center">
            {post.doctorInfo?.profilePhoto ? (
              <img src={post.doctorInfo.profilePhoto} alt={post.doctorName} className="w-full h-full object-cover" />
            ) : (
              <span className="text-blue-300 font-extrabold text-base">{post.doctorName.charAt(0)}</span>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-slate-100 font-extrabold">{post.doctorName}</h3>
              {post.doctorInfo?.isVerified && (
                <BadgeCheck className="w-4 h-4 text-blue-400" style={{ filter: 'drop-shadow(0 0 4px rgba(37,99,235,0.5))' }} />
              )}
            </div>
            <p className="text-slate-500 text-xs mt-0.5">{post.specialization}</p>
          </div>
        </div>
        <div className="flex items-center text-slate-600 text-xs gap-1.5 px-3 py-1.5
                        bg-white/4 border border-white/6 rounded-full">
          <Clock className="w-3.5 h-3.5" />
          <span>{new Date(post.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      {/* Content */}
      <div className="mb-5">
        <h2 className="text-slate-100 font-extrabold text-lg mb-3 leading-snug">{post.title}</h2>
        {post.thumbnail && (
          <div className="w-full h-52 rounded-2xl overflow-hidden mb-4 border border-white/6">
            <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover" />
          </div>
        )}
        <p className="text-slate-400 text-sm leading-relaxed">{post.summary || post.content.substring(0, 150) + '...'}</p>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag, i) => (
              <span key={i}
                className="text-xs bg-blue-500/10 text-blue-400 px-2.5 py-1 rounded-full
                           border border-blue-500/20 font-semibold">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between border-t border-white/6 pt-4 mt-2">
        <div className="flex items-center gap-5">
          <motion.button
            whileTap={{ scale: 0.8 }}
            onClick={handleLike}
            className={`flex items-center gap-2 transition-colors ${isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-400'}`}
          >
            <motion.div animate={isLiked ? { scale: [1, 1.35, 1] } : {}} transition={{ duration: 0.3 }}>
              <Heart className={`w-5 h-5 transition-all ${isLiked ? 'fill-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]' : ''}`} />
            </motion.div>
            <span className="font-bold text-sm">{likesCount}</span>
          </motion.button>

          <button className="flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors">
            <MessageCircle className="w-5 h-5" />
            <span className="font-semibold text-sm">Comment</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-xl flex items-center justify-center
                       text-slate-500 hover:text-amber-400 hover:bg-amber-500/10
                       border border-transparent hover:border-amber-500/20
                       transition-all duration-200"
          >
            <Bookmark className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 rounded-xl flex items-center justify-center
                       text-slate-500 hover:text-blue-400 hover:bg-blue-500/10
                       border border-transparent hover:border-blue-500/20
                       transition-all duration-200"
          >
            <Share2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedCard;
