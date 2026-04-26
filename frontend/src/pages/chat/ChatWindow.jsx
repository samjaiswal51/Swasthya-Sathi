import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, Video, Check, CheckCheck, FileText, ExternalLink, Download } from 'lucide-react';
import { getSocket } from '../../services/socketService';
import MessageInput from './MessageInput';

// ── Helpers ────────────────────────────────────────
const formatTime = (d) => new Date(d).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

const isImage = (type, url = '') =>
  type === 'image' || /\.(jpg|jpeg|png|gif|webp)$/i.test(url);

// ── File preview card ──────────────────────────────
const FileCard = ({ msg, isMine, isPatient }) => {
  if (isImage(msg.fileType, msg.fileUrl)) {
    return (
      <a href={msg.fileUrl} target="_blank" rel="noreferrer">
        <img src={msg.fileUrl} alt={msg.fileName}
          className="w-64 max-w-full rounded-[1rem] cursor-pointer hover:opacity-90 transition-opacity shadow-md border border-white/10" />
      </a>
    );
  }
  
  const iconColor = isMine ? 'text-white' : (isPatient ? 'text-emerald-500' : 'text-blue-500');
  
  return (
    <div className={`flex items-center gap-3 rounded-[1.25rem] px-4 py-3 w-64 max-w-full border backdrop-blur-md ${
      isMine
        ? 'bg-white/20 border-white/20 shadow-inner'
        : 'bg-white/10 border-white/10 shadow-sm'
    }`}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
        isMine ? 'bg-white/20' : (isPatient ? 'bg-emerald-500/10' : 'bg-blue-500/10')
      }`}>
        <FileText className={`w-5 h-5 ${iconColor}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-bold truncate ${isMine ? 'text-white' : 'text-slate-200'}`}>{msg.fileName || 'Document'}</p>
        <p className={`text-[10px] uppercase tracking-widest font-extrabold ${isMine ? 'text-white/70' : 'text-slate-500'}`}>{msg.fileType || 'File'}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
          <ExternalLink className={`w-4 h-4 ${isMine ? 'text-white/80' : 'text-slate-400'}`} />
        </a>
        <a href={msg.fileUrl} download className="p-1.5 rounded-lg hover:bg-white/20 transition-colors">
          <Download className={`w-4 h-4 ${isMine ? 'text-white/80' : 'text-slate-400'}`} />
        </a>
      </div>
    </div>
  );
};

// ── Single message bubble ──────────────────────────
const MessageBubble = ({ msg, isMine, showDate, dateLabel, isPatient }) => {
  const bubbleGradient = isMine
    ? (isPatient 
        ? 'bg-gradient-to-br from-emerald-500 to-green-500 shadow-[0_4px_20px_rgba(16,185,129,0.35)]' 
        : 'bg-gradient-to-br from-blue-600 to-cyan-500 shadow-[0_4px_20px_rgba(37,99,235,0.35)]')
    : 'bg-white/10 backdrop-blur-xl border border-white/10 shadow-[0_4px_16px_rgba(0,0,0,0.15)]';
  
  const textColor = isMine ? 'text-white' : 'text-slate-200';
  const timeColor = isMine ? 'text-white/70' : 'text-slate-500';
  const checkColor = isMine 
    ? (msg.read ? 'text-white' : 'text-white/50') 
    : ''; // other user's message doesn't need read checks shown to me
  
  const accentBorder = !isMine ? (isPatient ? 'border-l-emerald-500/50 border-l-[3px]' : 'border-l-blue-500/50 border-l-[3px]') : '';

  return (
    <>
      {showDate && (
        <div className="flex justify-center my-6">
          <span className="bg-black/20 backdrop-blur-md text-slate-300 text-[10px] font-black
                           px-5 py-2 rounded-full border border-white/10 uppercase tracking-widest
                           shadow-lg">
            {dateLabel}
          </span>
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 25 }}
        className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-2`}
      >
        <div className={`relative max-w-[85%] sm:max-w-[70%] flex flex-col rounded-[1.5rem] ${bubbleGradient} ${accentBorder} ${
          isMine ? 'rounded-tr-sm' : 'rounded-tl-sm'
        }`}>
          <div className="px-4 pt-3 pb-2.5">
            {msg.messageType === 'file' ? (
              <div>
                <FileCard msg={msg} isMine={isMine} isPatient={isPatient} />
                <div className="flex justify-end items-center gap-1.5 mt-1.5 mb-[-4px]">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wide ${timeColor}`}>
                    {formatTime(msg.createdAt)}
                  </span>
                  {isMine && (msg.read
                    ? <CheckCheck className={`w-3.5 h-3.5 ${checkColor}`} />
                    : <Check className={`w-3.5 h-3.5 ${checkColor}`} />
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-end gap-x-3 gap-y-1">
                <p className={`whitespace-pre-wrap break-words text-[15px] font-medium leading-[1.6] min-w-0 ${textColor}`}>
                  {msg.message}
                </p>
                <div className="flex items-center gap-1.5 ml-auto flex-shrink-0 mb-[-2px]">
                  <span className={`text-[10px] font-extrabold uppercase tracking-wide ${timeColor}`}>
                    {formatTime(msg.createdAt)}
                  </span>
                  {isMine && (
                    msg.read
                      ? <CheckCheck className={`w-3.5 h-3.5 ${checkColor}`} />
                      : <Check className={`w-3.5 h-3.5 ${checkColor}`} />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
};

const getDateLabel = (d) => {
  const today = new Date(); const date = new Date(d);
  const diff = Math.floor((today.setHours(0,0,0,0) - date.setHours(0,0,0,0)) / 86400000);
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Yesterday';
  return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
};

// ── Chat Window ────────────────────────────────────
const ChatWindow = ({ conversation, otherUser, currentUserId, currentUserRole, isOnline, onBack, onMessageSent }) => {
  const [messages, setMessages]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [isTyping, setIsTyping]   = useState(false);
  const bottomRef = useRef(null);
  const typingTimer = useRef(null);

  const isPatient = otherUser?.role === 'patient';

  const scrollToBottom = useCallback(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // Fetch messages
  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/chat/messages/${conversation._id}`);
        setMessages(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetch();
  }, [conversation._id]);

  // Socket events
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.emit('joinRoom', conversation._id);
    socket.emit('seenMessage', { conversationId: conversation._id });

    const handleReceiveMessage = (msg) => {
      if (msg.conversationId === conversation._id) {
        setMessages(prev => {
          if (prev.some(m => m._id === msg._id)) return prev;
          return [...prev, msg];
        });
        socket.emit('seenMessage', { conversationId: conversation._id });
        onMessageSent?.(msg.message || msg.fileName || '');
      }
    };

    const handleTyping = ({ senderId, isTyping: t }) => {
      if (senderId !== currentUserId) {
        setIsTyping(t);
        if (t) { clearTimeout(typingTimer.current); typingTimer.current = setTimeout(() => setIsTyping(false), 3000); }
      }
    };

    const handleMessageSeen = ({ conversationId }) => {
      if (conversationId === conversation._id) {
        setMessages(prev => prev.map(m => ({ ...m, read: true })));
      }
    };

    socket.on('receiveMessage', handleReceiveMessage);
    socket.on('typing', handleTyping);
    socket.on('messageSeen', handleMessageSeen);

    return () => {
      socket.off('receiveMessage', handleReceiveMessage);
      socket.off('typing', handleTyping);
      socket.off('messageSeen', handleMessageSeen);
    };
  }, [conversation._id, currentUserId]);

  // Scroll on new messages
  useEffect(() => { scrollToBottom(); }, [messages, isTyping, scrollToBottom]);

  const handleSend = () => {};

  const otherId = otherUser?._id || otherUser?.id;
  const initial = otherUser?.name?.charAt(0)?.toUpperCase() || '?';

  // DUAL COLOR LOGIC
  const avatarBg = isPatient ? 'bg-gradient-to-br from-emerald-500 to-green-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-[0_0_20px_rgba(37,99,235,0.3)]';
  const onlinePulse = isPatient ? 'shadow-[0_0_8px_rgba(16,185,129,0.8)]' : 'shadow-[0_0_8px_rgba(37,99,235,0.8)]';
  const headerIconHover = isPatient ? 'hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/20' : 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/20';
  const typingText = isPatient ? 'text-emerald-400' : 'text-blue-400';
  const typingDot = isPatient ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-blue-400 shadow-[0_0_8px_rgba(37,99,235,0.6)]';

  return (
    <div className="flex flex-col h-full rounded-r-[2.5rem] overflow-hidden bg-black/5">
      {/* ── Header ─────────────────────────── */}
      <div className="flex items-center gap-4 px-6 py-4 flex-shrink-0
                      bg-white/5 backdrop-blur-2xl border-b border-white/5
                      shadow-[0_4px_20px_rgba(0,0,0,0.1)] z-10 sticky top-0">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={onBack}
          className="sm:hidden p-2.5 rounded-[1rem] text-slate-400
                     hover:bg-white/10 hover:text-white border border-transparent
                     transition-all duration-300 shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.button>

        <div className="relative">
          <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center text-white font-extrabold text-lg border border-white/20 ${avatarBg}`}>
            {initial}
          </div>
          {isOnline && (
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 ${isPatient ? 'bg-emerald-400' : 'bg-cyan-400'}
                         border-[2.5px] border-[#0A111F] rounded-full ${onlinePulse}`}
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-extrabold text-white text-base truncate tracking-tight drop-shadow-sm">{otherUser?.name || 'Unknown'}</p>
          <AnimatePresence mode="wait">
            {isTyping ? (
              <motion.p
                key="typing"
                initial={{ opacity: 0, y: 2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -2 }}
                className={`text-xs font-black uppercase tracking-widest ${typingText}`}
              >
                typing...
              </motion.p>
            ) : (
              <motion.p
                key="status"
                initial={{ opacity: 0, y: -2 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                className={`text-[11px] font-extrabold uppercase tracking-widest ${isOnline ? (isPatient ? 'text-emerald-400' : 'text-blue-400') : 'text-slate-500'}`}
              >
                {isOnline ? '● Online' : 'Offline'}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-2xl text-slate-400 border border-transparent transition-all duration-300 shadow-sm ${headerIconHover}`}>
            <Phone className="w-5 h-5" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            className={`p-3 rounded-2xl text-slate-400 border border-transparent transition-all duration-300 shadow-sm ${headerIconHover}`}>
            <Video className="w-5 h-5" />
          </motion.button>
        </div>
      </div>

      {/* ── Messages Area ───────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 space-y-1
                      bg-transparent relative custom-scrollbar z-0">
        
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="relative w-16 h-16">
              <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className={`w-16 h-16 rounded-full border-4 border-transparent absolute ${isPatient ? 'border-t-emerald-500 border-r-emerald-500' : 'border-t-blue-500 border-r-blue-500'}`} />
            </div>
          </div>
        ) : messages.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center">
            <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className={`w-20 h-20 rounded-[2rem] bg-white/5 border border-white/10 shadow-xl flex items-center justify-center mb-6`}>
              <p className="text-4xl">👋</p>
            </motion.div>
            <p className="font-extrabold text-white text-xl tracking-tight drop-shadow-sm">Say hello!</p>
            <p className="text-sm text-slate-400 mt-2 font-medium">Start a secure conversation with {otherUser?.name}</p>
          </motion.div>
        ) : (
          (() => {
            let lastDate = null;
            return messages.map((msg, i) => {
              const dateLabel = getDateLabel(msg.createdAt);
              const showDate  = dateLabel !== lastDate;
              lastDate        = dateLabel;
              const isMine    = String(msg.senderId?._id || msg.senderId) === String(currentUserId);
              return (
                <MessageBubble key={msg._id || i} msg={msg} isMine={isMine} showDate={showDate} dateLabel={dateLabel} isPatient={isPatient} />
              );
            });
          })()
        )}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="flex justify-start mb-2 mt-4"
            >
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[1.5rem] rounded-tl-sm px-5 py-4 flex gap-2 shadow-[0_4px_16px_rgba(0,0,0,0.1)]">
                {[0,1,2].map(i => (
                  <motion.span
                    key={i}
                    animate={{ y: [0, -6, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
                    className={`w-2.5 h-2.5 rounded-full ${typingDot}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} className="h-4" />
      </div>

      {/* ── Input ───────────────────────────── */}
      <div className="z-10">
        <MessageInput
          conversationId={conversation._id}
          receiverId={otherId}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          isPatient={isPatient}
          onSent={handleSend}
        />
      </div>
    </div>
  );
};

export default ChatWindow;
