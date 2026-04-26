import React from 'react';
import { ShieldAlert, UserCircle, MapPin, Phone, Droplet, Ruler, Activity, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const ProfileViewCard = ({ formData, user, progress, existingPhotoUrl }) => {
  const isEmergencyReady = formData.bloodGroup && formData.emergencyName && formData.emergencyMobile;

  const calculateAge = (dob) => {
    if (!dob) return 'N/A';
    const diff = Date.now() - new Date(dob).getTime();
    const ageDate = new Date(diff); 
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const baseGlassStyle = "bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.12)] backdrop-blur-[16px] shadow-[0_4px_24px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_8px_32px_rgba(59,130,246,0.10),inset_0_1px_0_rgba(255,255,255,0.07)]";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`${baseGlassStyle} rounded-3xl overflow-hidden`}
    >
      {/* HERO HEADER BANNER */}
      <div 
        className="border-b border-[rgba(59,130,246,0.15)] p-8 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(29,78,216,0.30) 0%, rgba(15,23,42,0.95) 60%, rgba(10,16,40,1) 100%)' }}
      >
        {/* Background decorative elements */}
        <div className="absolute top-[-40px] right-[-40px] w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-[-20px] left-[20%] w-48 h-48 bg-blue-700/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          
          <div className="flex items-center space-x-6">
            {/* Profile Avatar */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
              className="relative"
            >
              <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-[3px] border-[rgba(59,130,246,0.30)] shadow-[0_0_0_4px_rgba(59,130,246,0.10),0_0_30px_rgba(59,130,246,0.20)] flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800">
                {existingPhotoUrl ? (
                  <img src={existingPhotoUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl text-white font-bold">{user?.name?.charAt(0).toUpperCase() || 'P'}</span>
                )}
              </div>
              {isEmergencyReady && (
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-[#060d1a] shadow-[0_0_12px_rgba(52,211,153,0.60)]" title="Emergency Ready">
                  <ShieldAlert className="w-4 h-4" />
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}
              className="space-y-1"
            >
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{user?.name || 'Patient User'}</h1>
              <p className="text-blue-400 font-medium text-sm">{user?.email || 'patient@example.com'}</p>
              
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                className="flex flex-wrap items-center gap-3 pt-3"
              >
                <span className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.10)] text-slate-200 text-sm px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                  {calculateAge(formData.dob)} Years
                </span>
                <span className="bg-[rgba(255,255,255,0.07)] border border-[rgba(255,255,255,0.10)] text-slate-200 text-sm px-3 py-1 rounded-full font-medium backdrop-blur-sm">
                  {formData.gender || 'N/A'}
                </span>
                {formData.bloodGroup && (
                  <span className="bg-[rgba(251,113,133,0.15)] border border-[rgba(251,113,133,0.25)] text-rose-300 font-bold px-3 py-1 rounded-full shadow-[0_0_10px_rgba(251,113,133,0.15)] flex items-center">
                    <Droplet className="w-3 h-3 mr-1 text-rose-400" />
                    {formData.bloodGroup}
                  </span>
                )}
              </motion.div>
            </motion.div>
          </div>

          {/* Profile Completion */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.25 }}
            className="bg-[rgba(255,255,255,0.04)] border border-[rgba(59,130,246,0.15)] backdrop-blur-lg p-5 rounded-2xl w-full md:w-64"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-slate-300 font-semibold text-sm">Profile Completion</span>
              <span className="text-blue-400 font-bold text-sm">{progress}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${progress === 100 ? 'bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.60)]' : 'bg-gradient-to-r from-blue-600 to-blue-400 shadow-[0_0_8px_rgba(59,130,246,0.40)]'}`} 
                style={{ width: `${progress}%` }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* DETAILS GRID */}
      <div className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Contact & Address Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 * 0.08 }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-500/70 mb-3 flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-blue-500/70" />
              Contact & Address
            </h3>
            <div className={`${baseGlassStyle} bg-[rgba(59,130,246,0.04)] border-[rgba(59,130,246,0.10)] p-4 rounded-xl space-y-3`}>
              <div>
                <p className="text-slate-500 text-xs font-medium">Mobile Number</p>
                <p className="text-slate-200 font-semibold text-sm">{formData.mobile || 'Not provided'}</p>
              </div>
              <div className="pt-2 border-t border-white/5">
                <p className="text-slate-500 text-xs font-medium">Full Address</p>
                <p className="text-slate-200 font-semibold text-sm leading-snug mt-0.5">
                  {formData.addressLine ? (
                    <>{formData.addressLine}<br/>{formData.city}, {formData.state} {formData.pincode}</>
                  ) : 'Not provided'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Vitals & Lifestyle Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 2 * 0.08 }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-500/70 mb-3 flex items-center gap-2">
              <Ruler className="w-3.5 h-3.5 text-blue-500/70" />
              Vitals & Lifestyle
            </h3>
            <div className={`${baseGlassStyle} bg-[rgba(59,130,246,0.04)] border-[rgba(59,130,246,0.10)] p-4 rounded-xl grid grid-cols-2 gap-4`}>
              <div>
                <p className="text-slate-500 text-xs font-medium">Height</p>
                <p className="text-slate-200 font-semibold text-sm mt-0.5">
                  {formData.height ? <>{formData.height} <span className="text-blue-400 text-[10px] ml-1">cm</span></> : '--'}
                </p>
              </div>
              <div>
                <p className="text-slate-500 text-xs font-medium">Weight</p>
                <p className="text-slate-200 font-semibold text-sm mt-0.5">
                  {formData.weight ? <>{formData.weight} <span className="text-blue-400 text-[10px] ml-1">kg</span></> : '--'}
                </p>
              </div>
              <div className="col-span-2 pt-2 border-t border-white/5">
                <p className="text-slate-500 text-xs font-medium">Habits</p>
                <p className="text-slate-200 font-semibold text-sm mt-0.5">
                  Smoking: {formData.smoker} / Alcohol: {formData.alcohol}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Emergency Contact Card */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 3 * 0.08 }}>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.18em] text-blue-500/70 mb-3 flex items-center gap-2">
              <ShieldAlert className="w-3.5 h-3.5 text-blue-500/70" />
              Emergency Contact
            </h3>
            <div className="bg-[rgba(251,113,133,0.04)] border border-[rgba(251,113,133,0.12)] hover:border-[rgba(251,113,133,0.25)] transition-all duration-300 p-4 rounded-xl space-y-3 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <div>
                <p className="text-rose-500/70 text-xs font-medium">Contact Name</p>
                <p className="text-rose-200 font-semibold text-sm mt-0.5">{formData.emergencyName || 'Not provided'} {formData.emergencyRelation && <span className="text-rose-300 text-xs">({formData.emergencyRelation})</span>}</p>
              </div>
              <div className="pt-2 border-t border-rose-500/10">
                <p className="text-rose-500/70 text-xs font-medium">Emergency Mobile</p>
                <p className="text-rose-200 font-semibold text-sm mt-0.5">{formData.emergencyMobile || 'Not provided'}</p>
              </div>
            </div>
          </motion.div>

        </div>

        {/* ALLERGIES & CONDITIONS ROW */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 4 * 0.08 }}>
            <div className="bg-[rgba(251,191,36,0.04)] border border-[rgba(251,191,36,0.12)] hover:border-[rgba(251,191,36,0.25)] transition-all duration-300 p-5 rounded-xl flex items-start space-x-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <div className="bg-amber-500/10 p-2.5 rounded-xl shadow-[0_0_12px_rgba(251,191,36,0.15)] flex-shrink-0">
                <AlertCircle className="text-amber-400 w-5 h-5" />
              </div>
              <div className="pt-0.5">
                <h4 className="text-amber-300 font-bold text-sm">Allergies</h4>
                <p className="text-amber-200/70 text-sm mt-1">{formData.allergies || 'No known allergies'}</p>
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 5 * 0.08 }}>
            <div className="bg-[rgba(167,139,250,0.04)] border border-[rgba(167,139,250,0.12)] hover:border-[rgba(167,139,250,0.25)] transition-all duration-300 p-5 rounded-xl flex items-start space-x-4 shadow-[0_4px_24px_rgba(0,0,0,0.2)]">
              <div className="bg-purple-500/10 p-2.5 rounded-xl shadow-[0_0_12px_rgba(167,139,250,0.15)] flex-shrink-0">
                <Activity className="text-purple-400 w-5 h-5" />
              </div>
              <div className="pt-0.5">
                <h4 className="text-purple-300 font-bold text-sm">Existing Diseases / Conditions</h4>
                <p className="text-purple-200/70 text-sm mt-1">{formData.diseases || 'No known existing conditions'}</p>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
};

export default ProfileViewCard;
