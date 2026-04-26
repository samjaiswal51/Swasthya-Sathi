import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, CheckCircle, Trash2, Shield, Heart, Info, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/notifications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (error) {
      console.error('Failed to load notifications', error);
      toast.error('Failed to load notifications', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/notifications/${id}/read`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:5000/api/notifications/mark-all-read', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read', { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } });
    } catch (error) {
      console.error('Failed to mark all as read', error);
      toast.error('Failed to mark all as read');
    }
  };

  const deleteNotification = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(prev => prev.filter(n => n._id !== id));
      toast.success('Notification deleted', { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } });
    } catch (error) {
      console.error('Failed to delete notification', error);
      toast.error('Failed to delete notification');
    }
  };

  const getIcon = (type) => {
    const map = {
      follow:   { icon: <Shield className="w-5 h-5" />, color: 'text-teal-600 bg-teal-50 border-teal-100' },
      like:     { icon: <Heart className="w-5 h-5" />,  color: 'text-rose-500 bg-rose-50 border-rose-100' },
      reminder: { icon: <Clock className="w-5 h-5" />,  color: 'text-amber-500 bg-amber-50 border-amber-100' },
    };
    return map[type] || { icon: <Info className="w-5 h-5" />, color: 'text-emerald-500 bg-emerald-50 border-emerald-100' };
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-32 space-y-6">
      <div className="relative w-16 h-16">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-16 h-16 rounded-full border-[3px] border-transparent border-t-emerald-500 border-r-emerald-500 absolute" />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
          className="w-12 h-12 rounded-full border-[3px] border-transparent border-b-teal-400 border-l-teal-400 absolute top-2 left-2" />
      </div>
      <p className="text-emerald-600/80 text-xs font-extrabold tracking-widest uppercase">Loading Alerts...</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl mx-auto space-y-6 pb-16 relative">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(16,185,129,0.06)] border border-emerald-500/10 flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-5 relative z-10">
          <motion.div animate={{ boxShadow: ['0 0 10px rgba(16,185,129,0.2)', '0 0 20px rgba(16,185,129,0.4)', '0 0 10px rgba(16,185,129,0.2)'] }} transition={{ repeat: Infinity, duration: 2.5 }}
            className="w-14 h-14 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center">
            <Bell className="w-7 h-7 text-emerald-500" />
          </motion.div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Notifications</h1>
            <p className="text-slate-500 text-sm mt-1 font-medium">Stay updated with important alerts and reminders.</p>
          </div>
        </div>

        {notifications.some(n => !n.isRead) && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={markAllAsRead}
            className="relative z-10 flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all">
            <CheckCircle className="w-5 h-5" /> Mark All Read
          </motion.button>
        )}
      </div>

      {notifications.length === 0 ? (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white/80 backdrop-blur-2xl border border-emerald-500/10 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center shadow-[0_15px_40px_rgba(16,185,129,0.06)] relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-50/30" />
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="w-24 h-24 mx-auto mb-6 rounded-[2rem] bg-white border border-emerald-100 shadow-[0_10px_30px_rgba(16,185,129,0.15)] flex items-center justify-center relative z-10">
            <Bell className="w-10 h-10 text-emerald-400" />
          </motion.div>
          <h3 className="text-2xl font-extrabold text-slate-800 mb-2 relative z-10 tracking-tight">No Notifications</h3>
          <p className="text-slate-500 font-medium relative z-10">You're all caught up! Enjoy your day.</p>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <AnimatePresence>
            {notifications.map((notification, index) => {
              const { icon, color } = getIcon(notification.type);
              return (
                <motion.div key={notification._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -4 }}
                  className={`group flex items-start gap-5 p-6 rounded-[2rem] border transition-all duration-300 ${
                    notification.isRead
                      ? 'bg-white/80 backdrop-blur-xl border-slate-100 hover:border-emerald-100 hover:shadow-[0_10px_30px_rgba(16,185,129,0.08)]'
                      : 'bg-emerald-50/80 backdrop-blur-xl border-emerald-200 shadow-[0_10px_30px_rgba(16,185,129,0.12)]'
                  }`}
                >
                  {/* Icon */}
                  <div className={`flex-shrink-0 mt-1 w-12 h-12 rounded-2xl border shadow-sm flex items-center justify-center ${color}`}>
                    {icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1 sm:gap-4 mb-2">
                      <h4 className={`text-base font-extrabold tracking-tight ${notification.isRead ? 'text-slate-700' : 'text-emerald-950'}`}>
                        {notification.title}
                      </h4>
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 whitespace-nowrap flex-shrink-0">
                        {new Date(notification.createdAt).toLocaleDateString()} · {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className={`text-sm leading-relaxed font-medium ${notification.isRead ? 'text-slate-500' : 'text-emerald-800/80'}`}>
                      {notification.message}
                    </p>
                    {notification.link && (
                      <a href={notification.link} className="inline-flex items-center mt-3 text-xs font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-500 transition-colors">
                        View Details <span className="ml-1">→</span>
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {!notification.isRead && (
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => markAsRead(notification._id)} title="Mark as read"
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-emerald-600 bg-white border border-emerald-100 shadow-sm hover:bg-emerald-50 transition-all">
                        <CheckCircle className="w-5 h-5" />
                      </motion.button>
                    )}
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => deleteNotification(notification._id)} title="Delete"
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-rose-500 bg-white border border-rose-100 shadow-sm hover:bg-rose-50 transition-all">
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default Notifications;
