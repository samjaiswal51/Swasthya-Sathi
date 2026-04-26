import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, BellRing, CheckCircle2, TrendingUp, Clock, Pill } from 'lucide-react';
import toast from 'react-hot-toast';
import ReminderModal from '../../../components/dashboard/ReminderModal';
import ReminderCard from '../../../components/dashboard/ReminderCard';
import { motion, AnimatePresence } from 'framer-motion';

const glass = "bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl";
const glassHover = "hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300";

const MedicationReminders = () => {
  const [reminders, setReminders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);
  const [pushStatus, setPushStatus] = useState('Checking...');

  // Base64 to Uint8Array converter
  function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, '+')
      .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Handle Web Push Registration
  useEffect(() => {
    const registerPush = async () => {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
        setPushStatus('Push not supported');
        return;
      }
      try {
        const permission = await Notification.requestPermission();
        if (permission !== 'granted') {
          setPushStatus('Permission denied');
          return;
        }
        const registration = await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registered');
        let subscription = await registration.pushManager.getSubscription();
        if (!subscription) {
          const publicVapidKey = 'BMNt1dhwihkGNWlD6N-FU73toSu7Kp07m4D6du3xoH_yqn0MZS-uLZwLDGlEbBKJ1ZoQKjVd3R0YaoWUgy-eoFE';
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
          });
        }
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:5000/api/patient/reminders/subscribe', subscription, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPushStatus('Subscribed to Push');
      } catch (error) {
        console.error('Push Error:', error);
        setPushStatus('Failed to subscribe');
      }
    };
    registerPush();
  }, []);

  const fetchReminders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/patient/reminders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(res.data);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load reminders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReminders();
  }, []);

  // Real-time Local Polling Notification Logic
  useEffect(() => {
    if (reminders.length === 0) return;
    const formatTimeTo12Hour = (date) => {
      let hours = date.getHours();
      let minutes = date.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12;
      minutes = minutes < 10 ? '0' + minutes : minutes;
      return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
    };
    const intervalId = setInterval(() => {
      const now = new Date();
      const currentFormattedTime = formatTimeTo12Hour(now);
      reminders.filter(r => r.status === 'active').forEach(reminder => {
        if (reminder.times.includes(currentFormattedTime)) {
          const today = new Date();
          today.setHours(0,0,0,0);
          const alreadyTaken = reminder.takenHistory.some(history => {
            const historyDate = new Date(history.date);
            historyDate.setHours(0,0,0,0);
            return historyDate.getTime() === today.getTime() && history.scheduledTime === currentFormattedTime && history.status === 'Taken';
          });
          if (!alreadyTaken && now.getSeconds() === 0) {
            toast.custom((t) => (
              <motion.div
                initial={{ opacity: 0, y: -16, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-[rgba(15,29,58,0.90)] border border-[rgba(59,130,246,0.25)] backdrop-blur-md shadow-[0_0_30px_rgba(37,99,235,0.2)] rounded-2xl p-4 flex items-center gap-3`}
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_14px_rgba(37,99,235,0.4)]">
                  <BellRing className="w-5 h-5 text-white animate-bounce" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-100">Time for Medicine!</p>
                  <p className="text-sm text-blue-300">Take {reminder.dose} of {reminder.medicineName}</p>
                </div>
              </motion.div>
            ), { duration: 10000 });
          }
        }
      });
    }, 1000);
    return () => clearInterval(intervalId);
  }, [reminders]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reminder permanently?")) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/patient/reminders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(prev => prev.filter(r => r._id !== id));
      toast.success('Reminder deleted');
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  const handleAction = async (id, action, scheduledTime) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.patch(`http://localhost:5000/api/patient/reminders/${id}/action`, {
        action,
        scheduledTime,
        date: new Date()
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReminders(prev => prev.map(r => r._id === id ? res.data : r));
      if (action === 'Taken') toast.success('Dose marked as taken! 🌟');
      if (action === 'Skipped') toast('Dose skipped', { icon: '⚠️' });
      if (action === 'Snoozed') toast('Snoozed for 10 mins', { icon: '⏰' });
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const openEditModal = (reminder) => {
    setEditingReminder(reminder);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingReminder(null), 300);
  };

  // Analytics Calculation
  const activeReminders = reminders.filter(r => r.status === 'active');
  const today = new Date();
  today.setHours(0,0,0,0);

  let todayDosesDue = 0;
  let todayDosesTaken = 0;
  let totalDosesAllTime = 0;
  let totalTakenAllTime = 0;

  reminders.forEach(r => {
    const isStarted = new Date(r.startDate) <= new Date();
    const isNotEnded = !r.endDate || new Date(r.endDate) >= today;
    if (r.status === 'active' && isStarted && isNotEnded) {
      todayDosesDue += r.times.length;
    }
    const todayHistory = r.takenHistory.filter(h => {
      const hDate = new Date(h.date);
      hDate.setHours(0,0,0,0);
      return hDate.getTime() === today.getTime() && h.status === 'Taken';
    });
    todayDosesTaken += todayHistory.length;
    totalDosesAllTime += r.takenHistory.length;
    totalTakenAllTime += r.takenHistory.filter(h => h.status === 'Taken').length;
  });

  const adherence = totalDosesAllTime === 0 ? 100 : Math.round((totalTakenAllTime / totalDosesAllTime) * 100);

  // Animation variants
  const containerVariants = {
    animate: { transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4 bg-gradient-to-br from-slate-50 via-blue-50 to-blue-100 rounded-3xl">
        <motion.div
          className="w-14 h-14 rounded-full border-4 border-blue-200 border-t-blue-600"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 0.85, ease: "linear" }}
        />
        <motion.p
          className="text-blue-400 text-sm font-medium"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          Loading your reminders...
        </motion.p>
      </div>
    );
  }

  const isSubscribed = pushStatus === 'Subscribed to Push';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-7xl mx-auto space-y-8 pb-24 relative min-h-[calc(100vh-100px)] p-6 sm:p-8"
    >
      <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl bg-[rgba(6,182,212,0.05)] pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
        <div className="flex items-center space-x-3">
          <div className="w-11 h-11 bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.22)] rounded-xl flex items-center justify-center shadow-[0_0_14px_rgba(37,99,235,0.2)]">
            <BellRing className="w-6 h-6 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.7))' }} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight border-l-[3px] border-l-[#2563EB] pl-4">
              Medication Reminders
            </h1>
            <div className="flex items-center gap-2 mt-2 flex-wrap pl-4">
              <span className="bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-blue-400 backdrop-blur-sm flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${isSubscribed ? 'bg-blue-500 animate-pulse' : 'bg-blue-300'}`} />
                {pushStatus}
              </span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)] transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>Add Reminder</span>
        </motion.button>
      </div>

      {/* STAT CARDS */}
      <motion.div
        variants={containerVariants}
        initial="initial"
        animate="animate"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10"
      >
        {/* Active Reminders */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`${glass} ${glassHover} p-5 rounded-2xl flex items-center gap-4 hover:shadow-[0_0_24px_rgba(37,99,235,0.18)] transition-all duration-300 relative overflow-hidden`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl flex items-center justify-center shadow-[0_0_14px_rgba(37,99,235,0.4)] flex-shrink-0">
            <Pill className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Active</p>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-0.5">{activeReminders.length}</h3>
          </div>
        </motion.div>

        {/* Today Due */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`${glass} ${glassHover} p-5 rounded-2xl flex items-center gap-4 hover:shadow-[0_0_24px_rgba(37,99,235,0.18)] transition-all duration-300 relative overflow-hidden`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl flex items-center justify-center shadow-[0_0_14px_rgba(37,99,235,0.4)] flex-shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Today Due</p>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-0.5">{todayDosesDue}</h3>
          </div>
        </motion.div>

        {/* Taken Today */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`${glass} ${glassHover} p-5 rounded-2xl flex items-center gap-4 hover:shadow-[0_0_24px_rgba(37,99,235,0.18)] transition-all duration-300`}
        >
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-2xl flex items-center justify-center shadow-[0_0_14px_rgba(37,99,235,0.4)] flex-shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Taken Today</p>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-0.5">{todayDosesTaken}</h3>
          </div>
        </motion.div>

        {/* Adherence */}
        <motion.div
          variants={itemVariants}
          whileHover={{ y: -4, transition: { duration: 0.2 } }}
          className={`${glass} ${glassHover} p-5 rounded-2xl flex items-center gap-4 hover:shadow-[0_0_24px_rgba(37,99,235,0.18)] transition-all duration-300`}
        >
          <div className="w-12 h-12 rounded-2xl flex-shrink-0 relative flex items-center justify-center">
            <svg className="absolute inset-0 w-full h-full transform -rotate-90" viewBox="0 0 48 48">
              <circle cx="24" cy="24" r="20" stroke="rgba(59,130,246,0.15)" strokeWidth="5" fill="transparent" />
              <motion.circle
                cx="24" cy="24" r="20"
                stroke="url(#blueGrad)" strokeWidth="5" fill="transparent"
                strokeLinecap="round"
                strokeDasharray={`${adherence * 1.257} 125.7`}
                initial={{ strokeDasharray: "0 125.7" }}
                animate={{ strokeDasharray: `${adherence * 1.257} 125.7` }}
                transition={{ duration: 1.2, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2563eb" />
                  <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
              </defs>
            </svg>
            <div className="w-8 h-8 bg-[rgba(37,99,235,0.15)] border border-[rgba(59,130,246,0.25)] shadow-[0_0_12px_rgba(37,99,235,0.3)] rounded-xl flex items-center justify-center z-10 text-white">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Adherence</p>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-0.5">{adherence}%</h3>
          </div>
        </motion.div>
      </motion.div>

      {/* REMINDER GRID */}
      {reminders.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reminders.map((reminder, index) => (
            <motion.div
              key={reminder._id}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="hover:border-blue-300 hover:shadow-blue-200/60 hover:shadow-lg transition-all duration-300"
            >
              <ReminderCard
                reminder={reminder}
                onEdit={openEditModal}
                onDelete={handleDelete}
                onAction={handleAction}
              />
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`${glass} rounded-3xl p-12 sm:p-16 flex flex-col items-center justify-center text-center relative overflow-hidden`}
        >
          {/* Faint dot grid */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(rgba(59,130,246,0.08) 2px, transparent 2px)', backgroundSize: '28px 28px' }} />

          {/* Animated rings + icon */}
          <div className="relative w-28 h-28 mx-auto mb-8 flex items-center justify-center">
            <motion.div
              className="absolute inset-0 rounded-full bg-[rgba(37,99,235,0.10)]"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute inset-2 rounded-full bg-[rgba(37,99,235,0.06)]"
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2, delay: 0.2, ease: "easeInOut" }}
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="w-24 h-24 bg-[rgba(37,99,235,0.15)] border border-[rgba(59,130,246,0.25)] shadow-[0_0_30px_rgba(37,99,235,0.25)] rounded-full flex items-center justify-center z-10"
            >
              <BellRing className="w-10 h-10 text-blue-400" style={{ filter: 'drop-shadow(0 0 10px rgba(37,99,235,0.7))' }} />
            </motion.div>
          </div>

          <h3 className="text-2xl font-extrabold text-slate-100 tracking-tight mb-3 relative z-10">
            No Reminders Yet
          </h3>
          <p className="text-slate-400 text-sm font-medium max-w-sm mx-auto mb-8 relative z-10">
            Set up your first medication reminder to start tracking your health routine and never miss a dose.
          </p>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-8 py-3.5 rounded-2xl shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_0_28px_rgba(37,99,235,0.55)] transition-all relative z-10"
          >
            Create Your First Reminder
          </motion.button>
        </motion.div>
      )}

      {/* MOBILE FAB */}
      <div className="fixed bottom-6 right-6 sm:hidden z-40">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsModalOpen(true)}
          className="relative bg-gradient-to-br from-blue-600 to-blue-500 text-white p-4 rounded-full shadow-lg shadow-[0_0_24px_rgba(37,99,235,0.5)]"
        >
          <span className="absolute inset-0 rounded-full animate-ping bg-[rgba(37,99,235,0.5)]" />
          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
            <Plus className="w-6 h-6 relative z-10" />
          </motion.div>
        </motion.button>
      </div>

      <ReminderModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSaveSuccess={fetchReminders}
        existingReminder={editingReminder}
      />
    </motion.div>
  );
};

export default MedicationReminders;
