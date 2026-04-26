import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../../context/AuthContext';
import { ShieldAlert, Loader2, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

import ProfileViewCard from './components/ProfileViewCard';
import ProfileEditForm from './components/ProfileEditForm';

const Profile = () => {
  const { user } = useContext(AuthContext);
  
  // State
  const [formData, setFormData] = useState({
    mobile: '',
    dob: '',
    gender: 'Male',
    addressLine: '',
    city: '',
    state: '',
    pincode: '',
    bloodGroup: 'A+',
    height: '',
    weight: '',
    allergies: '',
    diseases: '',
    medications: '',
    disability: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyMobile: '',
    emergencyAlternate: '',
    maritalStatus: 'Single',
    occupation: '',
    smoker: 'Non Smoker',
    alcohol: 'No'
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [progress, setProgress] = useState(0);
  
  // UI State
  const [hasProfile, setHasProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const fetchData = async () => {
    try {
      const [profileRes, notesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patient/profile'),
        axios.get('http://localhost:5000/api/update-requests/patient/clinical-notes')
      ]);
      
      if (profileRes.data) {
        const p = profileRes.data;
        setFormData({
          mobile: p.mobile || '',
          dob: p.dob ? new Date(p.dob).toISOString().split('T')[0] : '',
          gender: p.gender || 'Male',
          addressLine: p.address?.line || '',
          city: p.address?.city || '',
          state: p.address?.state || '',
          pincode: p.address?.pincode || '',
          bloodGroup: p.bloodGroup || 'A+',
          height: p.height || '',
          weight: p.weight || '',
          allergies: p.allergies ? p.allergies.join(', ') : '',
          diseases: p.diseases ? p.diseases.join(', ') : '',
          medications: p.medications || '',
          disability: p.disability || '',
          emergencyName: p.emergencyContact?.name || '',
          emergencyRelation: p.emergencyContact?.relation || '',
          emergencyMobile: p.emergencyContact?.mobile || '',
          emergencyAlternate: p.emergencyContact?.alternateMobile || '',
          maritalStatus: p.maritalStatus || 'Single',
          occupation: p.occupation || '',
          smoker: p.lifestyle?.smoker || 'Non Smoker',
          alcohol: p.lifestyle?.alcohol || 'No'
        });
        
        if (p.profilePhoto) {
          setExistingPhotoUrl(p.profilePhoto);
        }

        // Determine if they actually have a filled profile
        if (p.mobile && p.dob) {
          setHasProfile(true);
          setIsEditing(false); // Default to read-only
        } else {
          setHasProfile(false);
          setIsEditing(true); // Force edit mode
        }
      } else {
        setHasProfile(false);
        setIsEditing(true);
      }
      
      if (notesRes.data) {
        setClinicalNotes(notesRes.data);
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setHasProfile(false);
        setIsEditing(true);
      } else {
        toast.error("Failed to load profile data");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let filled = 0;
    const requiredFields = ['mobile', 'dob', 'addressLine', 'bloodGroup', 'height', 'weight', 'emergencyName', 'emergencyMobile'];
    requiredFields.forEach(field => {
      if (formData[field]) filled++;
    });
    setProgress(Math.round((filled / requiredFields.length) * 100));
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size must be less than 5MB");
        return;
      }
      setProfilePhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const calculateAge = (dob) => {
    if (!dob) return '';
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    if (formData.mobile.length < 10) {
      toast.error("Valid 10 digit mobile number is required");
      setSaving(false);
      return;
    }

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      if (profilePhoto) {
        data.append('profilePhoto', profilePhoto);
      }

      await axios.post('http://localhost:5000/api/patient/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success("Profile updated successfully!");
      await fetchData(); // Refresh data completely
      
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving profile");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 space-y-4">
        <div className="w-16 h-16 rounded-full border-4 border-blue-500/20 border-t-blue-500 animate-spin" />
        <p className="text-slate-400 font-medium text-sm mt-4">Loading your profile...</p>
      </div>
    );
  }

  const baseGlassStyle = "bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.12)] backdrop-blur-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)]";

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-white font-extrabold text-3xl tracking-tight border-l-4 border-blue-500 pl-4">
            {!hasProfile ? 'Create Your Profile' : 'My Health Profile'}
          </h1>
          <p className="text-slate-400 text-sm mt-1 ml-5">Keep your health details updated for better emergency care and precision medicine.</p>
        </div>
      </div>

      {/* READ ONLY VIEW */}
      {hasProfile && !isEditing && (
        <div className="space-y-6">
          <ProfileViewCard 
            formData={formData} 
            user={user} 
            progress={progress} 
            existingPhotoUrl={existingPhotoUrl} 
          />
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="flex justify-center sm:justify-start"
          >
            <button
              onClick={() => setIsEditing(true)}
              className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white py-3 px-8 rounded-xl font-bold shadow-[0_0_20px_rgba(59,130,246,0.30)] hover:shadow-[0_0_30px_rgba(59,130,246,0.50)] transition-all duration-300 hover:scale-105 active:scale-95 flex items-center space-x-2"
            >
              <Edit3 className="w-5 h-5" />
              <span>Edit Profile Details</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* EDIT / CREATE FORM */}
      <AnimatePresence>
        {isEditing && (
          <ProfileEditForm 
            user={user}
            formData={formData}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            handlePhotoChange={handlePhotoChange}
            profilePhoto={profilePhoto}
            photoPreview={photoPreview}
            existingPhotoUrl={existingPhotoUrl}
            setProfilePhoto={setProfilePhoto}
            setPhotoPreview={setPhotoPreview}
            setExistingPhotoUrl={setExistingPhotoUrl}
            calculateAge={calculateAge}
            saving={saving}
            onCancel={() => {
              if (hasProfile) {
                setIsEditing(false);
                fetchData(); // reset any unsaved changes
              } else {
                toast.error("You must create a profile first.");
              }
            }}
          />
        )}
      </AnimatePresence>

      {/* Latest Doctor Updates */}
      {!isEditing && clinicalNotes.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className={`${baseGlassStyle} border-l-[4px] border-l-[#34d399] p-6 sm:p-8 rounded-2xl mt-12`}
        >
          <h2 className="text-slate-100 font-bold text-lg flex items-center">
            <ShieldAlert className="text-emerald-400 w-5 h-5 mr-2" />
            Latest Clinical Updates
          </h2>
          <p className="text-slate-500 text-sm mb-6 mt-1">These records were automatically updated based on approvals you gave to your connected doctors.</p>
          
          <div className="space-y-4">
            {clinicalNotes.slice(0, 3).map((note, index) => (
              <motion.div 
                key={note._id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.09 }}
                className="bg-[rgba(52,211,153,0.05)] border border-[rgba(52,211,153,0.15)] hover:border-[rgba(52,211,153,0.30)] hover:bg-[rgba(52,211,153,0.08)] p-5 rounded-xl transition-all duration-200"
              >
                <div className="flex justify-between items-start mb-3">
                  <p className="text-emerald-300 font-bold text-sm">Update by {note.doctorName}</p>
                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-lg text-xs font-semibold">
                    {new Date(note.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {note.diagnosis && (
                  <p className="text-slate-400 text-sm mb-1.5"><span className="text-slate-300 font-semibold">Diagnosis:</span> {note.diagnosis}</p>
                )}
                {note.prescriptions && note.prescriptions.length > 0 && (
                  <p className="text-slate-400 text-sm mb-1.5"><span className="text-slate-300 font-semibold">Medicines:</span> {note.prescriptions.map(p => p.medicineName).join(', ')}</p>
                )}
                {note.advice && (
                  <p className="text-slate-400 text-sm"><span className="text-slate-300 font-semibold">Advice:</span> {note.advice}</p>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

    </div>
  );
};

export default Profile;
