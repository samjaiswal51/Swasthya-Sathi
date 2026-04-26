import React, { useState } from 'react';
import { Search, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

const formatTime = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  const now = new Date();
  const diffDays = Math.floor((now - d) / 86400000);
  if (diffDays === 0) return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7)  return d.toLocaleDateString('en-IN', { weekday: 'short' });
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const SkeletonItem = () => (
  <div className="flex items-center gap-3 px-4 py-3.5 animate-pulse">
    <div className="w-12 h-12 rounded-2xl bg-white/8 flex-shrink-0" />
    <div className="flex-1 space-y-2">
      <div className="h-3.5 bg-white/6 rounded-lg w-2/3" />
      <div className="h-3 bg-white/5 rounded-lg w-1/2" />
    </div>
  </div>
);

const ChatList = ({ conversations, selectedId, onlineUsers, loading, currentUserId, onSelect }) => {
  const [search, setSearch] = useState('');

  const getOther = (conv) =>
    conv.participants?.find(p => (p._id || p.id) !== currentUserId);

  const filtered = conversations.filter(conv => {
    const other = getOther(conv);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex flex-col h-full bg-[#0F172A]/40 backdrop-blur-3xl rounded-l-3xl">
      {/* Header */}
      <div className="px-5 pt-6 pb-4 border-b border-white/5 flex-shrink-0 relative">
        <h2 className="text-xl font-extrabold text-white tracking-tight mb-4">Messages</h2>
        <div className="relative group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-white transition-colors" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search chats..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl
                       bg-white/5 border border-white/10 text-sm text-slate-200 font-medium
                       placeholder-slate-500 outline-none
                       focus:border-white/20 focus:bg-white/10 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)]
                       transition-all duration-300 backdrop-blur-md"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto py-2 px-3 space-y-1 custom-scrollbar">
        {loading ? (
          Array(5).fill(0).map((_, i) => <SkeletonItem key={i} />)
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center h-full py-16 px-4 text-center">
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }} className="w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <MessageSquare className="w-8 h-8 text-slate-400/50" />
            </motion.div>
            <p className="text-sm font-semibold text-slate-400">
              {search ? 'No chats found' : 'No conversations yet'}
            </p>
          </motion.div>
        ) : (
          filtered.map((conv, idx) => {
            const other   = getOther(conv);
            const otherId = other?._id || other?.id;
            const isPatient = other?.role === 'patient';
            const isOnline  = onlineUsers.has(otherId);
            const isSelected = conv._id === selectedId;
            const unread    = conv.unreadForMe || 0;
            const initial   = other?.name?.charAt(0)?.toUpperCase() || '?';

            // DUAL COLOR LOGIC FOR CARDS
            const accentColor = isPatient ? 'emerald' : 'blue';
            const selectedBg = isPatient 
              ? 'bg-gradient-to-r from-emerald-600/20 to-emerald-500/10 border-emerald-500/30 shadow-[0_0_25px_rgba(16,185,129,0.15)]'
              : 'bg-gradient-to-r from-blue-600/20 to-cyan-500/10 border-blue-500/30 shadow-[0_0_25px_rgba(37,99,235,0.15)]';
            
            const avatarBg = isSelected
              ? (isPatient ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]' : 'bg-gradient-to-br from-blue-500 to-cyan-400 shadow-[0_0_15px_rgba(37,99,235,0.4)]')
              : (isPatient ? 'bg-gradient-to-br from-emerald-800 to-emerald-700' : 'bg-gradient-to-br from-blue-800 to-blue-700');

            const nameColor = isSelected 
              ? (isPatient ? 'text-emerald-300' : 'text-blue-300')
              : 'text-slate-100';

            const unreadBadgeBg = isPatient
              ? 'bg-gradient-to-br from-emerald-400 to-green-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
              : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]';

            return (
              <motion.button
                key={conv._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.04, duration: 0.25 }}
                onClick={() => onSelect(conv)}
                whileHover={!isSelected ? { scale: 1.01, backgroundColor: 'rgba(255,255,255,0.03)' } : {}}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3.5 text-left rounded-[1.25rem] transition-all duration-300 border ${
                  isSelected ? selectedBg : 'border-transparent hover:border-white/5'
                }`}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-white font-extrabold text-lg shadow-inner border border-white/10 transition-all duration-300 ${avatarBg}`}>
                    {initial}
                  </div>
                  {isOnline && (
                    <motion.span
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 border-[2.5px] border-[#0F172A] rounded-full shadow-[0_0_8px_rgba(52,211,153,0.8)]`}
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-[15px] font-extrabold truncate transition-colors duration-300 ${nameColor}`}>
                      {other?.name || 'Unknown'}
                    </p>
                    <span className="text-[11px] font-medium text-slate-500 ml-2 flex-shrink-0">
                      {formatTime(conv.lastMessageAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-[13px] font-medium text-slate-400 truncate max-w-[140px]">
                      {conv.lastMessage || 'Start a conversation'}
                    </p>
                    {unread > 0 && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className={`ml-2 flex-shrink-0 text-white text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center ${unreadBadgeBg}`}
                      >
                        {unread > 9 ? '9+' : unread}
                      </motion.span>
                    )}
                  </div>
                </div>
              </motion.button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatList;
