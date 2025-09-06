import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { LockClosedIcon, UserIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await login(credentials);
      navigate(`/${data.role}-dashboard`);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#000000] to-[#1B2A41] p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-7xl flex rounded-2xl overflow-hidden shadow-2xl"
      >
        {/* Left Column - Information/Marketing */}
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="hidden md:flex flex-col justify-center items-center w-1/2 bg-gradient-to-r from-[#0C1821] to-[#1B2A41] p-12 text-[#CCC9DC]"
        >
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="text-center space-y-6"
          >
            <div className="flex justify-center">
              <ShieldCheckIcon className="h-16 w-16 text-[#CCC9DC]" />
            </div>
            <h1 className="text-4xl font-bold">Welcome Back!</h1>
            <p className="text-lg">
              Access your personalized dashboard, continue your progress, and stay connected with our community.
            </p>
            <div className="flex items-center justify-center mt-8 space-x-4">
              <div className="w-3 h-3 rounded-full bg-[#CCC9DC]"></div>
              <div className="w-3 h-3 rounded-full bg-[#324A5F]"></div>
              <div className="w-3 h-3 rounded-full bg-[#324A5F]"></div>
            </div>
          </motion.div>
        </motion.div>

        {/* Right Column - Login Form */}
        <motion.div 
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="w-full md:w-1/2 bg-gradient-to-br from-[#0C1821] to-[#1B2A41] backdrop-blur-md bg-opacity-70 p-10 border border-[#324A5F] border-opacity-30 rounded-2xl md:rounded-none"
        >
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold text-[#CCC9DC]">Login here</h2>
            <p className="text-[#CCC9DC] text-opacity-70 mt-2">Please enter your credentials</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-3 bg-red-900 bg-opacity-20 text-red-300 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#CCC9DC] mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-[#CCC9DC] text-opacity-50" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-[#0C1821] bg-opacity-50 border border-[#324A5F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCC9DC] text-[#CCC9DC] placeholder-[#CCC9DC] placeholder-opacity-30"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CCC9DC] mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-[#CCC9DC] text-opacity-50" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-[#0C1821] bg-opacity-50 border border-[#324A5F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCC9DC] text-[#CCC9DC] placeholder-[#CCC9DC] placeholder-opacity-30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Link 
                to="/forgot-password" 
                className="text-sm text-[#CCC9DC] text-opacity-70 hover:text-opacity-100 transition-colors duration-300"
              >
                Forgot Password?
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#324A5F] to-[#1B2A41] text-[#CCC9DC] rounded-lg font-medium transition-all duration-300 hover:from-[#3c5875] hover:to-[#24364e] shadow-lg"
            >
              Login Here
            </motion.button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#CCC9DC] text-opacity-70">
              Want To Create New Account?{' '}
              <Link 
                to="/register" 
                className="font-medium text-[#CCC9DC] hover:underline transition-all duration-300"
              >
                Register Here
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;