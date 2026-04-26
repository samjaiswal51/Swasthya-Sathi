import React from 'react';
import { Camera, UserCircle, HeartPulse, ShieldAlert, Activity, Save, Loader2, X, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileEditForm = ({
  user,
  formData,
  handleChange,
  handleSubmit,
  handlePhotoChange,
  profilePhoto,
  photoPreview,
  existingPhotoUrl,
  setProfilePhoto,
  setPhotoPreview,
  setExistingPhotoUrl,
  calculateAge,
  saving,
  onCancel
}) => {

  const baseGlassStyle = "bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.12)] backdrop-blur-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300";
  const inputStyle = "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm transition-all duration-200 hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.06)] focus:border-[rgba(59,130,246,0.50)] focus:bg-[rgba(59,130,246,0.06)] focus:shadow-[0_0_0_3px_rgba(59,130,246,0.12),inset_0_1px_0_rgba(255,255,255,0.04)] focus:outline-none appearance-none";
  const emergencyInputStyle = "w-full bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-slate-200 placeholder:text-slate-600 rounded-xl px-4 py-3 text-sm transition-all duration-200 hover:border-[rgba(255,255,255,0.14)] hover:bg-[rgba(255,255,255,0.06)] focus:border-[rgba(251,113,133,0.40)] focus:bg-[rgba(251,113,133,0.04)] focus:shadow-[0_0_0_3px_rgba(251,113,133,0.10)] focus:outline-none";

  const Label = ({ children, required }) => (
    <label className="flex items-center gap-1.5 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
      {required && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 flex-shrink-0" />}
      {children}
    </label>
  );

  const SectionHeader = ({ icon: Icon, title, index }) => (
    <motion.div 
      initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07 }}
      className="flex items-center gap-3 mb-5 pb-3 border-b border-[rgba(59,130,246,0.10)]"
    >
      <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/15 flex items-center justify-center">
        <Icon className="text-blue-400 w-4 h-4" />
      </div>
      <h2 className="text-slate-200 font-bold text-sm uppercase tracking-wider">{title}</h2>
    </motion.div>
  );

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.35 }}
      onSubmit={handleSubmit} 
      className={`${baseGlassStyle} p-6 sm:p-8 rounded-3xl`}
    >
      <style>{`
        @keyframes pulse-glow {
          0% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
          50% { box-shadow: 0 0 35px rgba(59,130,246,0.6); }
          100% { box-shadow: 0 0 20px rgba(59,130,246,0.3); }
        }
        .btn-pulse { animation: pulse-glow 2s infinite; }
        
        select {
          background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2364748b' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
          background-position: right 0.5rem center;
          background-repeat: no-repeat;
          background-size: 1.5em 1.5em;
        }
      `}</style>

      {/* PHOTO UPLOAD SECTION */}
      <div className="flex flex-col items-center justify-center mb-10 pb-8 border-b border-[rgba(255,255,255,0.06)]">
        <div className="w-28 h-28 rounded-full border-[3px] border-[rgba(59,130,246,0.30)] shadow-[0_0_0_4px_rgba(59,130,246,0.10),0_0_24px_rgba(59,130,246,0.20)] overflow-hidden bg-[rgba(15,23,42,0.6)] flex items-center justify-center mb-5">
          {(photoPreview || existingPhotoUrl) ? (
            <img src={photoPreview || existingPhotoUrl} alt="Profile Preview" className="w-full h-full object-cover" />
          ) : (
            <UserCircle className="w-16 h-16 text-slate-600" />
          )}
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <label className="flex items-center cursor-pointer bg-[rgba(59,130,246,0.10)] border border-[rgba(59,130,246,0.20)] text-blue-400 font-semibold text-sm hover:bg-[rgba(59,130,246,0.18)] hover:border-[rgba(59,130,246,0.35)] px-4 py-2 rounded-xl transition-all">
            <Camera className="w-4 h-4 mr-2" />
            Upload Photo
            <input type="file" className="hidden" accept=".jpg,.jpeg,.png" onChange={handlePhotoChange} />
          </label>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Max Size: 5MB</p>
          {(photoPreview || existingPhotoUrl) && (
            <button type="button" onClick={() => { setProfilePhoto(null); setPhotoPreview(null); setExistingPhotoUrl(''); }} className="text-xs text-rose-400 hover:text-rose-300 font-semibold mt-1 transition-colors">
              Remove Photo
            </button>
          )}
        </div>
      </div>

      <div className="space-y-8">
        
        {/* 1. PERSONAL DETAILS */}
        <div>
          <SectionHeader icon={UserCircle} title="Personal Details" index={1} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Full Name</Label>
              <input type="text" value={user?.name || ''} readOnly className={`${inputStyle} opacity-60 cursor-not-allowed`} />
            </div>
            <div>
              <Label>Email Address</Label>
              <input type="email" value={user?.email || ''} readOnly className={`${inputStyle} opacity-60 cursor-not-allowed`} />
            </div>
            <div>
              <Label required>Mobile Number</Label>
              <input required type="tel" name="mobile" value={formData.mobile} onChange={handleChange} className={inputStyle} placeholder="10 digit mobile" />
            </div>
            <div>
              <Label required>Date of Birth</Label>
              {/* Ensure standard date picker works within dark mode via color-scheme CSS or standard styling */}
              <input required type="date" name="dob" max={new Date().toISOString().split('T')[0]} value={formData.dob} onChange={handleChange} className={`${inputStyle} [color-scheme:dark]`} />
            </div>
            <div>
              <Label>Age (Calculated)</Label>
              <input type="text" value={calculateAge(formData.dob)} readOnly className={`${inputStyle} opacity-60 cursor-not-allowed`} />
            </div>
            <div>
              <Label>Gender</Label>
              <select name="gender" value={formData.gender} onChange={handleChange} className={inputStyle}>
                <option value="Male" className="bg-[#0b1526] text-slate-200">Male</option>
                <option value="Female" className="bg-[#0b1526] text-slate-200">Female</option>
                <option value="Other" className="bg-[#0b1526] text-slate-200">Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* 2. ADDRESS DETAILS */}
        <div>
          <SectionHeader icon={Activity} title="Address Details" index={2} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label>Address Line</Label>
              <input type="text" name="addressLine" value={formData.addressLine} onChange={handleChange} className={inputStyle} placeholder="House/Flat No., Street, Area" />
            </div>
            <div>
              <Label>City</Label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className={inputStyle} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>State</Label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className={inputStyle} />
              </div>
              <div>
                <Label>Pincode</Label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* 3. MEDICAL DETAILS */}
        <div>
          <SectionHeader icon={HeartPulse} title="Medical Details" index={3} />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <Label required>Blood Group</Label>
              <select required name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} className={inputStyle}>
                {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg} className="bg-[#0b1526] text-slate-200">{bg}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Height (cm)</Label>
              <input type="number" min="0" name="height" value={formData.height} onChange={handleChange} className={inputStyle} />
            </div>
            <div>
              <Label>Weight (kg)</Label>
              <input type="number" min="0" step="0.1" name="weight" value={formData.weight} onChange={handleChange} className={inputStyle} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Allergies (comma separated)</Label>
              <input type="text" name="allergies" value={formData.allergies} onChange={handleChange} placeholder="e.g. Penicillin, Dust" className={inputStyle} />
            </div>
            <div>
              <Label>Existing Diseases (comma separated)</Label>
              <input type="text" name="diseases" value={formData.diseases} onChange={handleChange} placeholder="e.g. Diabetes, Asthma" className={inputStyle} />
            </div>
            <div className="md:col-span-2">
              <Label>Current Medications</Label>
              <textarea name="medications" value={formData.medications} onChange={handleChange} rows="2" placeholder="List your current ongoing medications..." className={inputStyle}></textarea>
            </div>
            <div className="md:col-span-2">
              <Label>Disability / Special Needs (Optional)</Label>
              <input type="text" name="disability" value={formData.disability} onChange={handleChange} className={inputStyle} />
            </div>
          </div>
        </div>

        {/* 4. LIFESTYLE DETAILS */}
        <div>
          <SectionHeader icon={Activity} title="Lifestyle Details" index={4} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label>Smoking Habit</Label>
              <select name="smoker" value={formData.smoker} onChange={handleChange} className={inputStyle}>
                {['Smoker', 'Non Smoker', 'Occasional'].map(opt => (
                  <option key={opt} value={opt} className="bg-[#0b1526] text-slate-200">{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Alcohol Consumption</Label>
              <select name="alcohol" value={formData.alcohol} onChange={handleChange} className={inputStyle}>
                {['No', 'Sometimes', 'Regular'].map(opt => (
                  <option key={opt} value={opt} className="bg-[#0b1526] text-slate-200">{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <Label>Marital Status</Label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} className={inputStyle}>
                <option value="Single" className="bg-[#0b1526] text-slate-200">Single</option>
                <option value="Married" className="bg-[#0b1526] text-slate-200">Married</option>
                <option value="Divorced" className="bg-[#0b1526] text-slate-200">Divorced</option>
                <option value="Widowed" className="bg-[#0b1526] text-slate-200">Widowed</option>
              </select>
            </div>
            <div>
              <Label>Occupation</Label>
              <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} className={inputStyle} />
            </div>
          </div>
        </div>

        {/* 5. EMERGENCY CONTACT */}
        <div className="bg-[rgba(251,113,133,0.04)] border border-[rgba(251,113,133,0.12)] p-6 sm:p-8 rounded-2xl mt-8">
          <div className="flex items-center gap-3 mb-5 pb-3 border-b border-[rgba(251,113,133,0.15)]">
            <ShieldAlert className="text-rose-400 w-5 h-5" />
            <h2 className="text-rose-300 font-bold text-sm uppercase tracking-wider">Emergency Contact</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-1.5 text-rose-500/70 text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" /> Contact Name
              </label>
              <input required type="text" name="emergencyName" value={formData.emergencyName} onChange={handleChange} className={emergencyInputStyle} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-rose-500/70 text-xs font-semibold uppercase tracking-wider mb-2">
                Relationship
              </label>
              <input type="text" name="emergencyRelation" value={formData.emergencyRelation} onChange={handleChange} className={emergencyInputStyle} placeholder="e.g. Spouse, Parent" />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-rose-500/70 text-xs font-semibold uppercase tracking-wider mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 flex-shrink-0" /> Emergency Mobile Number
              </label>
              <input required type="tel" name="emergencyMobile" value={formData.emergencyMobile} onChange={handleChange} className={emergencyInputStyle} />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-rose-500/70 text-xs font-semibold uppercase tracking-wider mb-2">
                Alternate Contact
              </label>
              <input type="tel" name="emergencyAlternate" value={formData.emergencyAlternate} onChange={handleChange} className={emergencyInputStyle} />
            </div>
          </div>
        </div>

        {/* FORM ACTION BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 mt-8 border-t border-[rgba(255,255,255,0.06)] pt-8">
          <button
            type="button"
            onClick={onCancel}
            className="bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.10)] text-slate-400 hover:text-slate-200 hover:bg-[rgba(255,255,255,0.07)] hover:border-[rgba(255,255,255,0.18)] px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex justify-center items-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold px-8 py-3 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.30)] hover:shadow-[0_0_30px_rgba(59,130,246,0.50)] transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center btn-pulse"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Complete Profile
              </>
            )}
          </button>
        </div>

      </div>
    </motion.form>
  );
};

export default ProfileEditForm;
