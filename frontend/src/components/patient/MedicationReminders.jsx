// frontend/src/components/patient/MedicationReminders.jsx

import React, { useState, useEffect } from 'react';
import patientService from '../../services/patientService';
import { FiPlus, FiTrash2, FiClock, FiCalendar } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const weekDays = [
    { label: 'S', value: 0, name: 'Sun' },
    { label: 'M', value: 1, name: 'Mon' },
    { label: 'T', value: 2, name: 'Tue' },
    { label: 'W', value: 3, name: 'Wed' },
    { label: 'T', value: 4, name: 'Thu' },
    { label: 'F', value: 5, name: 'Fri' },
    { label: 'S', value: 6, name: 'Sat' },
];

const dayMap = { 0: 'Sun', 1: 'Mon', 2: 'Tue', 3: 'Wed', 4: 'Thu', 5: 'Fri', 6: 'Sat' };

const MedicationReminders = () => {
    const [reminders, setReminders] = useState([]);
    const [medicationName, setMedicationName] = useState('');
    const [dosage, setDosage] = useState('');
    const [times, setTimes] = useState('');
    const [selectedDays, setSelectedDays] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReminders = async () => {
            try {
                setIsLoading(true);
                const data = await patientService.getReminders();
                setReminders(data);
                setError(null);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchReminders();
    }, []);

    const handleDayToggle = (dayValue) => {
        setSelectedDays(prevDays =>
            prevDays.includes(dayValue)
                ? prevDays.filter(d => d !== dayValue)
                : [...prevDays, dayValue]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        const timeArray = times.split(',').map(t => t.trim()).filter(t => t);
        if (timeArray.length === 0) {
            setError("Please enter at least one time.");
            return;
        }

        const invalidTimes = timeArray.filter(t => !/^([01]\d|2[0-3]):([0-5]\d)$/.test(t));
        if (invalidTimes.length > 0) {
            setError(`Invalid time format for: ${invalidTimes.join(', ')}. Please use HH:MM.`);
            return;
        }

        if (selectedDays.length === 0) {
            setError("Please select at least one day for the reminder.");
            return;
        }

        try {
            const newReminder = await patientService.createReminder({
                medicationName,
                dosage,
                times: timeArray,
                daysOfWeek: selectedDays,
            });
            setReminders([newReminder, ...reminders]);
            
            setMedicationName('');
            setDosage('');
            setTimes('');
            setSelectedDays([]);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        try {
            await patientService.deleteReminder(id);
            setReminders(reminders.filter(r => r._id !== id));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="text-white">
            <h1 className="text-3xl font-bold text-[#CAF0F8] mb-6">Medication Reminders</h1>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0077B6]/30 p-6 rounded-lg mb-8 backdrop-blur-sm"
            >
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h2 className="text-xl font-semibold text-[#ADE8F4]">Add New Reminder</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                            type="text"
                            placeholder="Medication Name (e.g., Paracetamol)"
                            value={medicationName}
                            onChange={(e) => setMedicationName(e.target.value)}
                            required
                            className="w-full bg-[#023E8A]/50 p-3 rounded-md border border-[#48CAE4]/20 focus:outline-none focus:ring-2 focus:ring-[#48CAE4]"
                        />
                        <input
                            type="text"
                            placeholder="Dosage (e.g., 1 Tablet)"
                            value={dosage}
                            onChange={(e) => setDosage(e.target.value)}
                            className="w-full bg-[#023E8A]/50 p-3 rounded-md border border-[#48CAE4]/20 focus:outline-none focus:ring-2 focus:ring-[#48CAE4]"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-[#ADE8F4] mb-2">Select Days</label>
                        <div className="flex items-center space-x-2">
                            {weekDays.map(day => (
                                <button
                                    type="button"
                                    key={day.value}
                                    onClick={() => handleDayToggle(day.value)}
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-200 ${
                                        selectedDays.includes(day.value) 
                                        ? 'bg-[#48CAE4] text-[#03045E]' 
                                        : 'bg-[#023E8A]/50 hover:bg-[#023E8A]'
                                    }`}
                                >
                                    {day.label}
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div>
                        <input
                            type="text"
                            placeholder="Times (e.g., 09:00, 14:30, 21:00)"
                            value={times}
                            onChange={(e) => setTimes(e.target.value)}
                            required
                            className="w-full bg-[#023E8A]/50 p-3 rounded-md border border-[#48CAE4]/20 focus:outline-none focus:ring-2 focus:ring-[#48CAE4]"
                        />
                         <p className="text-xs text-[#90E0EF] mt-1">Use 24-hour format (HH:MM), separated by commas.</p>
                    </div>
                    {error && <p className="text-red-400 text-sm">{error}</p>}
                    <button type="submit" className="flex items-center justify-center px-4 py-2 bg-[#0096C7] hover:bg-[#00B4D8] rounded-md transition-colors duration-300">
                        <FiPlus className="mr-2" /> Add Reminder
                    </button>
                </form>
            </motion.div>
            
            <div className="space-y-4">
                 <AnimatePresence>
                    {isLoading ? (
                        <p>Loading reminders...</p>
                    ) : reminders.length === 0 ? (
                        <p className="text-center text-[#90E0EF]">You have no active reminders.</p>
                    ) : (
                        reminders.map(reminder => (
                            <motion.div
                                key={reminder._id}
                                layout
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, x: -50, transition: { duration: 0.3 } }}
                                className="bg-[#0077B6]/20 p-4 rounded-lg flex items-center justify-between"
                            >
                                <div className="flex-1">
                                    <p className="font-bold text-lg text-[#CAF0F8]">{reminder.medicationName}</p>
                                    <p className="text-sm text-[#90E0EF]">{reminder.dosage || 'No dosage specified'}</p>
                                    <div className="flex flex-wrap items-center mt-2 text-sm text-[#ADE8F4] gap-x-4 gap-y-1">
                                        <div className="flex items-center">
                                            <FiCalendar className="mr-2" />
                                            <span>{reminder.daysOfWeek.sort().map(d => dayMap[d]).join(', ')}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FiClock className="mr-2" />
                                            <span>{reminder.times.join(', ')}</span>
                                        </div>
                                    </div>
                                </div>
                                <button onClick={() => handleDelete(reminder._id)} className="p-2 ml-4 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-full transition-colors duration-300">
                                    <FiTrash2 size={20} />
                                </button>
                            </motion.div>
                        ))
                    )}
                 </AnimatePresence>
            </div>
        </div>
    );
};

export default MedicationReminders;