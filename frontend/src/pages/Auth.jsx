import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Framer Motion components (simulated for this environment)
const motion = {
  div: ({ children, initial, animate, transition, whileHover, whileTap, className, ...props }) => (
    <div className={className} {...props}>{children}</div>
  ),
  h1: ({ children, initial, animate, transition, className, ...props }) => (
    <h1 className={className} {...props}>{children}</h1>
  ),
  p: ({ children, initial, animate, transition, className, ...props }) => (
    <p className={className} {...props}>{children}</p>
  )
};

function AuthPage() {
  const [hoveredButton, setHoveredButton] = useState(null);
  const [logoLoaded, setLogoLoaded] = useState(true);
  const navigate = useNavigate();

  // Navigation handlers
  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Medical Elements */}
        <div className="absolute top-20 left-10 w-12 h-12 bg-blue-200/40 rounded-full opacity-60 animate-bounce backdrop-blur-sm"></div>
        <div className="absolute top-60 right-16 w-8 h-8 bg-green-200/40 rounded-full opacity-50 animate-pulse backdrop-blur-sm"></div>
        <div className="absolute bottom-32 left-20 w-10 h-10 bg-indigo-200/40 rounded-full opacity-40 animate-bounce delay-300 backdrop-blur-sm"></div>
        <div className="absolute bottom-20 right-24 w-6 h-6 bg-emerald-200/40 rounded-full opacity-60 animate-pulse delay-500 backdrop-blur-sm"></div>
        
        {/* Medical Cross Icons */}
        <div className="absolute top-32 right-32 text-blue-300/40 animate-pulse">
          <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        </div>
        <div className="absolute bottom-40 left-24 text-emerald-300/30 animate-bounce delay-700">
          <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
          </svg>
        </div>
        
        {/* Enhanced Gradient Orbs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-blue-300/20 to-indigo-200/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-emerald-300/20 to-green-200/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="w-full max-w-lg"
        >
          {/* Main Card */}
          <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 overflow-hidden">
            {/* Premium Header Gradient */}
            <div className="h-3 bg-gradient-to-r from-blue-600 via-indigo-600 via-purple-600 to-emerald-600 shadow-lg"></div>
            
            <div className="p-10 space-y-8">
              {/* Logo & Branding Section */}
              <motion.div
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="text-center space-y-6"
              >
                {/* Logo Container */}
                <div className="relative mx-auto">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-600 via-indigo-600 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl transform hover:scale-105 transition-all duration-500 relative overflow-hidden">
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
                    
                    {/* Your Logo Here */}
                    {logoLoaded ? (
                      <img 
                        src="/assets/logo.jpg" 
                        alt="Swasthya Sathi Logo" 
                        className="w-14 h-14 object-contain relative z-10 rounded-lg"
                        onError={() => setLogoLoaded(false)}
                      />
                    ) : (
                      // Fallback Premium Icon
                      <div className="relative z-10">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Logo glow effect */}
                  <div className="absolute inset-0 w-24 h-24 mx-auto bg-gradient-to-br from-blue-400 to-emerald-400 rounded-3xl blur-xl opacity-30 animate-pulse"></div>
                </div>
                
                {/* App Name with Enhanced Typography */}
                <motion.h1
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-emerald-700 bg-clip-text text-transparent tracking-tight"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  Swasthya Sathi
                </motion.h1>
                
                {/* Enhanced Subtitle */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-2"
                >
                  <p className="text-gray-700 text-xl leading-relaxed font-medium">
                    Your trusted partner in
                  </p>
                  <p className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                    wellness journey
                  </p>
                </motion.div>
              </motion.div>

              {/* Premium Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.7 }}
                className="space-y-5"
              >
                {/* Sign In Button */}
                <button
                  onClick={handleLoginClick}
                  className="group relative w-full overflow-hidden"
                  onMouseEnter={() => setHoveredButton('login')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div className="relative rounded-2xl overflow-hidden">
                    <div className={`absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 transition-all duration-500 ${
                      hoveredButton === 'login' ? 'scale-105 shadow-2xl' : 'scale-100 shadow-lg'
                    }`}></div>
                    <div className="relative px-8 py-5 text-center text-white">
                      <span className="flex items-center justify-center space-x-3 text-xl font-bold tracking-wide">
                        <span>Sign In</span>
                        <svg className={`w-6 h-6 transition-all duration-300 ${
                          hoveredButton === 'login' ? 'translate-x-2 scale-110' : ''
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                    
                    {/* Button shine effect */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transition-transform duration-700 ${
                      hoveredButton === 'login' ? 'translate-x-full' : '-translate-x-full'
                    }`}></div>
                  </div>
                </button>

                {/* Create Account Button */}
                <button
                  onClick={handleRegisterClick}
                  className="group relative w-full overflow-hidden"
                  onMouseEnter={() => setHoveredButton('register')}
                  onMouseLeave={() => setHoveredButton(null)}
                >
                  <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-300 hover:border-emerald-400 transition-all duration-300">
                    <div className={`absolute inset-0 bg-gradient-to-r from-emerald-50 via-green-50 to-emerald-100 transition-all duration-500 ${
                      hoveredButton === 'register' ? 'scale-105' : 'scale-100'
                    }`}></div>
                    <div className="relative px-8 py-5 text-center text-emerald-700">
                      <span className="flex items-center justify-center space-x-3 text-xl font-bold tracking-wide">
                        <span>Create Account</span>
                        <svg className={`w-6 h-6 transition-all duration-300 ${
                          hoveredButton === 'register' ? 'translate-x-2 scale-110' : ''
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </span>
                    </div>
                  </div>
                </button>
              </motion.div>

              {/* Enhanced Trust Indicators */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.3, duration: 0.7 }}
                className="flex items-center justify-center space-x-8 pt-6 border-t border-gray-200"
              >
                <div className="flex items-center space-x-3 text-gray-600 text-sm font-semibold group">
                  <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors duration-300">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  <span>Secure</span>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-600 text-sm font-semibold group">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors duration-300">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span>Fast</span>
                </div>
                
                <div className="flex items-center space-x-3 text-gray-600 text-sm font-semibold group">
                  <div className="p-2 bg-indigo-100 rounded-lg group-hover:bg-indigo-200 transition-colors duration-300">
                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <span>Trusted</span>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Enhanced Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.7 }}
            className="text-center mt-8 space-y-4"
          >
            <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm font-medium">
              <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <p>Your privacy is our priority</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Custom CSS for shimmer effect */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%) skewX(-12deg); }
          100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(circle at 1px 1px, rgba(0,0,0,0.05) 1px, transparent 0);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
}

export default AuthPage;