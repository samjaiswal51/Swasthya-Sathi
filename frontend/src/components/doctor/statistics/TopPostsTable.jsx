import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Heart, Calendar } from 'lucide-react';

const TopPostsTable = ({ posts }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white/80 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_15px_50px_rgba(16,185,129,0.05)] border border-emerald-500/10 overflow-hidden"
    >
      <div className="p-8 border-b border-emerald-50 flex items-center justify-between bg-white/50">
        <h3 className="text-xl font-extrabold text-slate-800 tracking-tight">Top Performing Posts</h3>
        {posts && posts.length > 0 && (
          <span className="px-4 py-1.5 bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-[0_4px_15px_rgba(16,185,129,0.3)]">
            Best: {posts[0].likes} Likes
          </span>
        )}
      </div>

      {(!posts || posts.length === 0) ? (
        <div className="p-12 text-center text-slate-500 font-medium bg-white/30">No posts published yet. Start creating content to see analytics here.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-emerald-50/30 text-emerald-600 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5">Post Title</th>
                <th className="px-8 py-5">Views</th>
                <th className="px-8 py-5">Likes</th>
                <th className="px-8 py-5">Published</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-emerald-50/50 bg-white/40">
              {posts.map((post, index) => (
                <motion.tr 
                  key={post._id || index}
                  whileHover={{ backgroundColor: 'rgba(236,253,245,0.4)', scale: 1.005 }}
                  transition={{ duration: 0.2 }}
                  className="group cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <p className="font-extrabold text-slate-800 text-[15px] group-hover:text-emerald-700 transition-colors">
                      {post.title}
                    </p>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-lg w-max">
                      <Eye className="w-4 h-4" /> {post.views}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-sm font-bold text-rose-500 bg-rose-50 px-3 py-1.5 rounded-lg w-max">
                      <Heart className="w-4 h-4 fill-rose-500" /> {post.likes}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-extrabold uppercase tracking-wider">
                      <Calendar className="w-4 h-4 text-emerald-400" /> 
                      {new Date(post.createdAt).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default TopPostsTable;
