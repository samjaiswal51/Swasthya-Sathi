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
    label: 'Light Mode',
    description: 'Clean white dashboard with soft borders and dark text — perfect for daytime use.',
    icon: <Sun className="w-5 h-5" />,
    preview: {
      bg: 'bg-gradient-to-br from-slate-50 to-blue-50',
      card: 'bg-white border-slate-200',
      text: 'text-slate-800',
      sub: 'text-slate-500',
      accent: 'bg-blue-600',
    },
  },
  {
    key: 'dark',
    label: 'Dark Mode',
    description: 'Premium deep dark background with elegant cards — ideal for night mode.',
    icon: <Moon className="w-5 h-5" />,
    preview: {
      bg: 'bg-gradient-to-br from-gray-900 to-gray-800',
      card: 'bg-gray-800 border-gray-700',
      text: 'text-white',
      sub: 'text-gray-400',
      accent: 'bg-indigo-600',
    },
  },
];

const AccountSettings = () => {
  const { theme: currentTheme, saveTheme, previewTheme } = useTheme();
  const [selected, setSelected] = useState(currentTheme);
  const [saving, setSaving] = useState(false);

  const handleSelect = (key) => {
    setSelected(key);
    previewTheme(key, 'patient'); 
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveTheme(selected, 'patient');
      toast.success('Theme saved successfully!');
    } catch (err) {
      toast.error('Failed to save theme');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSelected('default');
    previewTheme('default', 'patient');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-5xl mx-auto space-y-6 pb-20 relative">
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl bg-blue-600/6 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-4 relative z-10 bg-white/[0.04] backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-[0_10px_40px_rgba(37,99,235,0.06)]">
        <div className="w-12 h-12 bg-blue-500/15 border border-blue-500/25 rounded-2xl flex items-center justify-center">
          <Palette className="w-6 h-6 text-blue-400" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">Account Settings</h1>
          <p className="text-slate-400 text-sm mt-0.5">Customize your dashboard experience.</p>
        </div>
      </div>

      {/* Theme Section */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-3xl p-6 shadow-[0_10px_40px_rgba(37,99,235,0.06)]">
        <div className="flex items-center gap-2 mb-6">
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 flex items-center justify-center">
            <Palette className="w-4 h-4 text-blue-400" />
          </div>
          <div>
            <h2 className="text-lg font-extrabold text-slate-100">Choose Theme</h2>
            <p className="text-xs text-slate-500 mt-0.5">Click to preview instantly. Save to apply permanently.</p>
          </div>
        </div>

        {/* Theme cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {THEMES.map((t, idx) => {
            const isSelected = selected === t.key;
            return (
              <motion.button key={t.key} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => handleSelect(t.key)}
                className={`relative text-left rounded-2xl border-2 overflow-hidden transition-all duration-300 group ${
                  isSelected
                    ? 'border-blue-500 shadow-[0_0_24px_rgba(37,99,235,0.4),0_8px_32px_rgba(37,99,235,0.2)]'
                    : 'border-white/8 hover:border-blue-500/35 hover:shadow-[0_8px_24px_rgba(37,99,235,0.1)]'
                }`}
              >
                {/* Selected indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                      className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center z-10 shadow-[0_0_10px_rgba(37,99,235,0.6)]">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Mini UI preview */}
                <div className={`h-32 w-full ${t.preview.bg} p-3 relative overflow-hidden`}>
                  <div className={`${t.preview.card} border rounded-xl p-2.5 mb-2`}>
                    <div className={`h-1.5 w-12 ${t.preview.accent} rounded-full mb-1.5`} />
                    <div className={`h-1 w-20 bg-current opacity-20 rounded-full`} />
                  </div>
                  <div className={`${t.preview.card} border rounded-xl p-2 w-14 absolute right-3 top-3 space-y-1.5`}>
                    {[10,14,10,12].map((w,i) => (
                      <div key={i} className={`h-1 ${t.preview.accent} rounded-full opacity-60`} style={{ width: `${w * 4}px` }} />
                    ))}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`${isSelected ? 'text-blue-400' : 'text-slate-400'}`}>{t.icon}</span>
                    <span className={`font-extrabold text-sm ${isSelected ? 'text-blue-300' : 'text-slate-200'}`}>{t.label}</span>
                    {currentTheme === t.key && (
                      <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/25 text-emerald-400">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed">{t.description}</p>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-5 border-t border-white/6 gap-4">
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} onClick={handleReset}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-slate-400 bg-white/5 border border-white/8 hover:text-slate-200 hover:border-white/15 hover:bg-white/8 transition-all">
            <RotateCcw className="w-4 h-4" /> Reset to Default
          </motion.button>

          <motion.button whileHover={!saving ? { y: -2, scale: 1.03 } : {}} whileTap={!saving ? { scale: 0.97 } : {}} onClick={handleSave} disabled={saving}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-extrabold bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-[0_4px_16px_rgba(37,99,235,0.4)] hover:shadow-[0_0_24px_rgba(37,99,235,0.55)] disabled:opacity-60 disabled:cursor-not-allowed transition-all">
            {saving
              ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving...</>
              : <><Save className="w-4 h-4" /> Save Changes</>
            }
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AccountSettings;
