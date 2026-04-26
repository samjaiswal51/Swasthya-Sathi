import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { IndianRupee, Download, Calendar, Clock, CheckCircle, CreditCard } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { toast } from 'react-hot-toast';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/payment/patient', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPayments(res.data);
    } catch (err) {
      toast.error('Failed to fetch payment history');
    } finally {
      setLoading(false);
    }
  };

  const downloadReceipt = (payment) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('SWASTHYA SATHI', 105, 20, { align: 'center' });
    doc.setFontSize(14);
    doc.text('Payment Receipt', 105, 30, { align: 'center' });
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.text(`Transaction ID: ${payment.transactionId}`, 20, 50);
    doc.text(`Date: ${new Date(payment.createdAt).toLocaleString()}`, 20, 60);
    doc.text(`Status: ${payment.status === 'refunded' ? 'Refunded' : 'Paid'}`, 20, 70);
    doc.line(20, 75, 190, 75);
    doc.setFont('helvetica', 'bold');
    doc.text('Patient Details:', 20, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(payment.patientName, 20, 95);
    doc.setFont('helvetica', 'bold');
    doc.text('Doctor Details:', 120, 85);
    doc.setFont('helvetica', 'normal');
    doc.text(`Dr. ${payment.doctorName}`, 120, 95);
    doc.line(20, 105, 190, 105);
    doc.text(`Consultation Date: ${payment.date}`, 20, 115);
    doc.text(`Time Slot: ${payment.timeSlot}`, 120, 115);
    doc.text(`Mode: ${payment.consultationType}`, 20, 125);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text(`Total Amount Paid: Rs. ${payment.amount}`, 120, 140);
    doc.save(`Receipt_${payment.transactionId}.pdf`);
    toast.success('Receipt downloaded successfully');
  };

  if (loading) return (
    <div className="flex flex-col justify-center items-center py-24 gap-4">
      <div className="relative w-14 h-14">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
          className="w-14 h-14 rounded-full border-4 border-transparent border-t-blue-600 border-r-blue-600 absolute" />
        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
          className="w-10 h-10 rounded-full border-4 border-transparent border-b-cyan-500 border-l-cyan-500 absolute top-2 left-2" />
      </div>
      <p className="text-slate-400 text-sm font-medium">Loading payment history...</p>
    </div>
  );

  const paidCount = payments.filter(p => p.status !== 'refunded').length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="max-w-6xl mx-auto pb-12 space-y-6 relative"
    >
      {/* Ambient orb */}
      <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-3xl bg-blue-600/6 pointer-events-none" />

      {/* Header hero */}
      <div className="relative overflow-hidden rounded-3xl">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] via-blue-900/60 to-[#0A1628]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(37,99,235,0.25)_0%,transparent_60%)]" />
        <div className="relative p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/15 border border-blue-500/25 rounded-2xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-blue-400" style={{ filter: 'drop-shadow(0 0 6px rgba(37,99,235,0.6))' }} />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 tracking-tight">Payment History</h1>
              <p className="text-blue-200/60 text-sm mt-0.5">View transactions and download receipts</p>
            </div>
          </div>
          {payments.length > 0 && (
            <div className="flex gap-3">
              <div className="px-4 py-2 rounded-xl bg-white/8 border border-white/10 text-center">
                <p className="text-xs text-slate-400 font-medium">Total</p>
                <p className="text-lg font-extrabold text-slate-100">{payments.length}</p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center">
                <p className="text-xs text-emerald-400 font-medium">Paid</p>
                <p className="text-lg font-extrabold text-emerald-300">{paidCount}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Table / Cards */}
      <div className="bg-white/[0.03] backdrop-blur-xl border border-white/8 rounded-3xl overflow-hidden
                      shadow-[0_10px_40px_rgba(37,99,235,0.06)]">
        {payments.length === 0 ? (
          <div className="text-center py-20">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
              className="w-20 h-20 mx-auto mb-5 rounded-2xl bg-blue-500/10 border border-blue-500/20
                         shadow-[0_0_30px_rgba(37,99,235,0.15)] flex items-center justify-center"
            >
              <IndianRupee className="w-10 h-10 text-blue-500/50" />
            </motion.div>
            <h3 className="text-xl font-extrabold text-slate-100 mb-2">No Payments Yet</h3>
            <p className="text-slate-400 text-sm">Your consultation payments will appear here.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/6">
                    {['Transaction ID', 'Doctor', 'Amount', 'Consultation', 'Status', 'Action'].map((h, i) => (
                      <th key={h} className={`px-5 py-4 text-xs font-extrabold uppercase tracking-widest text-slate-500 ${i === 5 ? 'text-right' : ''}`}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, idx) => (
                    <motion.tr
                      key={payment._id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className="border-b border-white/4 hover:bg-blue-500/5 hover:shadow-[inset_0_0_0_1px_rgba(37,99,235,0.12)] transition-all duration-200"
                    >
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-200 font-mono">{payment.transactionId}</p>
                        <p className="text-xs text-slate-600 mt-1">{new Date(payment.createdAt).toLocaleDateString()}</p>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-200">Dr. {payment.doctorName}</p>
                        <p className="text-xs text-slate-500 mt-1">{payment.consultationType}</p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center text-base font-extrabold text-emerald-400">
                          <IndianRupee className="w-4 h-4 mr-0.5" />{payment.amount}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-500" /> {payment.date}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5 text-cyan-500" /> {payment.timeSlot}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {payment.status === 'refunded' ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold
                                           bg-rose-500/15 text-rose-400 border border-rose-500/25">
                            <CheckCircle className="w-3.5 h-3.5" /> Refunded
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold
                                           bg-emerald-500/15 text-emerald-400 border border-emerald-500/25
                                           shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                            <CheckCircle className="w-3.5 h-3.5" /> Paid
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.1, rotate: -6 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => downloadReceipt(payment)}
                          title="Download Receipt"
                          className="inline-flex items-center justify-center w-9 h-9 rounded-xl
                                     bg-blue-500/15 border border-blue-500/25 text-blue-400
                                     hover:bg-blue-500/25 hover:border-blue-500/40
                                     hover:shadow-[0_0_14px_rgba(37,99,235,0.3)]
                                     transition-all duration-200"
                        >
                          <Download className="w-4 h-4" />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile stacked cards */}
            <div className="md:hidden divide-y divide-white/5">
              {payments.map((payment, idx) => (
                <motion.div
                  key={payment._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.06 }}
                  className="p-5 hover:bg-blue-500/5 transition-all duration-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-extrabold text-slate-200 font-mono truncate max-w-[180px]">{payment.transactionId}</p>
                    {payment.status === 'refunded' ? (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-rose-500/15 text-rose-400 border border-rose-500/25">Refunded</span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500/15 text-emerald-400 border border-emerald-500/25">Paid</span>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-slate-300">Dr. {payment.doctorName}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{payment.date} · {payment.timeSlot}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-extrabold text-emerald-400 flex items-center">
                        <IndianRupee className="w-4 h-4" />{payment.amount}
                      </span>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => downloadReceipt(payment)}
                        className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-500/25 text-blue-400 flex items-center justify-center">
                        <Download className="w-4 h-4" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

export default PaymentHistory;
