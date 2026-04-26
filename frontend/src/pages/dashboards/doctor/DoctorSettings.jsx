import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Palette, Sun, Moon, Sparkles, Save, RotateCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../../context/ThemeContext';

const THEMES = [
  {
    key: 'default',
    label: 'Swasthya Blue',
    description: 'Premium blue glassmorphism dark interface — the original Swasthya Sathi look.',
    icon: <Sparkles className="w-5 h-5" />,
    preview: {
      bg: 'bg-gradient-to-br from-[#0A1628] via-[#0F1E3D] to-[#0A1628]',
      card: 'bg-white/10 border-white/10',
      text: 'text-blue-300',
      sub: 'text-slate-400',
      accent: 'bg-gradient-to-r from-blue-600 to-cyan-500',
    },
  },
  {
    key: 'light',
    label: 'Mint Light',
    description: 'Clean white dashboard with soft emerald borders and dark text — perfect for daytime use.',
    icon: <Sun className="w-5 h-5" />,
    preview: {
      bg: 'bg-gradient-to-br from-emerald-50 to-teal-50',
      card: 'bg-white border-emerald-100',
      text: 'text-emerald-900',
      sub: 'text-emerald-600',
      accent: 'bg-emerald-500',
    },
  },
  {
    key: 'dark',
    label: 'Emerald Night',
    description: 'Premium deep dark emerald background with luxury cards — ideal for night mode.',
    icon: <Moon className="w-5 h-5" />,
    preview: {
      bg: 'bg-gradient-to-br from-[#022C22] to-[#064E3B]',
      card: 'bg-emerald-900/40 border-emerald-700/50',
      text: 'text-emerald-100',
      sub: 'text-emerald-400',
      accent: 'bg-emerald-400',
    },
  },
];

const AccountSettings = () => {
  const { theme: currentTheme, saveTheme, previewTheme } = useTheme();
  const [selected, setSelected] = useState(currentTheme);
  const [saving, setSaving] = useState(false);

  const handleSelect = (key) => {
    setSelected(key);
    previewTheme(key, 'doctor'); 
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTheme(selected, 'doctor');
      toast.success('Theme saved successfully!', { style: { background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0' } });
    } catch (err) {
      toast.error('Failed to save theme', { style: { background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca' } });
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelected('default');
    previewTheme('default', 'doctor');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto space-y-8 pb-16 relative">
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-[0_15px_40px_rgba(16,185,129,0.06)] border border-emerald-500/10 flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-teal-400/10 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div animate={{ boxShadow: ['0 0 10px rgba(16,185,129,0.2)', '0 0 20px rgba(16,185,129,0.4)', '0 0 10px rgba(16,185,129,0.2)'] }} transition={{ repeat: Infinity, duration: 2.5 }}
          className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-500/30 text-white shrink-0">
          <Palette className="w-8 h-8" />
        </motion.div>
        
        <div className="text-center sm:text-left relative z-10">
          <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Account Settings</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Customize your dashboard experience and personal preferences.</p>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-white/80 backdrop-blur-2xl border border-emerald-500/10 rounded-[2.5rem] p-8 sm:p-10 shadow-[0_15px_40px_rgba(16,185,129,0.06)]">
        
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shadow-sm">
            <Palette className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Appearance</h2>
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mt-1">Preview instantly. Save permanently.</p>
          </div>
        </div>

        {/* Theme cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEMES.map((t, idx) => {
            const isSelected = selected === t.key;
            return (
              <motion.button key={t.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleSelect(t.key)}
                className={`relative text-left rounded-[2rem] border-[3px] overflow-hidden transition-all duration-300 group ${
                  isSelected
                    ? 'border-emerald-500 shadow-[0_15px_40px_rgba(16,185,129,0.2)] bg-emerald-50/50'
                    : 'border-transparent bg-slate-50 hover:border-emerald-200 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)]'
                }`}
              >
                {/* Selected indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute top-4 right-4 w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center z-10 shadow-[0_4px_15px_rgba(16,185,129,0.4)] border-2 border-white">
                      <Check className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mini UI preview */}
                <div className={`h-40 w-full ${t.preview.bg} p-4 relative overflow-hidden`}>
                  {/* Abstract Dashboard Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md ${t.preview.accent} shadow-sm`} />
                      <div className={`h-2 w-16 ${t.preview.text} bg-current rounded-full opacity-80`} />
                    </div>
                    <div className={`w-6 h-6 rounded-full ${t.preview.card} border`} />
                  </div>
                  {/* Abstract Content Grid */}
                  <div className="flex gap-2 mb-2">
                    <div className={`${t.preview.card} border rounded-xl flex-1 p-2`}>
                      <div className={`h-1.5 w-8 ${t.preview.sub} bg-current rounded-full mb-2 opacity-60`} />
                      <div className={`h-2 w-12 ${t.preview.text} bg-current rounded-full opacity-90`} />
                    </div>
                    <div className={`${t.preview.card} border rounded-xl flex-1 p-2`}>
                      <div className={`h-1.5 w-10 ${t.preview.sub} bg-current rounded-full mb-2 opacity-60`} />
                      <div className={`h-2 w-14 ${t.preview.text} bg-current rounded-full opacity-90`} />
                    </div>
                  </div>
                  {/* Abstract Chart */}
                  <div className={`${t.preview.card} border rounded-xl h-12 p-2 flex items-end gap-1 overflow-hidden`}>
                    {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                      <div key={i} className={`flex-1 ${t.preview.accent} rounded-t-sm opacity-80`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6 bg-white">
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 rounded-lg ${isSelected ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
                      {t.icon}
                    </div>
                    <span className={`font-extrabold text-lg tracking-tight ${isSelected ? 'text-emerald-900' : 'text-slate-700'}`}>
                      {t.label}
                    </span>
                    {currentTheme === t.key && (
                      <span className="ml-auto text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md bg-teal-50 text-teal-600 border border-teal-100 shadow-sm">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed">{t.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-10 pt-8 border-t border-slate-100 gap-4">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-2xl text-sm font-extrabold text-slate-500 bg-white border-2 border-slate-200 hover:text-slate-700 hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm">
            <RotateCcw className="w-5 h-5" /> Reset to Default
          </motion.button>

          <motion.button whileHover={!saving ? { y: -2, scale: 1.02 } : {}} whileTap={!saving ? { scale: 0.98 } : {}} onClick={handleSave} disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl text-sm font-extrabold bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 disabled:opacity-70 disabled:cursor-not-allowed transition-all">
            {saving
              ? <><div className="w-5 h-5 border-[3px] border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save className="w-5 h-5" /> Save Preferences</>
            }
          </motion.button>
        </div>
      </div>

    </motion.div>
  );
};

export default AccountSettings;
