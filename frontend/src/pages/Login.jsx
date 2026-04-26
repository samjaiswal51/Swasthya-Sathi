import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { HeartPulse, CheckCircle2, Loader2, ArrowRight, Lock, Mail } from 'lucide-react';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success('Logged in successfully!', {
        style: {
          background: '#10B981',
          color: '#fff',
        }
      });
      // Redirect based on role
      navigate(`/${user.role}-dashboard`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed', {
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
          animate={{ x: [0, -30, 0], y: [0, 50, 0] }} 
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-slate-800/30 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }} 
          transition={{ repeat: Infinity, duration: 15, ease: "easeInOut" }}
          className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-gray-700/20 rounded-full blur-[100px]"
        />
      </div>

      <div className="flex-1 flex flex-col lg:flex-row w-full z-10">
        
        {/* LEFT SIDE BRANDING PANEL */}
        <div className="hidden lg:flex flex-col justify-center w-5/12 p-12 xl:p-20 relative border-r border-[rgba(255,255,255,0.05)] bg-[rgba(0,0,0,0.2)]">
          <motion.div 
            initial="hidden" animate="show" variants={staggerContainer}
            className="max-w-md space-y-8"
          >
            <motion.div variants={itemVariant} className="flex items-center space-x-3">
              <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-md border border-white/10">
                <img src={logo} alt="Logo" className="w-10 h-10 object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
                <HeartPulse className="w-10 h-10 text-[#F3F4F6] hidden" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight">Swasthya Sathi</h1>
            </motion.div>

            <motion.div variants={itemVariant} className="space-y-4">
              <h2 className="text-4xl xl:text-5xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                Your Trusted Smart Healthcare Ecosystem
              </h2>
              <p className="text-[#9CA3AF] text-lg leading-relaxed">
                Secure access for Patients, Doctors, Families, and Admins.
              </p>
            </motion.div>

            <motion.ul variants={staggerContainer} className="space-y-4 pt-6">
              {[
                "Role Based Login",
                "Secure Access",
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
            className="w-full max-w-md bg-[rgba(255,255,255,0.03)] backdrop-blur-2xl border border-[rgba(255,255,255,0.08)] p-8 sm:p-10 xl:p-12 rounded-3xl shadow-2xl relative"
          >
            {/* Mobile Header (Hidden on Desktop) */}
            <div className="lg:hidden flex items-center justify-center space-x-3 mb-8">
               <img src={logo} alt="Logo" className="w-8 h-8 object-contain" onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
               <HeartPulse className="w-8 h-8 text-[#F3F4F6] hidden" />
               <h1 className="text-2xl font-bold">Swasthya Sathi</h1>
            </div>

            <div className="space-y-2 mb-10 text-center lg:text-left">
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
              <p className="text-[#9CA3AF]">Login to continue to Swasthya Sathi.</p>
            </div>

            <motion.form 
              variants={staggerContainer}
              initial="hidden"
              animate="show"
              onSubmit={handleSubmit} 
              className="space-y-6"
            >
              <motion.div variants={itemVariant} className="space-y-1 relative">
                <label className="text-sm font-medium text-[#D1D5DB] ml-1">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#151821] border border-[rgba(255,255,255,0.05)] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariant} className="space-y-1 relative">
                <label className="text-sm font-medium text-[#D1D5DB] ml-1">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3.5 bg-[#151821] border border-[rgba(255,255,255,0.05)] rounded-xl text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all"
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariant} className="flex items-center justify-between pt-1">
                <label className="flex items-center space-x-2 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-[rgba(255,255,255,0.1)] bg-[#151821] text-gray-500 focus:ring-gray-500 focus:ring-offset-[#0F1115] transition-colors cursor-pointer" 
                  />
                  <span className="text-sm text-[#9CA3AF] group-hover:text-gray-300 transition-colors">Remember me</span>
                </label>
                <a href="#" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                  Forgot Password?
                </a>
              </motion.div>

              <motion.div variants={itemVariant} className="pt-4">
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
                      Login
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
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-white hover:text-gray-300 transition-colors underline decoration-gray-600 underline-offset-4">
                Create New Account
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
