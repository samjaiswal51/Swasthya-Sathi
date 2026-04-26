import React, { useState } from 'react';
import { CreditCard, CheckCircle, XCircle, Loader2, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, amount, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('simple'); // simple, upi, card

  if (!isOpen) return null;

  const handlePayment = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/payment/fake-pay',
        { amount, method: paymentMethod, forceSuccess: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('Payment Successful!');
        onSuccess(res.data.transactionId);
      } else {
        toast.error('Payment Failed. Try again.');
      }
    } catch (err) {
      toast.error('Payment Gateway Error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030712]/80 backdrop-blur-[10px]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        className="bg-[#0A1628]/95 backdrop-blur-2xl border border-white/10 w-full max-w-md rounded-3xl overflow-hidden
                   shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_50px_rgba(37,99,235,0.12)]"
      >
        {/* Header */}
        <div className="relative overflow-hidden px-7 py-7 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-[#0F172A]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(37,99,235,0.3)_0%,transparent_65%)]" />
          <div className="absolute -top-8 -right-8 w-36 h-36 rounded-full bg-blue-500/15 blur-2xl" />
          <div className="relative">
            <motion.div
              animate={{ boxShadow: ['0 0 16px rgba(37,99,235,0.4)', '0 0 32px rgba(37,99,235,0.7)', '0 0 16px rgba(37,99,235,0.4)'] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-16 h-16 bg-blue-500/20 border border-blue-400/30 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <CreditCard className="w-8 h-8 text-blue-300" />
            </motion.div>
            <h2 className="text-xl font-extrabold text-white tracking-tight">Complete Payment</h2>
            <p className="text-blue-300/70 text-sm mt-1">
              Amount to pay: <span className="font-extrabold text-white text-lg ml-1">₹{amount}</span>
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Method selector */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: 'simple', label: 'Express Pay', icon: <Zap className="w-4 h-4" /> },
              { key: 'card',   label: 'Card / UPI',  icon: <CreditCard className="w-4 h-4" /> },
            ].map(({ key, label, icon }) => (
              <motion.button
                key={key}
                whileTap={{ scale: 0.96 }}
                onClick={() => setPaymentMethod(key)}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl text-sm font-bold border transition-all duration-200 ${
                  paymentMethod === key
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 border-transparent text-white shadow-[0_4px_14px_rgba(37,99,235,0.4)]'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:border-blue-500/30 hover:text-blue-400 hover:bg-blue-500/8'
                }`}
              >
                {icon} {label}
              </motion.button>
            ))}
          </div>

          {/* Card fields */}
          <AnimatePresence mode="wait">
            {paymentMethod === 'card' && (
              <motion.div
                key="card"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-3 overflow-hidden"
              >
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">Card Number</label>
                  <input type="text" value="4111 1111 1111 1111" readOnly
                    className="w-full bg-white/5 border border-white/10 text-slate-300 px-4 py-3 rounded-xl text-sm font-mono outline-none
                               focus:border-blue-500/40 focus:bg-blue-500/5 transition-all duration-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">Expiry</label>
                    <input type="text" value="12/28" readOnly
                      className="w-full bg-white/5 border border-white/10 text-slate-300 px-4 py-3 rounded-xl text-sm font-mono outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">CVV</label>
                    <input type="password" value="123" readOnly
                      className="w-full bg-white/5 border border-white/10 text-slate-300 px-4 py-3 rounded-xl text-sm font-mono outline-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {paymentMethod === 'simple' && (
              <motion.div
                key="simple"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-blue-500/8 border border-blue-500/20 rounded-2xl p-4 text-center"
              >
                <p className="text-sm text-slate-400">One-click simulated payment for testing.</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CTAs */}
          <div className="space-y-3 pt-1">
            <motion.button
              whileHover={!loading ? { y: -2, scale: 1.02 } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              onClick={handlePayment}
              disabled={loading}
              className="w-full py-3.5 rounded-2xl font-extrabold text-sm flex items-center justify-center gap-2
                         bg-gradient-to-r from-blue-600 to-cyan-500 text-white
                         shadow-[0_8px_24px_rgba(37,99,235,0.45)]
                         hover:shadow-[0_0_32px_rgba(37,99,235,0.6)]
                         disabled:opacity-60 disabled:cursor-not-allowed
                         transition-all duration-200"
            >
              {loading
                ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>
                : <><CheckCircle className="w-5 h-5" /> Pay ₹{amount}</>
              }
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onClose}
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold text-sm text-slate-400 border border-white/8
                         hover:bg-white/5 hover:text-slate-200 hover:border-white/15
                         disabled:opacity-50 transition-all duration-200"
            >
              Cancel
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default PaymentModal;
