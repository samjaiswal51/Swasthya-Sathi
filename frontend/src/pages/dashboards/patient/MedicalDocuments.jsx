import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Search, Filter, FolderOpen, Heart, Pin, Loader2, Activity, ShieldPlus, Stethoscope, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadDocumentModal from '../../../components/dashboard/UploadDocumentModal';
import DocumentCard from '../../../components/dashboard/DocumentCard';
import { motion, AnimatePresence } from 'framer-motion';

const MedicalDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const [clinicalNotes, setClinicalNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('uploads'); // 'uploads' | 'updates'
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [showPinnedOnly, setShowPinnedOnly] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [docsRes, notesRes] = await Promise.all([
        axios.get('http://localhost:5000/api/patient/documents'),
        axios.get('http://localhost:5000/api/update-requests/patient/clinical-notes')
      ]);
      setDocuments(docsRes.data);
      setClinicalNotes(notesRes.data);
    } catch (error) {
      toast.error('Failed to load medical records');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this record? This cannot be undone.")) return;
    
    try {
      await axios.delete(`http://localhost:5000/api/patient/documents/${id}`);
      setDocuments(prev => prev.filter(doc => doc._id !== id));
      toast.success('Document deleted successfully');
    } catch (error) {
      toast.error('Failed to delete document');
      console.error(error);
    }
  };

  const handleTogglePin = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/patient/documents/${id}`, { isPinned: newStatus });
      setDocuments(prev => prev.map(doc => doc._id === id ? res.data : doc));
    } catch (error) {
      toast.error('Failed to pin document');
    }
  };

  const handleToggleFavorite = async (id, newStatus) => {
    try {
      const res = await axios.put(`http://localhost:5000/api/patient/documents/${id}`, { isFavorite: newStatus });
      setDocuments(prev => prev.map(doc => doc._id === id ? res.data : doc));
    } catch (error) {
      toast.error('Failed to favorite document');
    }
  };

  // Filter Logic
  const filteredDocuments = documents.filter(doc => {
    if (showFavoritesOnly && !doc.isFavorite) return false;
    if (showPinnedOnly && !doc.isPinned) return false;
    if (filterType !== 'All' && doc.type !== filterType) return false;
    
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      return (
        doc.title.toLowerCase().includes(lowerSearch) ||
        (doc.doctorName && doc.doctorName.toLowerCase().includes(lowerSearch)) ||
        (doc.hospitalName && doc.hospitalName.toLowerCase().includes(lowerSearch)) ||
        (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(lowerSearch)))
      );
    }
    return true;
  });

  // Calculate stats
  const totalRecords = documents.length;
  const labReports = documents.filter(d => d.type === 'Lab Report').length;
  const prescriptions = documents.filter(d => d.type === 'Prescription').length;
  const doctorUpdates = clinicalNotes.length;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-20 h-20 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute" />
          <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-500 absolute" />
        </div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-slate-400 font-medium text-sm mt-6 tracking-wide">
          Loading medical records...
        </motion.p>
      </div>
    );
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4 } }
  };

  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, x: 20, transition: { duration: 0.2 } }
  };

  const glassStyle = "bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl";
  const hoverGlass = "hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto space-y-6 pb-24 p-6 sm:p-8 relative"
    >
      <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl bg-[rgba(37,99,235,0.12)] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full blur-3xl bg-[rgba(6,182,212,0.08)] pointer-events-none" />
      <style>{`
        .shimmer-hover {
          position: relative;
          overflow: hidden;
        }
        .shimmer-hover::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: -100%;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, rgba(59,130,246,0.35), rgba(6,182,212,0.25), transparent);
          transition: 0.4s ease-in-out;
        }
        .shimmer-hover:hover::after {
          left: 100%;
        }
      `}</style>

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 relative z-10">
        <motion.div initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay:0.1, duration:0.5 }}>
          <h1 className="text-slate-100 font-extrabold text-3xl tracking-tight border-l-[3px] border-l-[#2563EB] pl-4">
            Medical Records
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5 ml-5">Securely store and manage your health documents.</p>
        </motion.div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsUploadModalOpen(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_0_28px_rgba(37,99,235,0.50)] transition-all duration-300"
        >
          <Plus className="w-5 h-5" />
          <span>Upload New Record</span>
        </motion.button>
      </div>

      {/* SUMMARY STAT CARDS */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 relative z-10"
      >
        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} className={`${glassStyle} ${hoverGlass} p-5 flex items-center space-x-4 shimmer-hover`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <FolderOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Records</p>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-0.5" style={{ textShadow: '0 0 12px rgba(37,99,235,0.4)' }}>{totalRecords}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} className={`${glassStyle} ${hoverGlass} p-5 flex items-center space-x-4 shimmer-hover`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Activity className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Lab Reports</p>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-0.5" style={{ textShadow: '0 0 12px rgba(37,99,235,0.4)' }}>{labReports}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} className={`${glassStyle} ${hoverGlass} p-5 flex items-center space-x-4 shimmer-hover`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <ShieldPlus className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Prescriptions</p>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-0.5" style={{ textShadow: '0 0 12px rgba(37,99,235,0.4)' }}>{prescriptions}</h3>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ scale: 1.03 }} className={`${glassStyle} ${hoverGlass} p-5 flex items-center space-x-4 shimmer-hover`}>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-900 shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Stethoscope className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Doctor Updates</p>
            <h3 className="text-3xl font-extrabold text-slate-100 mt-0.5" style={{ textShadow: '0 0 12px rgba(37,99,235,0.4)' }}>{doctorUpdates}</h3>
          </div>
        </motion.div>
      </motion.div>

      {/* TAB BAR */}
      <div className={`${glassStyle} p-1.5 rounded-full inline-flex gap-2 mb-2 relative z-10`}>
        {['uploads', 'updates'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative px-6 py-2.5 rounded-full font-bold text-sm transition-colors z-10 ${
              activeTab === tab ? 'text-white' : 'text-slate-400 hover:text-blue-400 transition-colors'
            }`}
          >
            {activeTab === tab && (
              <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-full shadow-[0_0_12px_rgba(37,99,235,0.4)] -z-10"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
            {tab === 'uploads' ? 'My Uploads' : 'Doctor Updates'}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'uploads' && (
          <motion.div 
            key="uploads"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            {/* FILTER BAR */}
            <div className={`${glassStyle} ${hoverGlass} p-4 flex flex-col lg:flex-row gap-4 items-center justify-between relative z-10`}>
              <div className="flex-1 w-full relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400" />
                <input 
                  type="text" 
                  placeholder="Search by title, doctor, hospital, or tags..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-slate-100 placeholder:text-slate-500 font-medium transition-all duration-300"
                />
              </div>
              <div className="flex items-center space-x-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
                <select 
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.15)] text-slate-300 py-3 px-4 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-semibold appearance-none cursor-pointer min-w-[150px]"
                  style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%233b82f6' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: `right 0.5rem center`, backgroundRepeat: `no-repeat`, backgroundSize: `1.5em 1.5em` }}
                >
                  <option value="All" className="bg-[#0b1526]">All Types</option>
                  <option value="Prescription" className="bg-[#0b1526]">Prescriptions</option>
                  <option value="Lab Report" className="bg-[#0b1526]">Lab Reports</option>
                  <option value="X-Ray" className="bg-[#0b1526]">X-Ray</option>
                  <option value="MRI" className="bg-[#0b1526]">MRI</option>
                  <option value="Discharge Summary" className="bg-[#0b1526]">Discharge Summary</option>
                </select>

                <button 
                  onClick={() => setShowPinnedOnly(!showPinnedOnly)}
                  className={`flex items-center px-5 py-3 rounded-xl border transition-all whitespace-nowrap font-bold hover:ring-2 hover:ring-blue-400/60 ${showPinnedOnly ? 'bg-gradient-to-r from-blue-600 to-blue-500 border-transparent text-white shadow-[0_0_14px_rgba(37,99,235,0.4)]' : `${glassStyle} text-slate-400 hover:text-blue-400 hover:border-[rgba(59,130,246,0.28)]`}`}
                >
                  <Pin className="w-4 h-4 mr-2" /> Pinned
                </button>
                
                <button 
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`flex items-center px-5 py-3 rounded-xl border transition-all whitespace-nowrap font-bold hover:ring-2 hover:ring-blue-400/60 ${showFavoritesOnly ? 'bg-gradient-to-r from-blue-600 to-blue-500 border-transparent text-white shadow-[0_0_14px_rgba(37,99,235,0.4)]' : `${glassStyle} text-slate-400 hover:text-blue-400 hover:border-[rgba(59,130,246,0.28)]`}`}
                >
                  <Heart className="w-4 h-4 mr-2" /> Favorites
                </button>
              </div>
            </div>

            {/* DOCUMENT GRID */}
            {filteredDocuments.length > 0 ? (
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              >
                {filteredDocuments.map((doc, idx) => (
                  <motion.div 
                    key={doc._id} 
                    variants={itemVariants} 
                    layoutId={`doc-${doc._id}`}
                    className="hover:shadow-[0_0_20px_rgba(59,130,246,0.12)] transition-all duration-300 rounded-2xl"
                  >
                    <DocumentCard 
                      document={doc} 
                      onDelete={handleDelete}
                      onTogglePin={handleTogglePin}
                      onToggleFavorite={handleToggleFavorite}
                    />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`${glassStyle} p-16 flex flex-col items-center justify-center text-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(59,130,246,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }}></div>
                
                <motion.div 
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-8 bg-[rgba(37,99,235,0.08)] border border-[rgba(59,130,246,0.2)] shadow-[0_0_40px_rgba(37,99,235,0.2)] relative z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <FolderOpen className="w-12 h-12 text-blue-500" style={{ filter:'drop-shadow(0 0 8px rgba(37,99,235,0.6))' }} />
                </motion.div>
                <h3 className="text-2xl font-extrabold text-slate-100 mb-3 relative z-10">No records found</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium relative z-10">
                  {documents.length === 0 
                    ? "You haven't uploaded any medical records yet. Store them here securely for easy access." 
                    : "No records match your current filters. Try adjusting your search criteria."}
                </p>
                {documents.length === 0 && (
                  <motion.button 
                    whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={() => setIsUploadModalOpen(true)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_0_28px_rgba(37,99,235,0.50)] transition-all duration-300 relative z-10"
                  >
                    Upload Your First Record
                  </motion.button>
                )}
              </motion.div>
            )}
          </motion.div>
        )}

        {activeTab === 'updates' && (
          <motion.div 
            key="updates"
            variants={tabVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-5"
          >
            {clinicalNotes.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className={`${glassStyle} p-16 flex flex-col items-center justify-center text-center relative overflow-hidden`}
              >
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(rgba(59,130,246,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }}></div>
                <motion.div 
                  className="w-28 h-28 rounded-full flex items-center justify-center mb-8 bg-[rgba(37,99,235,0.08)] border border-[rgba(59,130,246,0.2)] shadow-[0_0_40px_rgba(37,99,235,0.2)] relative z-10"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                  <Stethoscope className="text-blue-500 w-12 h-12" style={{ filter:'drop-shadow(0 0 8px rgba(37,99,235,0.6))' }} />
                </motion.div>
                <h3 className="text-2xl font-extrabold text-slate-100 mb-3 relative z-10">No Doctor Updates Yet</h3>
                <p className="text-slate-400 max-w-md mx-auto mb-8 font-medium relative z-10">
                  When your doctors send updates to your medical profile and you approve them, they will permanently appear here as clinical history.
                </p>
              </motion.div>
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
                {clinicalNotes.map(note => (
                  <motion.div key={note._id} variants={itemVariants} className={`${glassStyle} ${hoverGlass} p-6 sm:p-8 border-l-[3px] border-l-[#2563EB]`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-[rgba(59,130,246,0.12)] pb-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[rgba(37,99,235,0.1)] border border-[rgba(59,130,246,0.2)] text-blue-400 rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(37,99,235,0.2)] shrink-0">
                          <Stethoscope className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-slate-100 leading-tight">Clinical Update</h3>
                          <p className="text-sm text-slate-400 mt-0.5">
                            Added by <span className="font-bold text-blue-400">{note.doctorName}</span> • {new Date(note.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className="px-4 py-1.5 bg-[rgba(37,99,235,0.12)] border border-[rgba(59,130,246,0.25)] text-blue-400 text-xs font-bold rounded-full whitespace-nowrap">
                        Approved by You
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {note.diagnosis && (
                        <div className="bg-[rgba(255,255,255,0.02)] border-l-4 border-l-blue-500 p-4 rounded-xl">
                          <h4 className="text-xs uppercase tracking-wider font-extrabold text-blue-400 mb-1.5">Diagnosis</h4>
                          <p className="text-slate-200 font-medium leading-relaxed">{note.diagnosis}</p>
                        </div>
                      )}
                      {note.prescriptions && note.prescriptions.length > 0 && (
                        <div className={`${glassStyle} p-4`}>
                          <h4 className="text-xs uppercase tracking-wider font-extrabold text-blue-400 mb-2">Prescriptions</h4>
                          <div className="space-y-2">
                            {note.prescriptions.map((p, i) => (
                              <div key={i} className="bg-[rgba(255,255,255,0.02)] border border-[rgba(59,130,246,0.12)] p-2.5 rounded-lg flex justify-between items-center">
                                <span className="font-bold text-slate-100">{p.medicineName}</span>
                                <span className="bg-[rgba(37,99,235,0.12)] text-blue-400 px-2 py-1 rounded-md text-xs font-semibold">{p.dose} - {p.frequency} ({p.duration})</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {note.advice && (
                        <div className="bg-[rgba(245,158,11,0.04)] border-l-4 border-l-amber-500 p-4 rounded-xl md:col-span-2">
                          <h4 className="text-xs uppercase tracking-wider font-extrabold text-amber-400 mb-1.5">Medical Advice</h4>
                          <p className="text-slate-300 font-medium leading-relaxed">{note.advice}</p>
                        </div>
                      )}
                      {note.notes && (
                        <div className={`${glassStyle} p-4 md:col-span-2`}>
                          <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-500 mb-1.5 flex items-center gap-1"><Clock className="w-3 h-3" /> Doctor's Private Notes</h4>
                          <p className="text-slate-400 font-medium leading-relaxed italic">"{note.notes}"</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* MOBILE STICKY UPLOAD BUTTON */}
      <div className="fixed bottom-6 right-6 sm:hidden z-40">
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 90 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsUploadModalOpen(true)}
          className="bg-gradient-to-br from-blue-600 to-blue-800 text-white p-4 rounded-full shadow-[0_0_24px_rgba(37,99,235,0.6)] flex items-center justify-center relative z-10"
        >
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-30"></span>
          <Plus className="w-7 h-7 relative z-10" />
        </motion.button>
      </div>

      <UploadDocumentModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onUploadSuccess={fetchData}
      />
    </motion.div>
  );
};

export default MedicalDocuments;
