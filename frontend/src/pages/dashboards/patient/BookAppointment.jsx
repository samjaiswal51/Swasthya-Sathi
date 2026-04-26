import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronLeft, IndianRupee, MapPin, ArrowRight, Stethoscope } from 'lucide-react';
import PaymentModal from './components/PaymentModal';

const BookAppointment = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  
  const [doctor, setDoctor] = useState(null);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDateObj, setSelectedDateObj] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPayment, setShowPayment] = useState(false);

  useEffect(() => { fetchDoctorAndAvailability(); }, []);

  const fetchDoctorAndAvailability = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const docRes = await axios.get(`http://localhost:5000/api/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDoctor(docRes.data);

      const availRes = await axios.get(`http://localhost:5000/api/availability/doctor/${doctorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const dates = availRes.data || [];
      setAvailableDates(dates);

      if (dates.length > 0) {
        const firstFree = dates.find(d => d.slots.some(s => !s.booked));
        if (firstFree) setSelectedDateObj(firstFree);
        else setSelectedDateObj(dates[0]);
      }
    } catch (err) {
      toast.error('Failed to load availability.');
    } finally {
      setLoading(false);
    }
  };

  const handleNextAvailable = () => {
    if (!availableDates.length) return toast.error('No upcoming dates found');
    const currentIndex = availableDates.findIndex(d => d._id === selectedDateObj?._id);
    const nextFree = availableDates.slice(currentIndex + 1).find(d => d.slots.some(s => !s.booked));
    if (nextFree) { setSelectedDateObj(nextFree); setSelectedSlot(null); }
    else toast.error('No further available dates found');
  };

  const handlePaymentSuccess = async (transactionId) => {
    setShowPayment(false);
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/appointments/book', {
        doctorId,
        date: selectedDateObj.date,
        time: selectedSlot,
        fee: selectedDateObj.feePerHour,
        consultationType: selectedDateObj.mode,
        paymentId: transactionId
      }, { headers: { Authorization: `Bearer ${token}` } });
      toast.success('Appointment Confirmed!');
      navigate('/patient-dashboard/appointments');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to book appointment');
      fetchDoctorAndAvailability();
    }
  };

  if (!doctor && loading) return (
    <div className="flex flex-col justify-center items-center py-24 gap-4">
      <div className="relative w-14 h-14">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute" />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-500 absolute top-2 left-2" />
      </div>
      <p className="text-slate-400 text-sm font-medium">Loading availability...</p>
    </div>
  );

  const freeSlots = selectedDateObj ? selectedDateObj.slots.filter(s => !s.booked) : [];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-5xl mx-auto pb-20 relative"
    >
      {/* Ambient orbs */}
      <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full blur-3xl bg-blue-600/6 pointer-events-none" />
      <div className="absolute top-1/2 -left-16 w-48 h-48 rounded-full blur-3xl bg-cyan-500/5 pointer-events-none" />

      {/* Back button */}
      <motion.button
        whileHover={{ x: -3 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 px-4 py-2 rounded-xl
                   bg-white/[0.04] border border-white/8 text-slate-400
                   hover:text-blue-400 hover:border-blue-500/25 hover:bg-blue-500/8
                   transition-all duration-200 text-sm font-semibold backdrop-blur-sm"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Doctor
      </motion.button>

      {/* Hero heading */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-blue-500/15 border border-blue-500/25 rounded-xl flex items-center justify-center">
            <Stethoscope className="w-5 h-5 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.6))' }} />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Book Appointment</h1>
            <p className="text-slate-400 text-sm mt-0.5">Choose your preferred date & time slot</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Date & Slots */}
        <div className="lg:col-span-2 space-y-5">

          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-3xl p-6
                       shadow-[0_10px_40px_rgba(37,99,235,0.06)]"
          >
            <h2 className="text-base font-extrabold text-slate-100 mb-5 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-400" />
              </div>
              Available Dates
            </h2>

            {loading ? (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="flex-shrink-0 w-28 h-28 rounded-2xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : availableDates.length === 0 ? (
              <div className="text-center py-10 bg-white/3 rounded-2xl border border-dashed border-white/10">
                <p className="text-slate-500 font-medium text-sm">Doctor has not configured any upcoming dates.</p>
              </div>
            ) : (
              <div className="flex gap-3 overflow-x-auto pb-2 snap-x">
                {availableDates.map((dateObj, idx) => {
                  const hasFreeSlots = dateObj.slots.some(s => !s.booked);
                  const isSelected = selectedDateObj?._id === dateObj._id;
                  return (
                    <motion.button
                      key={dateObj._id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={hasFreeSlots ? { y: -4 } : {}}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => { setSelectedDateObj(dateObj); setSelectedSlot(null); }}
                      className={`flex-shrink-0 snap-start w-28 p-4 rounded-2xl border transition-all duration-300 text-center relative overflow-hidden ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-600 to-cyan-500 border-transparent shadow-[0_8px_24px_rgba(37,99,235,0.45)] text-white'
                          : !hasFreeSlots
                            ? 'bg-white/3 border-white/6 opacity-50 cursor-not-allowed'
                            : 'bg-white/5 border-white/10 hover:border-blue-500/30 hover:bg-blue-500/8'
                      }`}
                    >
                      <p className={`text-xs font-bold uppercase tracking-wider ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                        {new Date(dateObj.date).toLocaleString('default', { month: 'short' })}
                      </p>
                      <p className={`text-3xl font-black mt-1 ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {dateObj.date.split('-')[2]}
                      </p>
                      <span className={`text-[10px] font-extrabold mt-2 px-2 py-0.5 rounded-full inline-block ${
                        hasFreeSlots
                          ? isSelected ? 'bg-white/20 text-white' : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/25'
                          : 'bg-red-500/15 text-red-400 border border-red-500/20'
                      }`}>
                        {hasFreeSlots ? 'Available' : 'Full'}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            )}
          </motion.div>

          {/* Time Slots */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-3xl p-6 min-h-[240px]
                       shadow-[0_10px_40px_rgba(37,99,235,0.06)]"
          >
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-cyan-400" />
                </div>
                Time Slots
              </h2>
              {selectedDateObj && freeSlots.length === 0 && (
                <motion.button
                  whileHover={{ x: 3 }}
                  onClick={handleNextAvailable}
                  className="text-xs font-bold text-blue-400 flex items-center gap-1
                             px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20
                             hover:bg-blue-500/20 transition-all duration-200"
                >
                  Next Available <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {[1,2,3,4,5,6].map(i => (
                  <div key={i} className="h-10 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : !selectedDateObj ? (
              <div className="text-center py-10 bg-white/3 rounded-2xl border border-dashed border-white/10">
                <p className="text-slate-500 font-medium text-sm">Please select a date above.</p>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedDateObj._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
                >
                  {selectedDateObj.slots.map((slot, i) => {
                    if (slot.booked) return (
                      <div key={i}
                        className="py-3 px-2 rounded-xl text-xs font-bold text-center
                                   bg-white/3 text-slate-600 border border-white/5 cursor-not-allowed">
                        {slot.time} <span className="block text-[10px] text-slate-700 mt-0.5">Booked</span>
                      </div>
                    );
                    return (
                      <motion.button
                        key={i}
                        whileHover={{ scale: 1.04 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setSelectedSlot(slot.time)}
                        className={`py-3 px-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
                          selectedSlot === slot.time
                            ? 'bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-[0_4px_16px_rgba(37,99,235,0.45)] scale-105'
                            : 'bg-blue-500/8 border border-blue-500/20 text-blue-300 hover:bg-blue-500/18 hover:border-blue-500/40 hover:shadow-[0_0_12px_rgba(37,99,235,0.2)]'
                        }`}
                      >
                        {slot.time}
                      </motion.button>
                    );
                  })}
                  {selectedDateObj.slots.length === 0 && (
                    <div className="col-span-full text-center py-8 text-slate-500 text-sm">
                      No slots configured for this date.
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>
        </div>

        {/* Right Column: Booking Summary */}
        <div className="lg:col-span-1">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-3xl p-6 sticky top-24
                       shadow-[0_20px_60px_rgba(37,99,235,0.12)]"
          >
            <h3 className="text-base font-extrabold text-slate-100 border-b border-white/8 pb-4 mb-5">
              Booking Summary
            </h3>

            {doctor && (
              <div className="flex items-center gap-3 mb-6 p-3 rounded-2xl bg-blue-500/8 border border-blue-500/15">
                <div className="w-13 h-13 rounded-xl bg-gradient-to-br from-blue-600/30 to-cyan-500/20
                                border-2 border-blue-400/30 shadow-[0_0_16px_rgba(37,99,235,0.25)]
                                flex items-center justify-center text-blue-300 font-bold text-lg overflow-hidden flex-shrink-0 w-12 h-12">
                  {doctor.profilePhoto
                    ? <img src={doctor.profilePhoto} alt="Doctor" className="w-full h-full object-cover rounded-xl" />
                    : doctor.fullName?.charAt(0)
                  }
                </div>
                <div className="min-w-0">
                  <h4 className="font-extrabold text-slate-100 text-sm truncate">{doctor.fullName}</h4>
                  <p className="text-xs text-blue-400 font-medium mt-0.5">{doctor.specialization}</p>
                </div>
              </div>
            )}

            <div className="space-y-3 mb-6">
              {[
                { icon: <Calendar className="w-4 h-4 text-blue-400" />, label: 'Date', value: selectedDateObj ? new Date(selectedDateObj.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—' },
                { icon: <Clock className="w-4 h-4 text-cyan-400" />, label: 'Time', value: selectedSlot || 'Not selected' },
                { icon: <MapPin className="w-4 h-4 text-indigo-400" />, label: 'Mode', value: selectedDateObj?.mode || '—' },
              ].map(({ icon, label, value }) => (
                <div key={label} className="flex justify-between items-center py-2 px-3 rounded-xl bg-white/3">
                  <span className="text-slate-500 flex items-center gap-2 text-xs font-medium">
                    {icon} {label}
                  </span>
                  <span className="font-bold text-slate-200 text-sm">{value}</span>
                </div>
              ))}

              <div className="pt-3 border-t border-white/6 flex justify-between items-center px-1">
                <span className="text-slate-400 font-semibold text-sm">Total Fee</span>
                <span className="text-2xl font-black text-blue-400 flex items-center gap-0.5
                                 drop-shadow-[0_0_8px_rgba(37,99,235,0.6)]">
                  <IndianRupee className="w-5 h-5" />{selectedDateObj?.feePerHour || 0}
                </span>
              </div>
            </div>

            <motion.button
              whileHover={selectedSlot && !loading ? { y: -2, scale: 1.02 } : {}}
              whileTap={selectedSlot && !loading ? { scale: 0.97 } : {}}
              onClick={() => setShowPayment(true)}
              disabled={!selectedSlot || loading}
              className={`w-full py-3.5 rounded-2xl font-extrabold text-sm transition-all duration-300 ${
                selectedSlot && !loading
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_8px_24px_rgba(37,99,235,0.45)] hover:shadow-[0_0_32px_rgba(37,99,235,0.6)]'
                  : 'bg-white/5 border border-white/8 text-slate-600 cursor-not-allowed'
              }`}
            >
              {loading ? 'Loading...' : selectedSlot ? '✦ Proceed to Payment' : 'Select a time slot'}
            </motion.button>
          </motion.div>
        </div>
      </div>

      <PaymentModal
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        amount={selectedDateObj?.feePerHour || 0}
        onSuccess={handlePaymentSuccess}
      />
    </motion.div>
  );
};

export default BookAppointment;
