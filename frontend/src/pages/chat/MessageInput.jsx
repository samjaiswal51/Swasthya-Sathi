import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, FileText } from 'lucide-react';
import { getSocket } from '../../services/socketService';

const MessageInput = ({ conversationId, receiverId, currentUserId, currentUserRole, isPatient, onSent }) => {
  const [text, setText]           = useState('');
  const [file, setFile]           = useState(null);
  const [preview, setPreview]     = useState(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef();
  const typingRef = useRef(null);

  const emitTyping = (isTyping) => {
    const socket = getSocket();
    if (socket) socket.emit('typing', { conversationId, isTyping });
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
    emitTyping(true);
    clearTimeout(typingRef.current);
    typingRef.current = setTimeout(() => emitTyping(false), 1500);
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (f.size > 10 * 1024 * 1024) { alert('Max file size is 10MB'); return; }
    setFile(f);
    if (f.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(f);
    } else {
      setPreview(null);
    }
  };

  const clearFile = () => { setFile(null); setPreview(null); if (fileRef.current) fileRef.current.value = ''; };

  const sendTextViaSocket = () => {
    const socket = getSocket();
    if (!socket) return;
    socket.emit('sendMessage', {
      conversationId,
      receiverId,
      message: text.trim(),
    });
    emitTyping(false);
  };

  const handleSend = async () => {
    if (!text.trim() && !file) return;

    if (file) {
      setUploading(true);
      try {
        const fd = new FormData();
        fd.append('file', file);
        fd.append('conversationId', conversationId);
        fd.append('receiverId', receiverId);
        const res = await axios.post('http://localhost:5000/api/chat/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        
        // Forward the file message via socket to update the room
        const socket = getSocket();
        if (socket) socket.emit('forwardMessage', res.data);
        
        clearFile();
      } catch (err) {
        console.error('Upload error:', err);
      } finally {
        setUploading(false);
      }
    } else {
      sendTextViaSocket();
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const canSend = (text.trim() || file) && !uploading;

  // DUAL COLOR LOGIC
  const focusRing = isPatient ? 'focus-within:border-emerald-500/40 focus-within:ring-emerald-500/15 focus-within:bg-emerald-500/5 focus-within:shadow-[0_0_20px_rgba(16,185,129,0.15)]' : 'focus-within:border-blue-500/40 focus-within:ring-blue-500/15 focus-within:bg-blue-500/5 focus-within:shadow-[0_0_20px_rgba(37,99,235,0.15)]';
  const attachHover = isPatient ? 'hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/25' : 'hover:bg-blue-500/10 hover:text-blue-400 hover:border-blue-500/25';
  const fileIconBg = isPatient ? 'bg-emerald-500/15 border-emerald-500/20 text-emerald-400' : 'bg-blue-500/15 border-blue-500/20 text-blue-400';
  
  const sendButtonActive = isPatient 
    ? 'bg-gradient-to-br from-emerald-500 to-green-500 text-white shadow-[0_4px_15px_rgba(16,185,129,0.4)] hover:shadow-[0_0_25px_rgba(16,185,129,0.6)]'
    : 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_4px_15px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(37,99,235,0.6)]';
  const sendButtonInactive = 'bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed';

  return (
    <div className="flex-shrink-0 bg-white/5 backdrop-blur-2xl
                    border-t border-white/5 px-6 py-5
                    shadow-[0_-10px_40px_rgba(0,0,0,0.15)] z-20 relative">
      {/* File preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 16, scale: 1 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.95 }}
            className="flex items-center gap-4 bg-white/10 backdrop-blur-md border border-white/10 rounded-[1.25rem] px-4 py-3 overflow-hidden shadow-lg"
          >
            {preview ? (
              <img src={preview} alt="preview" className="w-12 h-12 rounded-[0.8rem] object-cover flex-shrink-0 border border-white/20 shadow-sm" />
            ) : (
              <div className={`w-12 h-12 rounded-[0.8rem] border flex items-center justify-center flex-shrink-0 ${fileIconBg}`}>
                <FileText className="w-5 h-5" />
              </div>
            )}
            <p className="flex-1 text-sm font-extrabold text-slate-200 truncate">{file.name}</p>
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={clearFile}
              className="text-slate-400 hover:text-white bg-white/5 hover:bg-rose-500/50 border border-white/10 hover:border-rose-500 p-2 rounded-xl transition-all duration-300"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input row */}
      <div className="flex items-end gap-3">
        {/* Attachment */}
        <motion.button
          whileHover={{ rotate: 15, scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fileRef.current?.click()}
          className={`flex-shrink-0 w-12 h-12 rounded-2xl text-slate-400 border border-white/10 bg-white/5
                     flex items-center justify-center transition-all duration-300 shadow-sm ${attachHover}`}
        >
          <Paperclip className="w-5 h-5" />
        </motion.button>
        <input ref={fileRef} type="file" className="hidden" accept="image/*,.pdf,.doc,.docx" onChange={handleFileChange} />

        {/* Text input */}
        <div className={`flex-1 bg-white/5 rounded-[1.5rem] border border-white/10
                        focus-within:ring-2 transition-all duration-300 px-5 py-3.5 backdrop-blur-md shadow-inner ${focusRing}`}>
          <textarea
            value={text}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder={file ? 'Add a caption to your file...' : 'Type your message...'}
            rows={1}
            className="w-full bg-transparent outline-none text-[15px] font-medium text-white
                       placeholder-slate-500 resize-none max-h-32 leading-relaxed custom-scrollbar"
          />
        </div>

        {/* Send */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={canSend ? { scale: 1.05 } : {}}
          onClick={handleSend}
          disabled={!canSend}
          className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center
                      transition-all duration-300 font-extrabold ${
            canSend ? sendButtonActive : sendButtonInactive
          }`}
        >
          {uploading
            ? <div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" />
            : <Send className="w-5 h-5 ml-1" />
          }
        </motion.button>
      </div>
    </div>
  );
};

export default MessageInput;
