import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import { Download, Printer, RefreshCw, AlertCircle, Phone, Heart, User, Calendar, Shield } from 'lucide-react';
import toast from 'react-hot-toast';
import domtoimage from 'dom-to-image-more';
import { motion } from 'framer-motion';

const SwasthyaCard = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    fetchCardData();
  }, []);

  const fetchCardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/patient/profile/swasthya-card', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCardData(res.data);
    } catch (error) {
      console.error('Error fetching card data:', error);
      toast.error('Failed to load Swasthya Card data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshQR = async () => {
    if (!window.confirm('Refreshing the QR code will invalidate your old card. Continue?')) return;
    
    setRefreshing(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/patient/profile/swasthya-card/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCardData({ ...cardData, qrToken: res.data.qrToken });
      toast.success('QR Code refreshed successfully');
    } catch (error) {
      console.error('Error refreshing QR:', error);
      toast.error('Failed to refresh QR Code');
    } finally {
      setRefreshing(false);
    }
  };

  const downloadCard = async () => {
    if (!cardRef.current) return;

    const toastId = toast.loading('Generating card image…');
    try {
      const node = cardRef.current;
      const scale = 3;
      const width = node.offsetWidth * scale;
      const height = node.offsetHeight * scale;

      const dataUrl = await domtoimage.toPng(node, {
        width,
        height,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${node.offsetWidth}px`,
          height: `${node.offsetHeight}px`,
        },
        cacheBust: true,
      });

      const link = document.createElement('a');
      link.download = `SwasthyaCard_${cardData.swasthyaCardId}.png`;
      link.href = dataUrl;
      link.click();
      toast.success('Card downloaded!', { id: toastId });
    } catch (error) {
      console.error('Error downloading card:', error);
      toast.error('Failed to download card image', { id: toastId });
    }
  };

  const printCard = () => {
    window.print();
  };

  const glassStyle = "bg-[rgba(255,255,255,0.03)] backdrop-blur-[16px] border border-[rgba(59,130,246,0.12)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] rounded-2xl";
  const hoverGlassStyle = "hover:border-[rgba(59,130,246,0.28)] hover:shadow-[0_0_20px_rgba(59,130,246,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300";

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <motion.div 
            animate={{ rotate: 360 }} 
            transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
            className="w-20 h-20 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute" 
          />
          <motion.div 
            animate={{ rotate: -360 }} 
            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            className="w-16 h-16 rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-500 absolute" 
          />
        </div>
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-slate-400 font-medium text-sm mt-6 tracking-wide"
        >
          Loading your Swasthya Card...
        </motion.p>
      </div>
    );
  }

  if (!cardData || !cardData.bloodGroup || !cardData.emergencyContact?.mobile) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: "easeOut" }}
        className={`max-w-2xl mx-auto ${glassStyle} border-l-[3px] border-l-[#F59E0B] p-10 text-center shadow-[0_10px_30px_rgba(0,0,0,0.2)]`}
      >
        <motion.div 
          animate={{ y: [0, -4, 0] }} transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center bg-[rgba(245,158,11,0.10)] border border-[rgba(245,158,11,0.20)] shadow-[0_0_30px_rgba(245,158,11,0.15)]"
        >
          <AlertCircle className="text-amber-500 w-10 h-10" />
        </motion.div>
        <h2 className="text-slate-100 font-extrabold text-2xl tracking-tight">Profile Incomplete</h2>
        <p className="text-slate-400 text-sm md:text-base font-medium mt-3 leading-relaxed max-w-md mx-auto">
          To generate your Swasthya Card, please ensure your <strong className="text-amber-500 font-bold">Blood Group</strong>, <strong className="text-amber-500 font-bold">Date of Birth</strong>, and <strong className="text-amber-500 font-bold">Emergency Contact</strong> are filled in your profile.
        </p>
        <motion.button 
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => window.location.href = '/patient-dashboard/profile'}
          className="bg-gradient-to-r from-blue-600 to-blue-500 text-white px-8 py-3 rounded-xl font-bold mt-8 shadow-[0_4px_14px_rgba(37,99,235,0.4)] hover:shadow-[0_0_28px_rgba(37,99,235,0.50)] transition-all duration-300"
        >
          Complete Profile
        </motion.button>
      </motion.div>
    );
  }

  const emergencyUrl = `${window.location.origin}/emergency/${cardData.qrToken}`;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 24 }} 
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="max-w-4xl mx-auto space-y-8 pb-12"
    >
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print-section, .print-section * {
            visibility: visible;
          }
          .print-section {
            position: absolute;
            left: 0;
            top: 0;
            margin: 0;
            padding: 0;
          }
          .no-print-decor {
            display: none !important;
          }
        }
      `}</style>

      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
        >
          <h1 className="text-slate-100 font-extrabold text-3xl tracking-tight border-l-[3px] border-l-[#2563EB] pl-4">
            Swasthya Emergency Card
          </h1>
          <p className="text-slate-400 text-sm font-medium mt-1.5 ml-5">Your digital identity for emergency medical situations.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2, duration: 0.5 }}
          className="flex space-x-3"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={handleRefreshQR}
            disabled={refreshing}
            className={`${glassStyle} hover:text-blue-400 hover:bg-[rgba(37,99,235,0.08)] hover:border-[rgba(59,130,246,0.28)] text-slate-400 p-2.5 rounded-xl transition-all duration-300`}
            title="Refresh QR Code"
          >
            <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin opacity-70' : ''}`} />
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={printCard}
            className={`flex items-center ${glassStyle} hover:text-blue-400 hover:bg-[rgba(37,99,235,0.08)] hover:border-[rgba(59,130,246,0.28)] text-slate-300 px-4 py-2.5 rounded-xl font-bold text-sm transition-all duration-300`}
          >
            <Printer className="w-4 h-4 mr-2" />
            <span>Print</span>
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={downloadCard}
            className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-[0_4px_14px_rgba(37,99,235,0.3)] hover:shadow-[0_0_28px_rgba(37,99,235,0.50)] transition-all duration-300"
          >
            <Download className="w-4 h-4 mr-2" />
            <span>Download</span>
          </motion.button>
        </motion.div>
      </div>

      {/* CARD OUTER WRAPPER */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
        transition={{ 
          opacity: { delay: 0.3, duration: 0.5 },
          scale: { delay: 0.3, duration: 0.5 },
          y: { repeat: Infinity, duration: 4, ease: "easeInOut", delay: 0.8 } 
        }}
        className="flex justify-center py-8 print:p-0 print:m-0"
        style={{ filter: 'drop-shadow(0 0 40px rgba(37,99,235,0.25)) drop-shadow(0 20px 60px rgba(0,0,0,0.5))' }}
      >
        <motion.div 
          whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}
          className="print-section print:shadow-none print:filter-none"
        >
          {/* THE SWASTHYA CARD */}
          <div 
            ref={cardRef}
            className="w-full max-w-[450px] aspect-[1.586/1] rounded-[24px] overflow-hidden relative p-6 border-[1px] border-[rgba(59,130,246,0.20)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] text-slate-100"
            style={{ background: 'linear-gradient(135deg, #0A1628 0%, #0F1D3A 50%, #0A1628 100%)' }}
          >
            {/* DECORATIVE LAYERS */}
            <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full blur-3xl bg-[rgba(37,99,235,0.15)] pointer-events-none no-print-decor" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full blur-3xl bg-[rgba(6,182,212,0.10)] pointer-events-none no-print-decor" />
            <div 
              className="absolute left-0 right-0 top-[45%] h-[1px] pointer-events-none no-print-decor" 
              style={{ background: 'linear-gradient(90deg, transparent, rgba(37,99,235,0.25), transparent)' }} 
            />

            <div className="relative h-full flex flex-col justify-between z-10">
              
              {/* CARD TOP SECTION */}
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.20)] shadow-[0_0_15px_rgba(37,99,235,0.2)] flex items-center justify-center backdrop-blur-md">
                    <Shield className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-slate-100 font-extrabold text-lg tracking-tight leading-tight">Swasthya Card</h2>
                    <p className="text-[9px] uppercase tracking-widest text-blue-400 font-semibold leading-tight mt-0.5">Emergency Health Identity</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[8px] uppercase text-slate-400 tracking-wider mb-0.5 font-bold">Card ID</p>
                  <p className="font-mono text-sm font-bold text-slate-100 tracking-widest" style={{ textShadow: '0 0 10px rgba(37,99,235,0.5)' }}>
                    {cardData.swasthyaCardId}
                  </p>
                </div>
              </div>

              {/* CARD MIDDLE SECTION */}
              <div className="flex items-center space-x-4 my-4">
                <div className="w-[88px] h-[88px] rounded-2xl flex-shrink-0 border border-[rgba(59,130,246,0.25)] shadow-[0_0_15px_rgba(37,99,235,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden bg-[rgba(255,255,255,0.02)] flex items-center justify-center backdrop-blur-sm">
                  {cardData.profilePhoto ? (
                    <img src={cardData.profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="text-blue-500/40 w-10 h-10" />
                  )}
                </div>
                
                <div className="flex-1">
                  <h3 className="text-slate-100 font-extrabold text-base leading-tight mb-2.5" style={{ textShadow: '0 0 15px rgba(255,255,255,0.15)' }}>
                    {cardData.fullName}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-y-2 gap-x-2">
                    <div className="flex items-center space-x-1.5">
                      <Heart className="text-rose-500 fill-rose-500 w-3 h-3" />
                      <span className="text-slate-400 text-[10px] font-medium">Blood:</span>
                      <span className="bg-rose-500/15 border border-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                        {cardData.bloodGroup}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="text-blue-400 w-3 h-3" />
                      <span className="text-slate-400 text-[10px] font-medium">Born:</span>
                      <span className="text-slate-100 text-[11px] font-semibold">{new Date(cardData.dob).getFullYear()}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 col-span-2">
                      <Phone className="text-emerald-500 w-3 h-3" style={{ filter: 'drop-shadow(0 0 4px rgba(16,185,129,0.6))' }} />
                      <span className="text-slate-400 text-[10px] font-medium">Emergency:</span>
                      <span className="text-slate-100 text-[11px] font-semibold">{cardData.emergencyContact?.mobile}</span>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center flex-shrink-0 relative">
                  <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full"></div>
                  <div className="bg-white p-2 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.30)] relative z-10 border border-white/10">
                    <QRCodeSVG 
                      value={emergencyUrl} 
                      size={68}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                  <p className="text-[8px] text-blue-400 text-center mt-2 font-bold uppercase tracking-wider">
                    Scan in Emergency
                  </p>
                </div>
              </div>

              {/* CARD BOTTOM SECTION */}
              <div className="flex justify-between items-end pt-3 border-t border-[rgba(59,130,246,0.15)]">
                <p className="text-[8px] uppercase tracking-wider text-slate-500 italic font-semibold">
                  Authorized Emergency Medical Summary Access
                </p>
                <div className="bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.20)] px-3 py-1 rounded-full backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                  <p className="text-[9px] font-extrabold tracking-widest text-blue-400">SWASTHYA SATHI</p>
                </div>
              </div>

            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* BOTTOM INFO PANELS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        
        {/* SAFETY INSTRUCTIONS */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}
          className={`${glassStyle} ${hoverGlassStyle} p-6 border-l-[3px] border-l-[#2563EB]`}
        >
          <h3 className="flex items-center text-slate-100 font-extrabold text-base tracking-tight mb-4">
            <Shield className="text-blue-500 w-5 h-5 mr-2" style={{ filter: 'drop-shadow(0 0 8px rgba(37,99,235,0.5))' }} />
            Safety Instructions
          </h3>
          <ul className="space-y-0">
            {[
              "Keep this card in your wallet or save the image on your phone's lock screen.",
              "In an emergency, medical staff can scan the QR to see your vitals instantly.",
              "The QR link only shows critical data. Your private documents stay secure."
            ].map((text, idx) => (
              <li key={idx} className={`flex items-start space-x-3 text-slate-400 font-medium text-sm pb-3 mb-3 ${idx < 2 ? 'border-b border-[rgba(255,255,255,0.05)]' : ''}`}>
                <span className="w-6 h-6 rounded-full flex-shrink-0 bg-[rgba(255,255,255,0.03)] border border-[rgba(59,130,246,0.20)] shadow-[inset_0_1px_0_rgba(255,255,255,0.05)] text-blue-500 text-[10px] font-extrabold flex items-center justify-center mt-0.5">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>
        </motion.div>
        
        {/* EMERGENCY TIP */}
        <motion.div 
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}
          className={`${glassStyle} hover:border-[rgba(245,158,11,0.28)] hover:shadow-[0_0_20px_rgba(245,158,11,0.1),inset_0_1px_0_rgba(255,255,255,0.05)] p-6 border-l-[3px] border-l-[#F59E0B] transition-all duration-300`}
        >
          <h3 className="flex items-center text-amber-500 font-extrabold text-base tracking-tight mb-4">
            <AlertCircle className="text-amber-500 w-5 h-5 mr-2" style={{ filter: 'drop-shadow(0 0 8px rgba(245,158,11,0.5))' }} />
            Emergency Tip
          </h3>
          <p className="text-slate-400 font-medium text-sm leading-relaxed">
            Did you know? You can set this card image as your phone's <strong className="text-amber-500 font-bold">Lock Screen Wallpaper</strong>. 
            This allows emergency responders to scan your health ID without needing to unlock your device!
          </p>
        </motion.div>
      </div>

    </motion.div>
  );
};

export default SwasthyaCard;
