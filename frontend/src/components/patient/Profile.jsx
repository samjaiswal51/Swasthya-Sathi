// frontend/src/components/patient/Profile.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import patientService from '../../services/patientService';
import { useAuth } from '../../hooks/useAuth';

// Icons for the form fields
import { 
  FiUser, FiCalendar, FiPhone, FiMapPin, 
  FiDroplet, FiAlertCircle, FiHeart, FiMail,
  FiSave, FiEdit3, FiX, FiPlus
} from 'react-icons/fi';

// Card container component
const Card = ({ children, title, icon: Icon, className = '' }) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.2 }}
    className={`bg-white rounded-xl p-6 border border-slate-200 shadow-sm ${className}`}
  >
    <h3 className="text-lg font-semibold text-[#023E8A] mb-4 pb-2 border-b border-slate-200 flex items-center">
      <Icon className="mr-2 text-[#0077B6]" size={18} /> {title}
    </h3>
    {children}
  </motion.div>
);

// Partial Profile View Component (Modal)
const PartialProfileModal = ({ onEdit, onClose }) => (
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
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#0096C7] mb-3">
          <FiUser className="text-xl text-white" />
        </div>
        <h3 className="text-xl font-semibold text-[#023E8A] mb-2">Welcome to HealthHub!</h3>
        <p className="text-[#0077B6] text-sm">Complete your profile to get the most out of our services.</p>
      </div>
      <button 
        onClick={onEdit} 
        className="w-full py-3 text-white font-semibold bg-[#0077B6] rounded-lg hover:bg-[#0096C7] transition-all transform hover:scale-[1.02] shadow-md"
      >
        Create Your Profile
      </button>
    </motion.div>
  </motion.div>
);

// Profile View Component
const ProfileView = ({ profile, onEdit }) => (
  <div className="h-full flex flex-col">
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
      <Card title="Personal Information" icon={FiUser}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm">
            <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">First Name</p>
            <p className="text-[#023E8A]">{profile.firstName || 'Not set'}</p>
          </div>
          <div className="text-sm">
            <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Last Name</p>
            <p className="text-[#023E8A]">{profile.lastName || 'Not set'}</p>
          </div>
          <div className="text-sm">
            <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Date of Birth</p>
            <p className="text-[#023E8A]">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : 'Not set'}</p>
          </div>
          <div className="text-sm">
            <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Gender</p>
            <p className="text-[#023E8A]">{profile.gender || 'Not set'}</p>
          </div>
          <div className="text-sm">
            <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Contact Number</p>
            <p className="text-[#023E8A]">{profile.contactNumber || 'Not set'}</p>
          </div>
          <div className="text-sm md:col-span-2">
            <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Address</p>
            <p className="text-[#023E8A]">{profile.address || 'Not set'}</p>
          </div>
        </div>
      </Card>
      
      <Card title="Health Profile" icon={FiDroplet}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-sm">
            <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Blood Group</p>
            <p className="text-[#023E8A]">{profile.bloodGroup || 'Not set'}</p>
          </div>
          <div className="text-sm">
            <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Allergies</p>
            <div className="mt-1">
              {profile.allergies?.length > 0 && profile.allergies[0] ? (
                <ul className="text-sm space-y-1.5">
                  {profile.allergies.map((allergy, i) => (
                    <li key={i} className="text-[#03045E] bg-slate-100 px-3 py-1.5 rounded-md">{allergy}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-slate-500 text-sm bg-slate-100 p-3 rounded-md">None specified</p>
              )}
            </div>
          </div>
        </div>
      </Card>
      
      <Card title="Emergency Contacts" icon={FiHeart}>
        {profile.emergencyContacts?.length > 0 && profile.emergencyContacts[0]?.name ? (
          <div className="grid grid-cols-1 gap-4">
            {profile.emergencyContacts.map((contact, i) => (
              <div key={i} className="p-4 bg-slate-100 rounded-lg text-sm border border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Name</p>
                    <p className="text-[#023E8A]">{contact.name}</p>
                  </div>
                  <div>
                    <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Relationship</p>
                    <p className="text-[#023E8A]">{contact.relationship}</p>
                  </div>
                  <div>
                    <p className="text-[#0077B6] text-xs mb-1 uppercase font-medium tracking-wide">Phone</p>
                    <p className="text-[#023E8A]">{contact.phone}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-500 bg-slate-100 p-4 rounded-lg text-sm border border-slate-200">No emergency contacts set.</p>
        )}
      </Card>
    </div>
  </div>
);

// Edit Form Component
const EditForm = ({ formData, handleChange, handleAllergyChange, addAllergyField, removeAllergyField, 
  handleEmergencyContactChange, addEmergencyContactField, removeEmergencyContactField, 
  handleSubmit, handleCancel, loading }) => (
  <form onSubmit={handleSubmit} className="h-full flex flex-col">
    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-6">
      <Card title="Personal Information" icon={FiUser}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-[#0077B6]" size={16} />
            <input 
              name="firstName" 
              value={formData.firstName} 
              onChange={handleChange} 
              placeholder="First Name" 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
              required 
            />
          </div>
          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-[#0077B6]" size={16} />
            <input 
              name="lastName" 
              value={formData.lastName} 
              onChange={handleChange} 
              placeholder="Last Name" 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
            />
          </div>
          <div className="relative">
            <FiCalendar className="absolute left-3 top-3.5 text-[#0077B6]" size={16} />
            <input 
              type="date" 
              name="dateOfBirth" 
              value={formData.dateOfBirth} 
              onChange={handleChange} 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
            />
          </div>
          <div className="relative">
            <FiUser className="absolute left-3 top-3.5 text-[#0077B6]" size={16} />
            <select 
              name="gender" 
              value={formData.gender} 
              onChange={handleChange} 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm appearance-none"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="relative">
            <FiPhone className="absolute left-3 top-3.5 text-[#0077B6]" size={16} />
            <input 
              name="contactNumber" 
              value={formData.contactNumber} 
              onChange={handleChange} 
              placeholder="Contact Number" 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
            />
          </div>
          <div className="relative md:col-span-2">
            <FiMapPin className="absolute left-3 top-3.5 text-[#0077B6]" size={16} />
            <input 
              name="address" 
              value={formData.address} 
              onChange={handleChange} 
              placeholder="Address" 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
            />
          </div>
        </div>
      </Card>
      
      <Card title="Health Profile" icon={FiDroplet}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <FiDroplet className="absolute left-3 top-3.5 text-[#0077B6]" size={16} />
            <input 
              name="bloodGroup" 
              value={formData.bloodGroup} 
              onChange={handleChange} 
              placeholder="Blood Group (e.g., A+)" 
              className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
            />
          </div>
          <div className="space-y-3">
            <label className="font-medium text-[#023E8A] flex items-center text-sm">
              <FiAlertCircle className="mr-2 text-[#0077B6]" size={16} /> Allergies
            </label>
            {formData.allergies.map((allergy, index) => (
              <motion.div 
                key={index} 
                className="flex items-center gap-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
              >
                <input 
                  value={allergy} 
                  onChange={(e) => handleAllergyChange(index, e.target.value)} 
                  placeholder={`Allergy #${index + 1}`} 
                  className="flex-grow px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
                />
                <button 
                  type="button" 
                  onClick={() => removeAllergyField(index)} 
                  className="px-3 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors text-sm"
                >
                  ×
                </button>
              </motion.div>
            ))}
            <button 
              type="button" 
              onClick={addAllergyField} 
              className="text-sm text-[#0077B6] hover:text-[#0096C7] hover:underline flex items-center mt-2"
            >
              <FiPlus className="mr-1" size={14} /> Add Allergy
            </button>
          </div>
        </div>
      </Card>
      
      <Card title="Emergency Contacts" icon={FiHeart}>
        <div className="space-y-4">
          {formData.emergencyContacts.map((contact, index) => (
            <motion.div 
              key={index} 
              className="p-4 bg-slate-100 rounded-lg border border-slate-200 grid grid-cols-1 md:grid-cols-4 gap-3 items-center text-sm"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-[#0077B6]" size={14} />
                <input 
                  name="name" 
                  value={contact.name} 
                  onChange={(e) => handleEmergencyContactChange(index, e)} 
                  placeholder="Name" 
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
                />
              </div>
              <div className="relative">
                <FiUser className="absolute left-3 top-3 text-[#0077B6]" size={14} />
                <input 
                  name="relationship" 
                  value={contact.relationship} 
                  onChange={(e) => handleEmergencyContactChange(index, e)} 
                  placeholder="Relationship" 
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
                />
              </div>
              <div className="relative">
                <FiPhone className="absolute left-3 top-3 text-[#0077B6]" size={14} />
                <input 
                  name="phone" 
                  value={contact.phone} 
                  onChange={(e) => handleEmergencyContactChange(index, e)} 
                  placeholder="Phone" 
                  className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-lg text-[#023E8A] focus:outline-none focus:ring-2 focus:ring-[#48CAE4] focus:border-[#48CAE4] text-sm" 
                />
              </div>
              <button 
                type="button" 
                onClick={() => removeEmergencyContactField(index)} 
                className="px-3 py-2 text-red-600 bg-red-100 rounded-lg hover:bg-red-200 transition-colors text-sm"
              >
                Remove
              </button>
            </motion.div>
          ))}
          <button 
            type="button" 
            onClick={addEmergencyContactField} 
            className="text-sm text-[#0077B6] hover:text-[#0096C7] hover:underline flex items-center"
          >
            <FiPlus className="mr-1" size={14} /> Add Emergency Contact
          </button>
        </div>
      </Card>
    </div>
    
    <div className="flex justify-end gap-3 pt-6 border-t border-slate-200 mt-6">
      <button 
        type="button" 
        onClick={handleCancel} 
        className="px-5 py-2.5 text-[#0077B6] bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
      >
        Cancel
      </button>
      <button 
        type="submit" 
        disabled={loading} 
        className="px-5 py-2.5 text-white bg-[#0077B6] rounded-lg hover:bg-[#0096C7] disabled:opacity-50 transition-all flex items-center text-sm font-medium shadow-md"
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
  </form>
);

function Profile() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showPartialModal, setShowPartialModal] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError('');
        const profileData = await patientService.getProfile();
        setProfile(profileData);
        // Show modal for new users without a profile
        if (!profileData) {
          setShowPartialModal(true);
        }
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setProfile(null);
          setShowPartialModal(true);
        } else {
          setError(err.message || 'Could not load profile.');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setFormData({
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      dateOfBirth: profile?.dateOfBirth ? new Date(profile.dateOfBirth).toISOString().split('T')[0] : '',
      gender: profile?.gender || '',
      contactNumber: profile?.contactNumber || '',
      address: profile?.address || '',
      bloodGroup: profile?.bloodGroup || '',
      allergies: profile?.allergies?.length > 0 && profile.allergies[0] ? profile.allergies : [''],
      emergencyContacts: profile?.emergencyContacts?.length > 0 && profile.emergencyContacts[0]?.name ? profile.emergencyContacts : [{ name: '', relationship: '', phone: '' }],
    });
    setIsEditing(true);
    setShowPartialModal(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setMessage('');
    setError('');
    // If canceling a new profile creation, show the modal again
    if (!profile) {
      setShowPartialModal(true);
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleAllergyChange = (index, value) => {
    const newAllergies = [...formData.allergies];
    newAllergies[index] = value;
    setFormData({ ...formData, allergies: newAllergies });
  };

  const addAllergyField = () => setFormData({ ...formData, allergies: [...formData.allergies, ''] });

  const removeAllergyField = (index) => {
    const newAllergies = formData.allergies.filter((_, i) => i !== index);
    setFormData({ ...formData, allergies: newAllergies });
  };

  const handleEmergencyContactChange = (index, e) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index][e.target.name] = e.target.value;
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const addEmergencyContactField = () => setFormData({ ...formData, emergencyContacts: [...formData.emergencyContacts, { name: '', relationship: '', phone: '' }] });

  const removeEmergencyContactField = (index) => {
    const newContacts = formData.emergencyContacts.filter((_, i) => i !== index);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const finalFormData = {
        ...formData,
        allergies: formData.allergies.filter(a => a && a.trim() !== ''),
        emergencyContacts: formData.emergencyContacts.filter(c => c && c.name && c.name.trim() !== '')
      };
      const updatedProfile = await patientService.updateProfile(finalFormData);
      setProfile(updatedProfile);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setShowPartialModal(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isEditing) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="bg-white rounded-xl p-8 shadow-md border border-slate-200 w-full max-w-2xl flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#0077B6] mx-auto"></div>
            <p className="text-[#0077B6] mt-4 text-sm">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200 h-full">
        {/* Message and Error Display */}
        <AnimatePresence>
          {(error || message) && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mb-6 px-4 py-3 rounded-lg ${error ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-[#ADE8F4]/50 text-[#0077B6] border border-[#90E0EF]'} text-sm`}
            >
              {error || message}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Container */}
        <div className="h-full flex flex-col md:flex-row gap-6">
          {/* Left Column - vCard/Summary Panel */}
          <div className="w-full md:w-1/3 flex flex-col">
            <div className="bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm flex flex-col items-center text-center mb-6">
              <div className="w-24 h-24 rounded-full bg-[#0096C7] flex items-center justify-center mb-4">
                <FiUser className="text-3xl text-white" />
              </div>
              <h2 className="text-xl font-bold text-[#023E8A] mb-2">
                {profile ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim() : user?.email?.split('@')[0]}
              </h2>
              <div className="space-y-2 mt-4 text-left w-full text-sm">
                <p className="flex items-center text-[#0077B6]"><FiMail className="mr-2 text-[#0096C7]" size={16} /> {user?.email}</p>
                {profile?.contactNumber && (
                  <p className="flex items-center text-[#0077B6]"><FiPhone className="mr-2 text-[#0096C7]" size={16} /> {profile.contactNumber}</p>
                )}
              </div>
            </div>
            
            <div className="mt-auto">
              {!isEditing ? (
                <button 
                  onClick={handleEdit} 
                  className="w-full py-3 text-white font-semibold bg-[#0077B6] rounded-lg hover:bg-[#0096C7] transition-all transform hover:scale-[1.02] flex items-center justify-center text-sm shadow-md"
                >
                  <FiEdit3 className="mr-2" size={16} /> Edit Profile
                </button>
              ) : (
                <div className="flex gap-3">
                  <button 
                    onClick={handleCancel} 
                    className="flex-1 py-2.5 text-[#0077B6] bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    disabled={loading}
                    className="flex-1 py-2.5 text-white bg-[#0077B6] rounded-lg hover:bg-[#0096C7] disabled:opacity-50 transition-all flex items-center justify-center text-sm font-medium shadow-md"
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
          
          {/* Right Column - Profile Details */}
          <div className="flex-1 overflow-hidden">
            {isEditing && formData ? (
              <EditForm 
                formData={formData}
                handleChange={handleChange}
                handleAllergyChange={handleAllergyChange}
                addAllergyField={addAllergyField}
                removeAllergyField={removeAllergyField}
                handleEmergencyContactChange={handleEmergencyContactChange}
                addEmergencyContactField={addEmergencyContactField}
                removeEmergencyContactField={removeEmergencyContactField}
                handleSubmit={handleSubmit}
                handleCancel={handleCancel}
                loading={loading}
              />
            ) : profile ? (
              <ProfileView profile={profile} onEdit={handleEdit} />
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">
                <p>No profile data available. Please create one.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Partial Profile Modal */}
      <AnimatePresence>
        {showPartialModal && (
          <PartialProfileModal 
            onEdit={handleEdit} 
            onClose={() => setShowPartialModal(false)} 
          />
        )}
      </AnimatePresence>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0; /* slate-200 */
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #90E0EF;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #48CAE4;
        }
      `}</style>
    </div>
  );
}

export default Profile;