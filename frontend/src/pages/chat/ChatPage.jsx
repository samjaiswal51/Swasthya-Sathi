import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../context/AuthContext';
import { connectSocket, disconnectSocket } from '../../services/socketService';
import ChatList from './ChatList';
import ChatWindow from './ChatWindow';
import { MessageSquare } from 'lucide-react';

const ChatPage = () => {
  const { user, token } = useContext(AuthContext);
  const [conversations, setConversations]   = useState([]);
  const [selectedConv, setSelectedConv]     = useState(null);
  const [onlineUsers, setOnlineUsers]       = useState(new Set());
  const [loading, setLoading]               = useState(true);
  const [mobileView, setMobileView]         = useState('list');
  const location = useLocation();
  const navigate = useNavigate();

  const currentUserId = user?._id?.toString() || user?.id?.toString();

  useEffect(() => {
    if (!token) return;
    const socket = connectSocket(token);

    socket.on('userOnline',  (id) => setOnlineUsers(prev => new Set([...prev, id])));
    socket.on('userOffline', (id) => setOnlineUsers(prev => { const s = new Set(prev); s.delete(id); return s; }));

    socket.on('newConversationUpdate', ({ conversationId, lastMessage, lastMessageAt }) => {
      setConversations(prev => prev.map(c =>
        c._id === conversationId ? { ...c, lastMessage, lastMessageAt } : c
      ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
    });

    return () => {
      socket.off('userOnline');
      socket.off('userOffline');
      socket.off('newConversationUpdate');
    };
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/chat/conversations');
      setConversations(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchConversations(); }, []);

  useEffect(() => {
    const openChatWith = location.state?.openChatWith;
    if (openChatWith && conversations.length > 0) {
      const conv = conversations.find(c =>
        c.participants.some(p => (p._id || p.id)?.toString() === openChatWith.toString())
      );
      if (conv && selectedConv?._id !== conv._id) {
        handleSelectConversation(conv);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [conversations, location.state, location.pathname, navigate, selectedConv?._id]);

  const handleSelectConversation = (conv) => {
    setSelectedConv(conv);
    setMobileView('chat');
    setConversations(prev => prev.map(c =>
      c._id === conv._id ? { ...c, unreadForMe: 0 } : c
    ));
  };

  const handleBack = () => {
    setMobileView('list');
    setSelectedConv(null);
    fetchConversations();
  };

  const handleMessageSent = (lastMessage) => {
    setConversations(prev => prev.map(c =>
      c._id === selectedConv._id
        ? { ...c, lastMessage, lastMessageAt: new Date().toISOString() }
        : c
    ).sort((a, b) => new Date(b.lastMessageAt) - new Date(a.lastMessageAt)));
  };

  const getOtherParticipant = (conv) => {
    if (!conv?.participants) return null;
    return conv.participants.find(p => {
      const pid = (p._id || p.id)?.toString();
      return pid !== currentUserId;
    });
  };

  const otherUser = getOtherParticipant(selectedConv);
  const isPatient = otherUser?.role === 'patient';
  
  // Dynamic Theme Base
  const themeGlowClass = selectedConv 
    ? (isPatient ? 'shadow-[0_20px_60px_rgba(16,185,129,0.15)] border-emerald-500/20' : 'shadow-[0_20px_60px_rgba(37,99,235,0.15)] border-blue-500/20')
    : 'shadow-[0_20px_60px_rgba(0,0,0,0.4)] border-white/10';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex h-[calc(100vh-7rem)] rounded-[2.5rem] overflow-hidden bg-[#0A111F]/90 backdrop-blur-3xl border transition-all duration-700 ease-in-out ${themeGlowClass} relative`}
    >
      {/* Ambient background glows */}
      <div className={`absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-700 ${selectedConv ? (isPatient ? 'bg-emerald-500/30' : 'bg-blue-500/30') : 'bg-white/5'}`} />
      <div className={`absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] opacity-20 pointer-events-none transition-colors duration-700 ${selectedConv ? (isPatient ? 'bg-teal-500/20' : 'bg-cyan-500/20') : 'bg-white/5'}`} />

      {/* ── Left: Chat List ─────────────────── */}
      <div className={`${mobileView === 'chat' ? 'hidden' : 'flex'} sm:flex flex-col w-full sm:w-80 lg:w-96 border-r border-white/5 flex-shrink-0 z-10`}>
        <ChatList
          conversations={conversations}
          selectedId={selectedConv?._id}
          onlineUsers={onlineUsers}
          loading={loading}
          currentUserId={currentUserId}
          onSelect={handleSelectConversation}
        />
      </div>

      {/* ── Right: Chat Window ───────────────── */}
      <div className={`${mobileView === 'list' ? 'hidden' : 'flex'} sm:flex flex-col flex-1 min-w-0 z-10 bg-black/10`}>
        <AnimatePresence mode="wait">
          {selectedConv ? (
            <motion.div
              key={selectedConv._id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full"
            >
              <ChatWindow
                conversation={selectedConv}
                otherUser={otherUser}
                currentUserId={currentUserId}
                currentUserRole={user?.role}
                isOnline={onlineUsers.has((otherUser?._id || '').toString())}
                onBack={handleBack}
                onMessageSent={handleMessageSent}
              />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
              className="flex-1 flex flex-col items-center justify-center text-center p-8"
            >
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
                className="w-28 h-28 rounded-[2rem] bg-white/5 border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.3)] flex items-center justify-center mb-8 relative"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-[2rem]" />
                <MessageSquare className="w-12 h-12 text-slate-300" style={{ filter: 'drop-shadow(0 4px 10px rgba(255,255,255,0.1))' }} />
              </motion.div>
              <h3 className="text-3xl font-extrabold text-white tracking-tight drop-shadow-sm">Your Messages</h3>
              <p className="text-slate-400 font-medium mt-3 max-w-sm leading-relaxed text-[15px]">
                Select a conversation from the sidebar to start a secure chat with a doctor or patient.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default ChatPage;
