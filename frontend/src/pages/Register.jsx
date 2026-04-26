import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HeartPulse, CheckCircle2, Loader2, ArrowRight } from 'lucide-react';
import logo from '../assets/logo.png';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient'
  });
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match', {
        style: {
          background: '#ef4444',
          color: '#fff',
        }
      });
      return;
    }

    setLoading(true);
    try {
      const user = await register(formData.name, formData.email, formData.password, formData.role);
      toast.success('Registration successful!', {
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
      navigate(`/${user.role}-dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed', {
        style: {
          background: '#ef4444',
          color: '#fff',
        }
      });
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariant = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-[#0F1115] flex text-[#F3F4F6] font-sans relative overflow-hidden">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 30, 0], y: [0, -50, 0] }} 
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-slate-800/30 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }} 
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-gray-700/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row w-full z-10">
        
        {/* LEFT SIDE BRANDING PANEL */}
        <div className="hidden lg:flex flex-col justify-center w-5/12 p-12 xl:p-20 relative">
          <motion.div 
            initial="hidden" animate="show" variants={staggerContainer}
            className="max-w-md space-y-8"
          >
            <motion.div variants={itemVariant} className="flex items-center space-x-3">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                {/* Fallback to SVG if logo is missing, or use actual logo */}
                <img src={logo} alt="Logo" className="w-10 h-10 object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <HeartPulse className="w-10 h-10 text-[#F3F4F6] hidden" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Swasthya Sathi</h1>
            </motion.div>

            <motion.div variants={itemVariant} className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                Your Trusted Smart Healthcare Ecosystem
              </h2>
              <p className="text-[#9CA3AF] text-lg">
                Join our premium network to experience seamless medical record management, doctor consultations, and family health tracking.
              </p>
            </motion.div>

            <motion.ul variants={staggerContainer} className="space-y-4 pt-6">
              {[
                "Secure Role Based Access",
                "Patients & Doctors Connected",
                "Smart Healthcare Platform"
              ].map((feature, idx) => (
                <motion.li key={idx} variants={itemVariant} className="flex items-center space-x-3 text-[#D1D5DB]">
                  <CheckCircle2 className="w-5 h-5 text-gray-400" />
                  <span className="font-medium">{feature}</span>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        </div>

        {/* RIGHT SIDE FORM CARD */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="w-full max-w-md xl:max-w-lg bg-[rgba(255,255,255,0.03)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] p-8 sm:p-10 rounded-3xl shadow-2xl relative"
          >
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
               <img src={logo} alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
               <HeartPulse className="w-8 h-8 text-[#F3F4F6] hidden" />
               <h1 className="text-2xl font-bold">Swasthya Sathi</h1>
            </div>

            <div className="space-y-2 mb-8 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight">Create New Account</h2>
              <p className="text-[#9CA3AF]">Join Swasthya Sathi today.</p>
            </div>

            <motion.form 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              onSubmit={handleSubmit} 
              className="space-y-5"
            >
              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-sm font-medium text-[#D1D5DB] ml-1">Full Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 bg-[#151821] border border-[rgba(255,255,255,0.05)] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                />
              </motion.div>

              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-sm font-medium text-[#D1D5DB] ml-1">Email Address</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  className="w-full px-4 py-3.5 bg-[#151821] border border-[rgba(255,255,255,0.05)] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                />
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <motion.div variants={itemVariant} className="space-y-1">
                  <label className="text-sm font-medium text-[#D1D5DB] ml-1">Password</label>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-[#151821] border border-[rgba(255,255,255,0.05)] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                </motion.div>

                <motion.div variants={itemVariant} className="space-y-1">
                  <label className="text-sm font-medium text-[#D1D5DB] ml-1">Confirm Password</label>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full px-4 py-3.5 bg-[#151821] border border-[rgba(255,255,255,0.05)] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariant} className="space-y-1">
                <label className="text-sm font-medium text-[#D1D5DB] ml-1">Account Role</label>
                <div className="relative">
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="appearance-none w-full px-4 py-3.5 bg-[#151821] border border-[rgba(255,255,255,0.05)] rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all cursor-pointer"
                  >
                    <option value="patient">Patient</option>
                    <option value="doctor">Doctor</option>
                    <option value="family">Family Member</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariant} className="pt-2">
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center py-4 px-6 rounded-xl text-white font-semibold bg-gradient-to-r from-gray-700 to-slate-600 hover:from-gray-600 hover:to-slate-500 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.form>

            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
              className="mt-8 text-center text-sm text-[#9CA3AF]"
            >
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-white hover:text-gray-300 transition-colors underline decoration-gray-600 underline-offset-4">
                Login
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Register;
