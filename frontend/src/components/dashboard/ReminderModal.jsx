import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { X, Clock, Calendar as CalendarIcon, Info, Loader2, Pill } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ReminderModal = ({ isOpen, onClose, onSaveSuccess, existingReminder = null }) => {
  const [formData, setFormData] = useState({
    medicineName: '',
    dose: '',
    purpose: '',
    frequency: 'Once Daily',
    times: ['08:00'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    mealTiming: 'Any Time',
    notes: '',
    waterReminder: false,
    repeatUntilTaken: false
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingReminder) {
      setFormData({
        ...existingReminder,
        startDate: existingReminder.startDate ? new Date(existingReminder.startDate).toISOString().split('T')[0] : '',
        endDate: existingReminder.endDate ? new Date(existingReminder.endDate).toISOString().split('T')[0] : '',
        // convert stored "08:00 AM" to "08:00" for HTML input
        times: existingReminder.times.map(t => {
          const [time, modifier] = t.split(' ');
          let [hours, minutes] = time.split(':');
          if (hours === '12') {
            hours = '00';
          }
          if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
          }
          return `${hours}:${minutes}`;
        })
      });
    } else {
      setFormData({
        medicineName: '',
        dose: '',
        purpose: '',
        frequency: 'Once Daily',
        times: ['08:00'],
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        mealTiming: 'Any Time',
        notes: '',
        waterReminder: false,
        repeatUntilTaken: false
      });
    }
  }, [existingReminder, isOpen]);

  if (!isOpen) return null;

  const handleFrequencyChange = (e) => {
    const freq = e.target.value;
    let newTimes = ['08:00'];
    if (freq === 'Twice Daily') newTimes = ['08:00', '20:00'];
    if (freq === 'Thrice Daily') newTimes = ['08:00', '14:00', '20:00'];
    
    setFormData({ ...formData, frequency: freq, times: newTimes });
  };

  const handleTimeChange = (index, value) => {
    const newTimes = [...formData.times];
    newTimes[index] = value;
    setFormData({ ...formData, times: newTimes });
  };

  const addTimeField = () => {
    setFormData({ ...formData, times: [...formData.times, '12:00'] });
  };

  const removeTimeField = (index) => {
    const newTimes = formData.times.filter((_, i) => i !== index);
    setFormData({ ...formData, times: newTimes });
  };

  const formatTimeTo12Hour = (time24) => {
    const [hours24, minutes] = time24.split(':');
    let hours = parseInt(hours24, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        times: formData.times.map(formatTimeTo12Hour)
      };

      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (existingReminder) {
        await axios.put(`http://localhost:5000/api/patient/reminders/${existingReminder._id}`, payload, config);
        toast.success("Reminder updated successfully");
      } else {
        await axios.post('http://localhost:5000/api/patient/reminders', payload, config);
        toast.success("Reminder created successfully");
      }
      
      onSaveSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to save reminder");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[rgba(5,12,30,0.75)] backdrop-blur-[8px] animate-in fade-in duration-200">
      <div className="bg-[#0A1628] border border-[rgba(59,130,246,0.18)] rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(37,99,235,0.1)] w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(59,130,246,0.10)] px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[rgba(37,99,235,0.10)] border border-[rgba(59,130,246,0.22)] rounded-xl flex items-center justify-center text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.6))' }}>
              <Pill className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-extrabold text-slate-100 tracking-tight">{existingReminder ? 'Edit Reminder' : 'New Medication Reminder'}</h2>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-500 border border-transparent hover:text-slate-200 hover:bg-[rgba(255,255,255,0.05)] hover:border-[rgba(59,130,246,0.15)] transition-all duration-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6">
          <form id="reminderForm" onSubmit={handleSubmit} className="space-y-6">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-1">Medicine Name <span className="text-rose-400">*</span></label>
                <input required type="text" value={formData.medicineName} onChange={(e) => setFormData({...formData, medicineName: e.target.value})} placeholder="e.g. Metformin" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Dose</label>
                <input type="text" value={formData.dose} onChange={(e) => setFormData({...formData, dose: e.target.value})} placeholder="e.g. 500mg or 2 pills" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Purpose / Condition</label>
                <input type="text" value={formData.purpose} onChange={(e) => setFormData({...formData, purpose: e.target.value})} placeholder="e.g. Diabetes" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm" />
              </div>
            </div>

            <hr className="border-[rgba(59,130,246,0.08)]" />

            {/* Schedule Section */}
            <div className="bg-[rgba(255,255,255,0.02)] border border-[rgba(59,130,246,0.10)] rounded-xl p-5">
              <h3 className="text-sm font-extrabold text-slate-200 tracking-tight flex items-center mb-4"><Clock className="w-4 h-4 mr-2 text-blue-400" style={{ filter: 'drop-shadow(0 0 4px rgba(37,99,235,0.6))' }}/> Schedule</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-4">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Frequency <span className="text-rose-400">*</span></label>
                  <select required value={formData.frequency} onChange={handleFrequencyChange} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm">
                    {['Once Daily', 'Twice Daily', 'Thrice Daily', 'Weekly', 'Custom'].map(f => <option key={f} value={f} style={{ background: '#0A1628', color: '#f1f5f9' }}>{f}</option>)}
                  </select>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <label className="block text-sm font-semibold text-slate-300">Timings <span className="text-rose-400">*</span></label>
                  {formData.times.map((time, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <input required type="time" value={time} onChange={(e) => handleTimeChange(index, e.target.value)} className="flex-1 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm" />
                      {formData.frequency === 'Custom' && formData.times.length > 1 && (
                        <button type="button" onClick={() => removeTimeField(index)} className="p-2 rounded-lg text-rose-400 hover:bg-[rgba(244,63,94,0.08)] border border-transparent hover:border-[rgba(244,63,94,0.20)] transition-all duration-200"><X className="w-5 h-5"/></button>
                      )}
                    </div>
                  ))}
                  {formData.frequency === 'Custom' && (
                    <button type="button" onClick={addTimeField} className="text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors mt-2">+ Add another time</button>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">Start Date <span className="text-rose-400">*</span></label>
                  <div className="relative">
                    <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input required type="date" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg text-slate-100 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1">End Date (Optional)</label>
                  <div className="relative">
                    <CalendarIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500" />
                    <input type="date" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} className="w-full pl-10 pr-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg text-slate-100 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm" />
                  </div>
                </div>
              </div>
            </div>

            <hr className="border-[rgba(59,130,246,0.08)]" />

            {/* Extra Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-1">Meal Timing</label>
                <select value={formData.mealTiming} onChange={(e) => setFormData({...formData, mealTiming: e.target.value})} className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm">
                  {['Any Time', 'Before Meal', 'After Meal', 'Empty Stomach', 'With Food'].map(m => <option key={m} value={m} style={{ background: '#0A1628', color: '#f1f5f9' }}>{m}</option>)}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-slate-300 mb-1">Instructions / Notes</label>
                <textarea rows="2" value={formData.notes} onChange={(e) => setFormData({...formData, notes: e.target.value})} placeholder="e.g. Do not take with milk" className="w-full bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-lg px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-[rgba(59,130,246,0.45)] focus:bg-[rgba(37,99,235,0.05)] focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] transition-all duration-200 backdrop-blur-sm"></textarea>
              </div>

              <div className="sm:col-span-2 space-y-4 bg-[rgba(37,99,235,0.04)] border border-[rgba(59,130,246,0.12)] p-4 rounded-xl">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={formData.waterReminder} onChange={(e) => setFormData({...formData, waterReminder: e.target.checked})} className="w-5 h-5 accent-blue-500 rounded focus:ring-0 outline-none" />
                  <div>
                    <span className="block text-sm font-semibold text-slate-200">Enable Water Reminder</span>
                    <span className="block text-xs text-slate-500">Reminds you to drink a glass of water with this medicine.</span>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input type="checkbox" checked={formData.repeatUntilTaken} onChange={(e) => setFormData({...formData, repeatUntilTaken: e.target.checked})} className="w-5 h-5 accent-blue-500 rounded focus:ring-0 outline-none" />
                  <div>
                    <span className="block text-sm font-semibold text-slate-200">Repeat Until Taken (Nagging Mode)</span>
                    <span className="block text-xs text-slate-500">Sends alerts every 10 minutes until you mark it as taken.</span>
                  </div>
                </label>
              </div>
            </div>

          </form>
        </div>

        <div className="bg-[rgba(255,255,255,0.02)] px-6 py-4 border-t border-[rgba(59,130,246,0.10)] flex justify-end space-x-3 rounded-b-2xl">
          <button type="button" onClick={onClose} disabled={loading} className="px-6 py-2.5 rounded-xl font-semibold text-slate-300 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] hover:bg-[rgba(255,255,255,0.06)] hover:border-[rgba(59,130,246,0.28)] hover:text-slate-100 transition-all duration-200 disabled:opacity-50">
            Cancel
          </button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.95 }} type="submit" form="reminderForm" disabled={loading} className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold flex items-center space-x-2 shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_0_24px_rgba(37,99,235,0.55)] transition-all duration-300 disabled:opacity-60">
            {loading && <Loader2 className="w-4 h-4 animate-spin text-white/80" />}
            <span>{loading ? 'Saving...' : 'Save Reminder'}</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default ReminderModal;
