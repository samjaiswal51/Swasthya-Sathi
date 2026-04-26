import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, ChevronDown, Stethoscope } from 'lucide-react';
import DoctorCard from '../../../components/doctor/DoctorCard';
import PatientDoctorProfile from './PatientDoctorProfile';
import toast from 'react-hot-toast';

// ── Symptom → Specialization mapping ─────────────────
const SYMPTOM_MAP = [
  { keywords: ['chest','heart','cardiac','palpitation','blood pressure','hypertension'], spec: 'Cardiologist' },
  { keywords: ['skin','rash','acne','itch','eczema','psoriasis','allergy'], spec: 'Dermatologist' },
  { keywords: ['tooth','dental','gum','jaw','cavity'], spec: 'Dentist' },
  { keywords: ['ear','nose','throat','ent','sinus','tonsil'], spec: 'ENT' },
  { keywords: ['bone','joint','fracture','knee','back pain','spine','orthopedic'], spec: 'Orthopedic' },
  { keywords: ['child','baby','infant','pediatric','vaccination'], spec: 'Pediatrician' },
  { keywords: ['brain','neuro','headache','migraine','seizure','stroke'], spec: 'Neurologist' },
  { keywords: ['women','pregnancy','period','gynae','uterus','ovary'], spec: 'Gynecologist' },
  { keywords: ['diabetes','thyroid','hormone','endocrine'], spec: 'General Physician' },
  { keywords: ['breathing','lung','respiratory','asthma','cough','tb'], spec: 'General Physician' },
  { keywords: ['fever','cold','flu','weakness','fatigue','general'], spec: 'General Physician' },
];

const SPECIALIZATIONS = [
  'All','General Physician','Cardiologist','Dermatologist','Orthopedic',
  'ENT','Dentist','Gynecologist','Neurologist','Pediatrician','Other',
];
const MODES   = ['All','Online','Offline','Both'];
const EXP     = [{ label: 'Any', val: '' },{ label: '1+ Years', val: '1' },{ label: '5+ Years', val: '5' },{ label: '10+ Years', val: '10' }];
const SORT    = [{ label: 'Newest', val: 'newest' },{ label: 'Most Experienced', val: 'experience' },{ label: 'Fee: Low→High', val: 'fee_asc' },{ label: 'Fee: High→Low', val: 'fee_desc' }];

// ── Skeleton card ────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white/[0.04] border border-white/8 rounded-3xl overflow-hidden animate-pulse">
    <div className="h-1 bg-gradient-to-r from-blue-600/40 to-cyan-500/40" />
    <div className="p-5 space-y-4">
      <div className="flex gap-4">
        <div className="w-[72px] h-[72px] rounded-2xl bg-white/8 flex-shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-4 bg-white/8 rounded-lg w-3/4" />
          <div className="h-3 bg-white/6 rounded-lg w-1/2" />
          <div className="h-3 bg-white/5 rounded-lg w-1/3" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-white/6 rounded-lg" />
        <div className="h-3 bg-white/5 rounded-lg w-2/3" />
      </div>
      <div className="h-9 bg-white/6 rounded-2xl" />
    </div>
  </div>
);

// ── Suggestion chip ───────────────────────────────────
const SuggestionChip = ({ spec, onClick }) => (
  <motion.button
    initial={{ opacity: 0, scale: 0.85 }}
    animate={{ opacity: 1, scale: 1 }}
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={() => onClick(spec)}
    className="px-4 py-1.5 rounded-full text-sm font-semibold border
               bg-blue-500/20 text-blue-300 border-blue-500/30
               hover:bg-blue-500/35 hover:border-blue-400/50
               hover:shadow-[0_0_14px_rgba(37,99,235,0.35)]
               transition-all duration-200 backdrop-blur-sm"
  >
    🔍 {spec}
  </motion.button>
);

// ── Filter pill ───────────────────────────────────────
const FilterPill = ({ label, options, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const current = options.find(o => (o.val ?? o) === value);
  const display = current?.label ?? current ?? value;
  const isActive = value && value !== 'All' && value !== '';

  return (
    <div className="relative" ref={ref}>
      <motion.button
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen(!open)}
        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition-all duration-200 ${
          isActive
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white border-transparent shadow-[0_4px_14px_rgba(37,99,235,0.4)]'
            : 'bg-white/5 text-slate-300 border-white/10 hover:border-blue-500/35 hover:bg-blue-500/10 hover:text-blue-300 backdrop-blur-sm'
        }`}
      >
        {display} <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full mt-2 left-0 bg-[#0D1B35]/95 backdrop-blur-2xl
                       border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)]
                       z-20 min-w-[160px] py-2 overflow-hidden"
          >
            {options.map(o => {
              const v = o.val ?? o; const l = o.label ?? o;
              return (
                <button key={v} onClick={() => { onChange(v); setOpen(false); }}
                  className={`w-full text-left px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
                    v === value
                      ? 'bg-blue-600/20 text-blue-300 font-semibold'
                      : 'hover:bg-white/5 text-slate-400 hover:text-slate-200'
                  }`}>
                  {l}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ── Main Component ────────────────────────────────────
const FindDoctor = () => {
  const [doctors, setDoctors]         = useState([]);
  const [loading, setLoading]         = useState(true);
  const [search, setSearch]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [filters, setFilters]         = useState({ specialization: 'All', mode: 'All', minExp: '', sort: 'newest' });
  const [favorites, setFavorites]     = useState([]);
  const [connections, setConnections] = useState([]);
  const [following, setFollowing]     = useState([]); // track followed doctor IDs
  const [selectedDoctor, setSelected] = useState(null);
  const debounceRef = useRef(null);
  const navigate = useNavigate();

  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavs = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/patient/profile/favorites', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setFavorites(res.data.map(d => d._id || d)); // map to IDs
      } catch (err) {
        console.error('Failed to fetch favorites', err);
      }
    };
    const fetchConnections = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/connections/my-doctors', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        setConnections(res.data);
      } catch (err) {
        console.error('Failed to fetch connections', err);
      }
    };
    const fetchFollowing = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/social/following', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFollowing(res.data.map(id => id.toString()));
      } catch (err) {
        console.error('Failed to fetch following', err);
      }
    };
    fetchFavs();
    fetchConnections();
    fetchFollowing();
  }, []);

  // Symptom suggestion logic
  const getSuggestions = (text) => {
    if (!text || text.length < 3) return [];
    const low = text.toLowerCase();
    const found = SYMPTOM_MAP.filter(m => m.keywords.some(k => low.includes(k))).map(m => m.spec);
    return [...new Set(found)];
  };

  const fetchDoctors = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (params.search)         q.set('search', params.search);
      if (params.specialization && params.specialization !== 'All') q.set('specialization', params.specialization);
      if (params.mode && params.mode !== 'All') q.set('mode', params.mode);
      if (params.minExp)         q.set('minExp', params.minExp);
      if (params.sort)           q.set('sort', params.sort);
      const res = await axios.get(`http://localhost:5000/api/doctor/list?${q.toString()}`);
      setDoctors(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setSuggestions(getSuggestions(search));
      fetchDoctors({ search, ...filters });
    }, 400);
  }, [search, filters, fetchDoctors]);

  const setFilter = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));
  const clearFilters = () => { setFilters({ specialization: 'All', mode: 'All', minExp: '', sort: 'newest' }); setSearch(''); };
  const hasActiveFilters = filters.specialization !== 'All' || filters.mode !== 'All' || filters.minExp !== '' || search;

  const toggleFavorite = async (id) => {
    try {
      const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
      setFavorites(updated); // optimistic update
      await axios.post(`http://localhost:5000/api/patient/profile/favorite-doctor/${id}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error('Failed to toggle favorite', err);
      // Revert optimistic update
      setFavorites(favorites);
    }
  };

  const handleChatNow = async (doctor) => {
    try {
      const doctorUserId = doctor.user?._id || doctor.user;
      await axios.post('http://localhost:5000/api/chat/conversations', {
        participantId: doctorUserId,
      });
      navigate('/patient-dashboard/chat', { state: { openChatWith: doctorUserId } });
    } catch (err) {
      console.error('Chat error:', err);
    }
  };

  const handleConnect = async (doctor) => {
    try {
      const doctorUserId = doctor.user?._id || doctor.user;
      await axios.post('http://localhost:5000/api/connections/request', { targetUserId: doctorUserId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert('Connection request sent! The doctor must approve it before you can chat.');
      
      // Optimistically update connections
      setConnections([...connections, { doctorId: doctorUserId, relationStatus: 'pending', initiatedBy: 'patient' }]);
    } catch (err) {
      console.error('Connection error:', err);
      alert(err.response?.data?.message || 'Failed to send connection request');
    }
  };

  const applySuggestion = (spec) => {
    setFilter('specialization', spec);
    setSearch('');
    setSuggestions([]);
  };

  const handleFollow = async (doctor) => {
    const docUserId = doctor.user?._id || doctor.user;
    const isFollowing = following.includes(docUserId.toString());

    // Optimistic update
    if (isFollowing) {
      setFollowing(prev => prev.filter(id => id !== docUserId.toString()));
    } else {
      setFollowing(prev => [...prev, docUserId.toString()]);
    }

    try {
      const token = localStorage.getItem('token');
      if (isFollowing) {
        await axios.delete(`http://localhost:5000/api/social/follow/${docUserId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(`Unfollowed Dr. ${doctor.fullName}`);
      } else {
        await axios.post(`http://localhost:5000/api/social/follow/${docUserId}`, {}, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success(`You are now following Dr. ${doctor.fullName}`);
      }
    } catch (err) {
      // Revert optimistic update
      if (isFollowing) {
        setFollowing(prev => [...prev, docUserId.toString()]);
      } else {
        setFollowing(prev => prev.filter(id => id !== docUserId.toString()));
      }
      toast.error(err.response?.data?.message || 'Failed to update follow status');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-6 relative"
    >
      {/* Ambient background orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full blur-3xl bg-blue-600/8 pointer-events-none" />
      <div className="absolute top-1/2 -left-20 w-56 h-56 rounded-full blur-3xl bg-cyan-500/6 pointer-events-none" />

      {/* ── Header Hero ──────────────────────────────── */}
      <div className="relative overflow-hidden rounded-3xl">
        {/* Layered gradient bg */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-blue-900 to-[#1e3a6e]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.35)_0%,transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(6,182,212,0.25)_0%,transparent_55%)]" />

        {/* Floating light blobs */}
        <motion.div
          animate={{ scale: [1, 1.15, 1], opacity: [0.15, 0.25, 0.15] }}
          transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-blue-500/20 blur-3xl pointer-events-none"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ repeat: Infinity, duration: 7, ease: 'easeInOut', delay: 1 }}
          className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none"
        />

        <div className="relative p-6 sm:p-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/10 border border-white/15 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <Stethoscope className="w-5 h-5 text-blue-300" />
              </div>
              <span className="text-blue-300 text-sm font-semibold tracking-wide uppercase">Doctor Discovery</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2">
              Find Trusted <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-300">Doctors</span>
            </h1>
            <p className="text-blue-200/80 text-sm sm:text-base max-w-lg">
              Connect with verified specialists for smarter, more personalised healthcare.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 w-5 h-5" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, specialization, symptom..."
              className="w-full pl-12 pr-12 py-4 rounded-2xl
                         bg-white/10 backdrop-blur-xl border border-white/15
                         text-white placeholder-white/40 font-medium
                         focus:outline-none focus:ring-2 focus:ring-blue-400/60
                         focus:border-blue-400/50 focus:bg-white/15
                         focus:shadow-[0_0_30px_rgba(37,99,235,0.3)]
                         transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
            />
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={() => { setSearch(''); setSuggestions([]); }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
              >
                <X className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>

          {/* Symptom suggestions */}
          <AnimatePresence>
            {suggestions.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 flex flex-wrap gap-2 items-center"
              >
                <span className="text-blue-300/70 text-xs font-medium">Suggested:</span>
                {suggestions.map(s => <SuggestionChip key={s} spec={s} onClick={applySuggestion} />)}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* ── Filters row ──────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="flex flex-wrap items-center gap-2 bg-white/[0.03] backdrop-blur-xl
                   border border-white/8 rounded-2xl px-4 py-3
                   shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
      >
        <SlidersHorizontal className="w-4 h-4 text-blue-400 flex-shrink-0" />
        <FilterPill label="Specialization" options={SPECIALIZATIONS} value={filters.specialization} onChange={v => setFilter('specialization', v)} />
        <FilterPill label="Mode"           options={MODES}          value={filters.mode}           onChange={v => setFilter('mode', v)} />
        <FilterPill label="Experience"     options={EXP}            value={filters.minExp}         onChange={v => setFilter('minExp', v)} />
        <FilterPill label="Sort by"        options={SORT}           value={filters.sort}           onChange={v => setFilter('sort', v)} />
        {hasActiveFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={clearFilters}
            className="flex items-center gap-1 px-4 py-2 rounded-full text-sm text-rose-400 font-semibold
                       bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all duration-200"
          >
            <X className="w-3.5 h-3.5" /> Clear
          </motion.button>
        )}
        <div className="ml-auto">
          <span className="text-sm font-semibold px-3 py-1 rounded-full
                           bg-blue-500/15 border border-blue-500/20 text-blue-300">
            {loading ? '...' : `${doctors.length} Doctor${doctors.length !== 1 ? 's' : ''} Found`}
          </span>
        </div>
      </motion.div>

      {/* ── Doctor Grid ───────────────────────────────── */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
          {Array(6).fill(0).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : doctors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-3xl
                     shadow-[0_10px_40px_rgba(37,99,235,0.06)]"
        >
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            className="w-20 h-20 mx-auto mb-5 rounded-2xl
                       bg-blue-500/10 border border-blue-500/20
                       shadow-[0_0_30px_rgba(37,99,235,0.15)]
                       flex items-center justify-center text-4xl"
          >
            🩺
          </motion.div>
          <h3 className="text-xl font-extrabold text-slate-100 mb-1">No doctors found</h3>
          <p className="text-slate-400 text-sm mt-1 max-w-xs mx-auto">Try different keywords or reset your filters.</p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={clearFilters}
            className="mt-5 px-6 py-2.5 rounded-xl font-bold text-sm text-white
                       bg-gradient-to-r from-blue-600 to-cyan-500
                       shadow-[0_4px_14px_rgba(37,99,235,0.4)]
                       hover:shadow-[0_0_24px_rgba(37,99,235,0.55)]
                       transition-all duration-300"
          >
            Reset Filters
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
            hidden: {}
          }}
        >
          {doctors.map((doc, i) => {
            const docUserId = doc.user?._id || doc.user;
            const connection = connections.find(c => c.doctorId === docUserId);
            const status = connection ? connection.relationStatus : null;
            const isFollowed = following.includes(docUserId?.toString());

            return (
              <motion.div
                key={doc._id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } }
                }}
              >
                <DoctorCard
                  doctor={doc}
                  onView={setSelected}
                  onChat={handleChatNow}
                  onConnect={handleConnect}
                  onFavorite={toggleFavorite}
                  onFollow={handleFollow}
                  isFavorite={favorites.includes(doc._id)}
                  isFollowing={isFollowed}
                  connectionStatus={status}
                />
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {/* ── Profile Modal ─────────────────────────────── */}
      {selectedDoctor && (
        <PatientDoctorProfile
          doctor={selectedDoctor}
          isFavorite={favorites.includes(selectedDoctor._id)}
          onFavorite={toggleFavorite}
          onClose={() => setSelected(null)}
        />
      )}
    </motion.div>
  );
};

export default FindDoctor;
