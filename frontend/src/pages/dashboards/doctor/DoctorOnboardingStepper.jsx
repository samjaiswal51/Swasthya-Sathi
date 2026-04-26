import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../../context/AuthContext';
import { 
  FaUser, FaStethoscope, FaFileUpload, FaCheckCircle, 
  FaChevronRight, FaChevronLeft, FaCamera, FaHospital, FaRupeeSign 
} from 'react-icons/fa';

const steps = [
  { id: 1, title: 'Basic Details', icon: <FaUser /> },
  { id: 2, title: 'Professional', icon: <FaStethoscope /> },
  { id: 3, title: 'Documents', icon: <FaFileUpload /> },
  { id: 4, title: 'Review', icon: <FaCheckCircle /> },
];

const DoctorOnboardingStepper = ({ onComplete }) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    gender: '',
    dob: '',
    mobile: '',
    email: user?.email || '',
    registrationNumber: '',
    degree: '',
    specialization: '',
    experienceYears: '',
    hospitalName: '',
    consultationFee: '',
    languages: [],
    bio: '',
    days: [],
    morningStart: '',
    morningEnd: '',
    eveningStart: '',
    eveningEnd: '',
    consultationMode: 'Both',
    clinicAddress: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [files, setFiles] = useState({
    profilePhoto: null,
    degreeCertificate: null,
    licenseCertificate: null,
    idProof: null,
  });

  const [previews, setPreviews] = useState({
    profilePhoto: '',
    degreeCertificate: '',
    licenseCertificate: '',
    idProof: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelect = (name, value) => {
    setFormData(prev => {
      const current = prev[name] || [];
      if (current.includes(value)) {
        return { ...prev, [name]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [name]: [...current, value] };
      }
    });
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size should be less than 10MB');
        return;
      }
      setFiles(prev => ({ ...prev, [name]: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => ({ ...prev, [name]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateStep = () => {
    if (currentStep === 1) {
      if (!formData.fullName || !formData.gender || !formData.dob || !formData.mobile) {
        toast.error('Please fill all basic details');
        return false;
      }
    } else if (currentStep === 2) {
      if (!formData.registrationNumber || !formData.degree || !formData.specialization || !formData.experienceYears) {
        toast.error('Please fill all professional details');
        return false;
      }
    } else if (currentStep === 3) {
      if (!files.degreeCertificate || !files.licenseCertificate || !files.idProof) {
        toast.error('Please upload all required documents');
        return false;
      }
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (Array.isArray(formData[key])) {
          data.append(key, JSON.stringify(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });
      Object.keys(files).forEach(key => {
        if (files[key]) data.append(key, files[key]);
      });

      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/doctor/profile', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      toast.success('Profile submitted successfully for verification!');
      if (onComplete) onComplete(); 
      else navigate('/doctor-dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Error submitting profile');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3.5 rounded-2xl border border-emerald-500/15 bg-white/50 backdrop-blur-sm focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-slate-800 transition-all font-medium placeholder-slate-400 shadow-sm";
  const labelCls = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1";

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 font-sans relative overflow-hidden"
         style={{ background: 'linear-gradient(180deg, #F0FDF4 0%, #FFFFFF 100%)' }}>
      
      {/* Premium ambient glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-slate-900 sm:text-4xl tracking-tight mb-3">
            Doctor Verification
          </h1>
          <p className="text-lg text-emerald-600/80 font-medium">
            Establish your premium medical identity on Swasthya Sathi.
          </p>
        </motion.div>

        {/* Premium Glass Progress Rail */}
        <div className="mb-14 relative px-4">
          <div className="absolute left-8 right-8 top-1/2 h-1.5 bg-slate-200/60 rounded-full -translate-y-1/2 z-0" />
          <motion.div 
            className="absolute left-8 top-1/2 h-1.5 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 -translate-y-1/2 z-0 shadow-[0_0_12px_rgba(16,185,129,0.5)]" 
            initial={{ width: 0 }}
            animate={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 4rem)` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
          
          <div className="flex items-center justify-between relative z-10">
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div 
                  initial={false}
                  animate={{ 
                    scale: currentStep === step.id ? 1.2 : 1,
                    backgroundColor: currentStep >= step.id ? '#10B981' : '#F8FAFC',
                    borderColor: currentStep >= step.id ? '#059669' : '#E2E8F0',
                    color: currentStep >= step.id ? '#FFFFFF' : '#94A3B8'
                  }}
                  className="w-12 h-12 rounded-2xl flex items-center justify-center border-2 shadow-sm transition-colors duration-300"
                >
                  {currentStep > step.id ? <FaCheckCircle className="w-5 h-5" /> : React.cloneElement(step.icon, { className: 'w-5 h-5' })}
                </motion.div>
                <span className={`mt-3 text-[10px] font-extrabold uppercase tracking-widest ${currentStep >= step.id ? 'text-emerald-700' : 'text-slate-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Premium Form Glass Container */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/70 backdrop-blur-2xl rounded-[2rem] shadow-[0_20px_60px_rgba(16,185,129,0.08)] border border-emerald-500/10 p-8 sm:p-12"
        >
          <AnimatePresence mode="wait">
            
            {/* ── STEP 1: BASIC DETAILS ── */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                
                <div className="flex flex-col items-center mb-10">
                  <div className="relative group">
                    <div className="w-36 h-36 rounded-[2rem] bg-emerald-50/50 border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden group-hover:border-emerald-500 transition-all shadow-inner relative z-10">
                      {previews.profilePhoto ? (
                        <img src={previews.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <FaCamera className="text-4xl text-emerald-300 group-hover:text-emerald-500 transition-colors" />
                      )}
                    </div>
                    <div className="absolute inset-0 rounded-[2rem] bg-emerald-400/20 blur-xl group-hover:bg-emerald-400/30 transition-all z-0" />
                    
                    <label className="absolute -bottom-3 -right-3 bg-emerald-500 text-white p-3.5 rounded-2xl cursor-pointer shadow-lg shadow-emerald-500/30 hover:scale-110 hover:bg-emerald-600 transition-all z-20">
                      <FaFileUpload size={16} />
                      <input type="file" name="profilePhoto" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                  </div>
                  <p className="mt-6 text-sm font-bold text-slate-500 uppercase tracking-widest">Profile Photo</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div><label className={labelCls}>Full Name *</label><input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} className={inputCls} placeholder="Dr. John Doe" /></div>
                  <div><label className={labelCls}>Email Address</label><input type="email" name="email" value={formData.email} disabled className={`${inputCls} bg-slate-100 text-slate-400 border-transparent cursor-not-allowed`} /></div>
                  <div><label className={labelCls}>Mobile Number *</label><input type="tel" name="mobile" value={formData.mobile} onChange={handleInputChange} className={inputCls} placeholder="+91 98765 43210" /></div>
                  <div><label className={labelCls}>Gender *</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputCls}>
                      <option value="">Select Gender</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                    </select>
                  </div>
                  <div><label className={labelCls}>Date of Birth *</label><input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className={inputCls} /></div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 2: PROFESSIONAL ── */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2"><label className={labelCls}>Medical Registration No. *</label><input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleInputChange} className={inputCls} placeholder="Reg-123456789" /></div>
                  <div><label className={labelCls}>Degree *</label><input type="text" name="degree" value={formData.degree} onChange={handleInputChange} className={inputCls} placeholder="MBBS, MD" /></div>
                  <div><label className={labelCls}>Specialization *</label>
                    <select name="specialization" value={formData.specialization} onChange={handleInputChange} className={inputCls}>
                      <option value="">Select Specialization</option>
                      {['General Physician','Cardiologist','Dermatologist','Orthopedic','ENT','Gynecologist','Neurologist','Dentist','Pediatrician','Psychiatrist','Other'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div><label className={labelCls}>Experience (Years) *</label><input type="number" name="experienceYears" value={formData.experienceYears} onChange={handleInputChange} className={inputCls} placeholder="5" /></div>
                  <div>
                    <label className={labelCls}>Consultation Fee (₹)</label>
                    <div className="relative">
                      <FaRupeeSign className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                      <input type="number" name="consultationFee" value={formData.consultationFee} onChange={handleInputChange} className={`${inputCls} pl-10`} placeholder="500" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Hospital / Clinic Name</label>
                    <div className="relative">
                      <FaHospital className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500" />
                      <input type="text" name="hospitalName" value={formData.hospitalName} onChange={handleInputChange} className={`${inputCls} pl-10`} placeholder="City General Hospital" />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>Languages Spoken</label>
                    <div className="flex flex-wrap gap-2.5 mt-2">
                      {['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Gujarati'].map(lang => (
                        <button key={lang} type="button" onClick={() => handleMultiSelect('languages', lang)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            formData.languages.includes(lang) ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' : 'bg-white border border-slate-200 text-slate-600 hover:border-emerald-300 hover:text-emerald-600'
                          }`}>
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={labelCls}>About Doctor (Bio)</label>
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows="3" className={inputCls} placeholder="Brief description of your expertise..." />
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: DOCUMENTS ── */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                {[
                  { name: 'degreeCertificate', label: 'Medical Degree Certificate' },
                  { name: 'licenseCertificate', label: 'Medical License Certificate' },
                  { name: 'idProof', label: 'ID Proof (Aadhar/PAN/Passport)' }
                ].map((doc, idx) => (
                  <motion.div key={doc.name} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                    className="p-6 rounded-[2rem] border-2 border-dashed border-slate-200 hover:border-emerald-400 bg-white/50 backdrop-blur-sm transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="font-extrabold text-slate-800 text-lg">{doc.label}</h4>
                      <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wide">Accepted: PDF, JPG, PNG (Max 10MB)</p>
                      {files[doc.name] && (
                        <div className="mt-3 flex items-center gap-2 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 max-w-fit">
                          <FaCheckCircle className="text-emerald-500 w-3.5 h-3.5" />
                          <span className="text-xs font-bold text-emerald-700 truncate max-w-[200px]">{files[doc.name].name}</span>
                        </div>
                      )}
                    </div>
                    <label className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-xl cursor-pointer shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all font-bold text-sm whitespace-nowrap hover:scale-105">
                      {files[doc.name] ? 'Replace File' : 'Upload File'}
                      <input type="file" name={doc.name} className="hidden" onChange={handleFileChange} accept=".pdf,.jpg,.jpeg,.png" />
                    </label>
                  </motion.div>
                ))}
              </motion.div>
            )}

            {/* ── STEP 4: REVIEW ── */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-[2rem] shadow-xl text-white relative overflow-hidden">
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                  
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white/20 shadow-2xl bg-white/10 flex items-center justify-center flex-shrink-0 z-10">
                    {previews.profilePhoto ? (
                      <img src={previews.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-extrabold text-white">{formData.fullName?.charAt(0)?.toUpperCase() || 'D'}</span>
                    )}
                  </div>
                  <div className="text-center sm:text-left z-10">
                    <h3 className="text-3xl font-extrabold tracking-tight mb-1">{formData.fullName}</h3>
                    <p className="text-emerald-100 font-bold tracking-wide">{formData.specialization} • {formData.experienceYears} yrs Exp</p>
                    <p className="text-emerald-200 text-sm mt-2">{formData.degree}</p>
                    <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                      <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold">₹{formData.consultationFee} Fee</span>
                      <span className="px-3 py-1 rounded-full bg-white/20 border border-white/30 text-xs font-bold">{formData.hospitalName}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200/60 flex items-start gap-4">
                  <div className="p-2 bg-amber-100 rounded-full flex-shrink-0">
                    <FaCheckCircle className="text-amber-600 w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-amber-800">Final Verification Consent</h4>
                    <p className="text-xs font-medium text-amber-700/80 mt-1 leading-relaxed">
                      By submitting, you certify that all provided information and documents are authentic. False information may lead to permanent account suspension from Swasthya Sathi.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ── Navigation Buttons ── */}
          <div className="mt-12 flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-8 border-t border-slate-100">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={handleBack} disabled={currentStep === 1 || loading}
              className={`w-full sm:w-auto flex justify-center items-center gap-2 px-8 py-3.5 rounded-xl font-bold transition-all border-2 ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600 bg-white'
              }`}
            >
              <FaChevronLeft className="w-3 h-3" /> Back
            </motion.button>
            
            {currentStep === steps.length ? (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleSubmit} disabled={loading}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-10 py-3.5 rounded-xl font-extrabold shadow-[0_8px_20px_rgba(16,185,129,0.3)] hover:shadow-[0_12px_25px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <FaCheckCircle />}
                {loading ? 'Submitting...' : 'Submit Profile'}
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={handleNext}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#022C22] text-white px-10 py-3.5 rounded-xl font-extrabold shadow-[0_8px_20px_rgba(2,44,34,0.2)] hover:bg-[#064E3B] transition-colors"
              >
                Next Step <FaChevronRight className="w-3 h-3" />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DoctorOnboardingStepper;
