import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import doctorService from '../../../src/services/doctorService';
import { useAuth } from '../../../src/hooks/useAuth';

// Icons for the form fields
import { 
  FiUser, FiPhone, FiMapPin, FiAward, FiClock, FiBriefcase, 
  FiDollarSign, FiEdit3, FiSave, FiX, FiPlus, FiImage 
} from 'react-icons/fi';

// Card container component
const Card = ({ children, title, icon: Icon, className = '' }) => (
    <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className={`bg-white rounded-xl p-6 border border-slate-200 shadow-sm ${className}`}
    >
        <h3 className="text-lg font-semibold text-[#004B23] mb-4 pb-2 border-b border-slate-200 flex items-center">
            {Icon && <Icon className="mr-2 text-[#38B000]" size={18} />} {title}
        </h3>
        {children}
    </motion.div>
);

// Modal for new doctors to create their profile
const CreateProfileModal = ({ onEdit, onClose }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
    >
        <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 max-w-md w-full border border-slate-200 shadow-lg"
            onClick={e => e.stopPropagation()}
        >
            <div className="flex justify-end mb-2">
                <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                    <FiX size={20} />
                </button>
            </div>
            <div className="text-center mb-4">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#38B000] mb-3">
                    <FiUser className="text-xl text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[#004B23] mb-2">Welcome, Doctor!</h3>
                <p className="text-[#007200] text-sm">Please create your professional profile to get started.</p>
            </div>
            <button 
                onClick={onEdit} 
                className="w-full py-3 text-white font-semibold bg-[#007200] rounded-lg hover:bg-[#004B23] transition-all transform hover:scale-[1.02] shadow-md"
            >
                Create Your Profile
            </button>
        </motion.div>
    </motion.div>
);

// Profile View Component
const DoctorProfileView = ({ profile }) => (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        <Card title="Professional Information" icon={FiBriefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm">
                    <p className="text-[#004B23] text-xs mb-1 uppercase font-medium tracking-wide">Specialization</p>
                    <p className="text-[#023E8A]">{profile.specialization || 'Not set'}</p>
                </div>
                <div className="text-sm">
                    <p className="text-[#004B23] text-xs mb-1 uppercase font-medium tracking-wide">License Number</p>
                    <p className="text-[#023E8A]">{profile.licenseNumber || 'Not set'}</p>
                </div>
                <div className="text-sm">
                    <p className="text-[#004B23] text-xs mb-1 uppercase font-medium tracking-wide">Years of Experience</p>
                    <p className="text-[#023E8A]">{profile.yearsOfExperience || 'Not set'}</p>
                </div>
                <div className="text-sm md:col-span-2">
                    <p className="text-[#004B23] text-xs mb-1 uppercase font-medium tracking-wide">Qualifications</p>
                    {profile.qualifications?.length > 0 && profile.qualifications[0] ? (
                        <ul className="text-sm space-y-1.5 mt-1">
                            {profile.qualifications.map((q, i) => (
                                <li key={i} className="text-[#03045E] bg-slate-100 px-3 py-1.5 rounded-md">{q}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-sm bg-slate-100 p-3 rounded-md">None specified</p>
                    )}
                </div>
            </div>
        </Card>

        <Card title="Clinic & Availability" icon={FiClock}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="text-sm">
                    <p className="text-[#004B23] text-xs mb-1 uppercase font-medium tracking-wide">Clinic Name</p>
                    <p className="text-[#023E8A]">{profile.clinicName || 'Not set'}</p>
                </div>
                <div className="text-sm">
                    <p className="text-[#004B23] text-xs mb-1 uppercase font-medium tracking-wide">Clinic Address</p>
                    <p className="text-[#023E8A]">{profile.clinicAddress || 'Not set'}</p>
                </div>
                <div className="text-sm md:col-span-2">
                    <p className="text-[#004B23] text-xs mb-1 uppercase font-medium tracking-wide">Consultation Fees</p>
                    <p className="text-[#023E8A]">{profile.consultationFees ? `₹${profile.consultationFees}` : 'Not set'}</p>
                </div>
                <div className="text-sm md:col-span-2">
                    <p className="text-[#004B23] text-xs mb-1 uppercase font-medium tracking-wide">Availability</p>
                    {profile.availability?.length > 0 ? (
                        <ul className="text-sm space-y-2 mt-1">
                            {profile.availability.map((slot, i) => (
                                <li key={i} className="text-[#03045E] bg-slate-100 px-3 py-1.5 rounded-md">
                                    {slot.day}: {slot.startTime} - {slot.endTime}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-sm bg-slate-100 p-3 rounded-md">No availability set</p>
                    )}
                </div>
            </div>
        </Card>
    </div>
);

// Edit Form Component
const DoctorProfileEditForm = ({ formData, handleChange, handleDynamicChange, handleAddField, handleRemoveField, handleFileChange }) => (
    <div className="h-full flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">
        {/* Basic Info Card */}
        <Card title="Basic Information" icon={FiUser}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                    <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                </div>
                <div>
                    <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                    <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]">
                        <option>Male</option>
                        <option>Female</option>
                        <option>Other</option>
                    </select>
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">Contact Number</label>
                    <input type="tel" id="contactNumber" name="contactNumber" value={formData.contactNumber} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                </div>
            </div>
        </Card>

        {/* Professional Details Card */}
        <Card title="Professional Details" icon={FiBriefcase}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">Medical License Number</label>
                    <input type="text" id="licenseNumber" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                </div>
                <div>
                    <label htmlFor="specialization" className="block text-sm font-medium text-gray-700 mb-1">Specialization</label>
                    <input type="text" id="specialization" name="specialization" placeholder="e.g., Cardiologist" value={formData.specialization} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                </div>
                <div>
                    <label htmlFor="yearsOfExperience" className="block text-sm font-medium text-gray-700 mb-1">Years of Experience</label>
                    <input type="number" id="yearsOfExperience" name="yearsOfExperience" value={formData.yearsOfExperience} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                </div>
            </div>
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications</label>
                {formData.qualifications.map((q, index) => (
                    <div key={index} className="flex items-center gap-2 mb-2">
                        <input type="text" placeholder="e.g., MBBS, MD" value={q} onChange={(e) => handleDynamicChange('qualifications', index, e)} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                        {formData.qualifications.length > 1 && (
                            <button type="button" onClick={() => handleRemoveField('qualifications', index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full">
                                <FiX size={16} />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => handleAddField('qualifications')} className="mt-2 flex items-center gap-2 text-sm text-[#007200] font-semibold hover:text-[#004B23]">
                    <FiPlus size={14} /> Add Qualification
                </button>
            </div>
        </Card>

        {/* Clinic & Practice Info Card */}
        <Card title="Clinic & Practice Information" icon={FiClock}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="clinicName" className="block text-sm font-medium text-gray-700 mb-1">Clinic/Hospital Name</label>
                    <input type="text" id="clinicName" name="clinicName" value={formData.clinicName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                </div>
                <div className="md:col-span-2">
                    <label htmlFor="clinicAddress" className="block text-sm font-medium text-gray-700 mb-1">Clinic Address</label>
                    <input type="text" id="clinicAddress" name="clinicAddress" value={formData.clinicAddress} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                </div>
                <div>
                    <label htmlFor="consultationFees" className="block text-sm font-medium text-gray-700 mb-1">Consultation Fees (INR)</label>
                    <input type="number" id="consultationFees" name="consultationFees" value={formData.consultationFees} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                </div>
            </div>
            <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Weekly Availability</label>
                {formData.availability.map((slot, index) => (
                    <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center mb-3 p-3 bg-gray-50 rounded-md">
                        <select name="day" value={slot.day} onChange={(e) => handleDynamicChange('availability', index, e)} className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]">
                            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                        <input type="time" name="startTime" value={slot.startTime} onChange={(e) => handleDynamicChange('availability', index, e)} className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                        <input type="time" name="endTime" value={slot.endTime} onChange={(e) => handleDynamicChange('availability', index, e)} className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#38B000] focus:border-[#38B000]" />
                        {formData.availability.length > 0 && (
                             <button type="button" onClick={() => handleRemoveField('availability', index)} className="p-2 text-red-500 hover:bg-red-100 rounded-full justify-self-center">
                                <FiX size={16} />
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={() => handleAddField('availability')} className="mt-2 flex items-center gap-2 text-sm text-[#007200] font-semibold hover:text-[#004B23]">
                    <FiPlus size={14} /> Add Time Slot
                </button>
            </div>
        </Card>
    </div>
);


// Main DoctorProfile Component
const DoctorProfile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePicturePreview, setProfilePicturePreview] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);

    // Initial data fetching
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError('');
                const profileData = await doctorService.getDoctorProfile();
                setProfile(profileData);
                setProfilePicturePreview(profileData.profilePicture);
            } catch (err) {
                if (err.response && err.response.status === 404) {
                    setProfile(null);
                    setShowCreateModal(true);
                } else {
                    setError('Could not load profile. ' + (err.message || ''));
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEdit = () => {
        setFormData({
            fullName: profile?.fullName || '',
            gender: profile?.gender || 'Male',
            contactNumber: profile?.contactNumber || '',
            licenseNumber: profile?.licenseNumber || '',
            specialization: profile?.specialization || '',
            qualifications: profile?.qualifications?.length > 0 && profile.qualifications[0] ? profile.qualifications : [''],
            yearsOfExperience: profile?.yearsOfExperience || '',
            clinicName: profile?.clinicName || '',
            clinicAddress: profile?.clinicAddress || '',
            consultationFees: profile?.consultationFees || '',
            availability: profile?.availability?.length > 0 ? profile.availability : [{ day: 'Monday', startTime: '10:00', endTime: '13:00' }],
        });
        setIsEditing(true);
        setShowCreateModal(false);
        setMessage('');
    };

    const handleCancel = () => {
        setIsEditing(false);
        setMessage('');
        setError('');
        setFormData(null);
        if (!profile) {
            setShowCreateModal(true);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);
            setProfilePicturePreview(URL.createObjectURL(file));
        }
    };

    const handleAddField = (field) => {
        if (field === 'qualifications') {
            setFormData({ ...formData, qualifications: [...formData.qualifications, ''] });
        } else if (field === 'availability') {
            setFormData({
                ...formData,
                availability: [...formData.availability, { day: 'Monday', startTime: '10:00', endTime: '13:00' }],
            });
        }
    };

    const handleRemoveField = (field, index) => {
        const currentField = formData[field];
        if (currentField.length <= 1 && field !== 'availability') return;
        const newFieldData = currentField.filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newFieldData });
    };
    
    const handleDynamicChange = (field, index, e) => {
        const { name, value } = e.target;
        if (field === 'qualifications') {
            const newQualifications = formData.qualifications.map((q, i) => (i === index ? value : q));
            setFormData({ ...formData, qualifications: newQualifications });
        } else if (field === 'availability') {
            const newAvailability = formData.availability.map((a, i) => (i === index ? { ...a, [name]: value } : a));
            setFormData({ ...formData, availability: newAvailability });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setMessage('');

        const profilePayload = new FormData();
        Object.keys(formData).forEach((key) => {
            if (key === 'qualifications' || key === 'availability') {
                profilePayload.append(key, JSON.stringify(formData[key].filter(item => {
                    if (typeof item === 'string') return item.trim() !== '';
                    return item; // Keep objects
                })));
            } else {
                profilePayload.append(key, formData[key]);
            }
        });

        if (profilePicture) {
            profilePayload.append('profilePicture', profilePicture);
        }

        try {
            const res = await doctorService.createOrUpdateProfile(profilePayload);
            // The API returns the profile data nested inside a `profile` object
            const updatedProfile = res.profile; 
            setProfile(updatedProfile);
            setProfilePicturePreview(updatedProfile.profilePicture);
            setMessage(res.message);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && !isEditing) {
        return (
            <div className="flex items-center justify-center h-full bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#007200] mx-auto"></div>
                    <p className="text-[#007200] mt-4 text-sm">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
      <div className="h-full bg-gray-50 p-4 md:p-8">
          <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 h-full">
              <AnimatePresence>
                  {(error || message) && (
                      <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className={`mb-6 px-4 py-3 rounded-lg ${error ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-[#f8fffa] text-[#004B23] border border-gray-200'} text-sm`}
                      >
                          {error || message}
                      </motion.div>
                  )}
              </AnimatePresence>

              <div className="h-[calc(100%-4rem)] flex flex-col md:flex-row gap-6">
                {/* Left Column - vCard/Summary Panel */}
                <div className="w-full md:w-1/3 flex flex-col">
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center mb-6">
                        <div className="relative w-24 h-24 mb-4">
                            <img
                                src={profilePicturePreview || 'https://placehold.co/150x150/38B000/white?text=Dr'}
                                alt="Profile"
                                className="w-24 h-24 rounded-full object-cover border-4 border-[#38B000]"
                            />
                             {isEditing && (
                                <label
                                    htmlFor="profilePicture"
                                    className="absolute bottom-0 right-0 bg-[#004B23] text-white p-2 rounded-full cursor-pointer hover:bg-[#007200] transition-colors"
                                >
                                    <FiImage size={16} />
                                    <input
                                        type="file"
                                        id="profilePicture"
                                        name="profilePicture"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </label>
                            )}
                        </div>
                        <h2 className="text-xl font-bold text-[#023E8A] mb-2">
                            {profile?.fullName || user?.email?.split('@')[0]}
                        </h2>
                        <p className="text-[#007200]">{profile?.specialization || 'Specialization'}</p>
                        <div className="space-y-2 mt-4 text-left w-full text-sm">
                            <p className="flex items-center text-[#007200]">
                                <FiUser className="mr-2 text-lg" /> {user?.email}
                            </p>
                            {profile?.contactNumber && (
                                <p className="flex items-center text-[#007200]">
                                    <FiPhone className="mr-2 text-lg" /> {profile.contactNumber}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mt-auto">
                        {!isEditing ? (
                            <button
                                onClick={handleEdit}
                                className="w-full py-3 text-white font-semibold bg-[#007200] rounded-lg hover:bg-[#004B23] transition-colors flex items-center justify-center text-sm shadow-md"
                            >
                                <FiEdit3 className="mr-2" size={16} /> Edit Profile
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button
                                    onClick={handleCancel}
                                    className="flex-1 py-2.5 text-[#007200] bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className="flex-1 py-2.5 text-white bg-[#007200] rounded-lg hover:bg-[#004B23] disabled:opacity-50 transition-colors flex items-center justify-center text-sm font-medium shadow-md"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <FiSave className="mr-2" size={16} /> Save
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column - Sliding Content */}
                <div className="flex-1 overflow-hidden h-full relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={isEditing ? "edit" : "view"}
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -50 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="absolute inset-0"
                        >
                            {isEditing && formData ? (
                                <DoctorProfileEditForm
                                    formData={formData}
                                    handleChange={handleChange}
                                    handleDynamicChange={handleDynamicChange}
                                    handleAddField={handleAddField}
                                    handleRemoveField={handleRemoveField}
                                    handleFileChange={handleFileChange}
                                />
                            ) : profile ? (
                                <DoctorProfileView profile={profile} />
                            ) : (
                                !loading && !showCreateModal && <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                                    <p>No profile data available. Please create one.</p>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>
              </div>
          </div>
          
          <AnimatePresence>
              {showCreateModal && (
                  <CreateProfileModal onEdit={handleEdit} onClose={() => setShowCreateModal(false)} />
              )}
          </AnimatePresence>

          <style jsx>{`
              .custom-scrollbar::-webkit-scrollbar { width: 6px; }
              .custom-scrollbar::-webkit-scrollbar-track { background: #e2e8f0; border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb { background: #90E0EF; border-radius: 10px; }
              .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #48CAE4; }
          `}</style>
      </div>
    );
};

export default DoctorProfile;

