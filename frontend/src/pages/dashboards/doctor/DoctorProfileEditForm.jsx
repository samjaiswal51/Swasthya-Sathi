import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Save, X, Camera, FileText, CheckCircle } from 'lucide-react';

const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 pl-1">{label}</label>
    {children}
  </div>
);

const inputCls = 'w-full px-4 py-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white focus:bg-white focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 outline-none text-slate-800 font-medium transition-all shadow-sm';

const DocUploadRow = ({ label, fieldName, current, file, onChange }) => (
  <div className="p-5 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-white hover:border-emerald-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
    <div className="flex items-center gap-4 min-w-0">
      <div className={`p-3 rounded-xl ${file || current ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
        <FileText className="w-5 h-5 flex-shrink-0" />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-extrabold text-slate-800">{label}</p>
        {file
          ? <p className="text-xs font-bold text-emerald-600 truncate mt-0.5">{file.name} (Ready to save)</p>
          : current
            ? <a href={current} target="_blank" rel="noreferrer" className="text-xs font-semibold text-teal-600 hover:text-teal-700 hover:underline truncate block mt-0.5">View current document ↗</a>
            : <p className="text-xs font-medium text-slate-400 mt-0.5">Not uploaded yet</p>
        }
      </div>
    </div>
    <label className="flex-shrink-0 w-full sm:w-auto text-center cursor-pointer px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-extrabold hover:border-emerald-300 hover:text-emerald-700 shadow-sm transition-all hover:scale-105">
      {file || current ? 'Replace File' : 'Upload File'}
      <input type="file" name={fieldName} className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={onChange} />
    </label>
  </div>
);

const DoctorProfileEditForm = ({ profile, onSave, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(profile.profilePhoto || '');
  const [newFiles, setNewFiles] = useState({ profilePhoto: null, degreeCertificate: null, licenseCertificate: null, idProof: null });

  const [form, setForm] = useState({
    fullName:           profile.fullName || '',
    mobile:             profile.mobile || '',
    gender:             profile.gender || '',
    dob:                profile.dob ? profile.dob.split('T')[0] : '',
    registrationNumber: profile.registrationNumber || '',
    degree:             profile.degree || '',
    specialization:     profile.specialization || '',
    experienceYears:    profile.experienceYears || '',
    hospitalName:       profile.hospitalName || '',
    consultationFee:    profile.consultationFee || '',
    languages:          profile.languages || [],
    bio:                profile.bio || '',
    consultationMode:   profile.consultationMode || 'Both',
    clinicAddress:      profile.clinicAddress || '',
    city:               profile.city || '',
    state:              profile.state || '',
    pincode:            profile.pincode || '',
    days:               profile.availability?.days || [],
    morningStart:       profile.availability?.morningStart || '',
    morningEnd:         profile.availability?.morningEnd || '',
    eveningStart:       profile.availability?.eveningStart || '',
    eveningEnd:         profile.availability?.eveningEnd || '',
  });

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }));
  const toggle = (key, val) => setForm(prev => {
    const arr = prev[key] || [];
    return { ...prev, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
  });

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { toast.error('Max file size is 10MB'); return; }
    setNewFiles(prev => ({ ...prev, [name]: file }));
    if (name === 'profilePhoto') {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.fullName || !form.registrationNumber || !form.degree || !form.specialization) {
      toast.error('Please fill all required fields');
      return;
    }
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (Array.isArray(v)) data.append(k, JSON.stringify(v));
        else data.append(k, v);
      });
      Object.entries(newFiles).forEach(([k, f]) => { if (f) data.append(k, f); });

      const token = localStorage.getItem('token');
      const res = await axios.put('http://localhost:5000/api/doctor/profile', data, {
        headers: { 
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      toast.success('Profile updated successfully! ✅');
      onSave(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const LANGS = ['English', 'Hindi', 'Bengali', 'Marathi', 'Tamil', 'Telugu', 'Gujarati'];
  const SPECS = ['General Physician','Cardiologist','Dermatologist','Orthopedic','ENT','Gynecologist','Neurologist','Dentist','Pediatrician','Psychiatrist','Other'];

  const Card = ({ title, children }) => (
    <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-[0_8px_30px_rgba(0,0,0,0.04)] p-6 sm:p-8 hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)] transition-all duration-300">
      <h3 className="text-xs font-extrabold text-emerald-600 uppercase tracking-widest mb-6">{title}</h3>
      {children}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-12">
      
      {/* Sticky Header */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-2xl border-b border-slate-200/60 px-6 py-4 -mx-4 sm:mx-0 sm:rounded-2xl sm:border mb-8 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Profile Studio</h2>
          <p className="text-sm font-semibold text-slate-500">Update your verified identity</p>
        </div>
        <div className="flex gap-2">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} type="button" onClick={onCancel} 
            className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors">
            <X className="w-5 h-5" />
          </motion.button>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            className="hidden sm:flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-[0_4px_12px_rgba(16,185,129,0.3)] hover:shadow-[0_8px_20px_rgba(16,185,129,0.4)] transition-all disabled:opacity-50">
            {loading ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
            Save
          </motion.button>
        </div>
      </div>

      {/* Photo */}
      <Card title="Identity Photo">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-[1.5rem] overflow-hidden bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center group-hover:border-emerald-400 transition-all z-10 relative shadow-inner">
              {photoPreview ? <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" /> : <Camera className="w-8 h-8 text-emerald-300" />}
            </div>
            <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 hover:bg-emerald-600 transition-all z-20">
              <Camera className="w-4 h-4" />
              <input type="file" name="profilePhoto" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          </div>
          <div>
            <h4 className="font-bold text-slate-800">Professional Headshot</h4>
            <p className="text-xs font-semibold text-slate-500 mt-1 max-w-xs leading-relaxed">
              Upload a clear, front-facing photo. This will be visible to patients when they book appointments.
            </p>
          </div>
        </div>
      </Card>

      {/* Basic Details */}
      <Card title="Basic Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Full Name *"><input className={inputCls} value={form.fullName} onChange={e => set('fullName', e.target.value)} required /></Field>
          <Field label="Mobile Number"><input className={inputCls} value={form.mobile} onChange={e => set('mobile', e.target.value)} /></Field>
          <Field label="Gender">
            <select className={inputCls} value={form.gender} onChange={e => set('gender', e.target.value)}>
              <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
            </select>
          </Field>
          <Field label="Date of Birth"><input type="date" className={inputCls} value={form.dob} onChange={e => set('dob', e.target.value)} /></Field>
        </div>
      </Card>

      {/* Professional Details */}
      <Card title="Professional Overview">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Field label="Registration Number *"><input className={inputCls} value={form.registrationNumber} onChange={e => set('registrationNumber', e.target.value)} required /></Field>
          <Field label="Degree *"><input className={inputCls} value={form.degree} onChange={e => set('degree', e.target.value)} required /></Field>
          <Field label="Specialization *">
            <select className={inputCls} value={form.specialization} onChange={e => set('specialization', e.target.value)} required>
              <option value="">Select</option>{SPECS.map(s => <option key={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Years of Experience"><input type="number" className={inputCls} value={form.experienceYears} onChange={e => set('experienceYears', e.target.value)} /></Field>
          <Field label="Hospital / Clinic Name"><input className={inputCls} value={form.hospitalName} onChange={e => set('hospitalName', e.target.value)} /></Field>
          <Field label="Consultation Fee (₹)"><input type="number" className={inputCls} value={form.consultationFee} onChange={e => set('consultationFee', e.target.value)} /></Field>
          
          <div className="sm:col-span-2">
            <Field label="Languages Spoken">
              <div className="flex flex-wrap gap-2 mt-2">
                {LANGS.map(l => (
                  <button type="button" key={l} onClick={() => toggle('languages', l)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      form.languages.includes(l) ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}>
                    {l}
                  </button>
                ))}
              </div>
            </Field>
          </div>
          <div className="sm:col-span-2">
            <Field label="About / Bio">
              <textarea rows={4} className={inputCls} value={form.bio} onChange={e => set('bio', e.target.value)} placeholder="Brief description of your expertise..." />
            </Field>
          </div>
        </div>
      </Card>



      {/* Address */}
      <Card title="Clinic Address">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="sm:col-span-2">
            <Field label="Street Address"><input className={inputCls} value={form.clinicAddress} onChange={e => set('clinicAddress', e.target.value)} /></Field>
          </div>
          <Field label="City"><input className={inputCls} value={form.city} onChange={e => set('city', e.target.value)} /></Field>
          <Field label="State"><input className={inputCls} value={form.state} onChange={e => set('state', e.target.value)} /></Field>
          <Field label="PIN Code"><input className={inputCls} value={form.pincode} onChange={e => set('pincode', e.target.value)} /></Field>
        </div>
      </Card>

      {/* Documents */}
      <Card title="Verification Documents">
        <div className="space-y-4">
          <DocUploadRow label="Medical Degree Certificate" fieldName="degreeCertificate" current={profile.documents?.degreeCertificate} file={newFiles.degreeCertificate} onChange={handleFileChange} />
          <DocUploadRow label="Medical License Certificate" fieldName="licenseCertificate" current={profile.documents?.licenseCertificate} file={newFiles.licenseCertificate} onChange={handleFileChange} />
          <DocUploadRow label="ID Proof (Aadhar/PAN)" fieldName="idProof" current={profile.documents?.idProof} file={newFiles.idProof} onChange={handleFileChange} />
        </div>
      </Card>

      {/* Floating Mobile Submit CTA */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-xl border-t border-slate-200 z-50">
        <motion.button whileTap={{ scale: 0.95 }} type="submit" disabled={loading}
          className="w-full flex justify-center items-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold shadow-lg disabled:opacity-50">
          {loading ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>
    </form>
  );
};

export default DoctorProfileEditForm;
