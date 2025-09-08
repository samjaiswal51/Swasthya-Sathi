import React, { useState, useContext } from 'react'; // Import useContext
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; // Import AuthContext directly

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'patient',
  });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  // Use useContext with AuthContext instead of the custom hook
  const { register } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await register(formData);
      setMessage('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#000000] to-[#0C1821] p-4">
      <div className="w-full max-w-7xl flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-r from-[#0C1821] to-[#1B2A41] backdrop-blur-md bg-opacity-70 border border-[#324A5F] border-opacity-30">
        
        {/* Left Column - Registration Form */}
        <div className="w-full md:w-1/2 p-8 md:p-12 bg-gradient-to-br from-[#0C1821] to-[#1B2A41] backdrop-blur-md bg-opacity-70">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-3xl font-bold text-[#CCC9DC]">Create New Account</h2>
            <p className="text-[#CCC9DC] text-opacity-70 mt-2">Create your account to get started</p>
          </div>

          {error && (
            <div className="mb-6 p-3 bg-red-900 bg-opacity-20 text-red-300 rounded-lg text-center">
              {error}
            </div>
          )}
          
          {message && (
            <div className="mb-6 p-3 bg-green-900 bg-opacity-20 text-green-300 rounded-lg text-center">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* NEW: Name Input Field */}
            <div>
              <label className="block text-sm font-medium text-[#CCC9DC] mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#CCC9DC] text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-[#0C1821] bg-opacity-50 border border-[#324A5F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCC9DC] text-[#CCC9DC] placeholder-[#CCC9DC] placeholder-opacity-30"
                  placeholder="Your Full Name"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CCC9DC] mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#CCC9DC] text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
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
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#CCC9DC] text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-[#0C1821] bg-opacity-50 border border-[#324A5F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCC9DC] text-[#CCC9DC] placeholder-[#CCC9DC] placeholder-opacity-30"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#CCC9DC] mb-2">Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#CCC9DC] text-opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-3 py-3 bg-[#0C1821] bg-opacity-50 border border-[#324A5F] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#CCC9DC] text-[#CCC9DC] appearance-none"
                >
                  <option value="patient">मरीज (Patient)</option>
                  <option value="doctor">डॉक्टर (Doctor)</option>
                  <option value="family">परिवार (Family)</option>
                  <option value="admin">एडमिन (Admin)</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg className="h-4 w-4 text-[#CCC9DC]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-[#324A5F] to-[#1B2A41] text-[#CCC9DC] rounded-lg font-medium transition-all duration-300 hover:from-[#3c5875] hover:to-[#24364e] shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Register Here
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#CCC9DC] text-opacity-70">
              Already Have An Account?{' '}
              <Link 
                to="/login" 
                className="font-medium text-[#CCC9DC] hover:underline transition-all duration-300"
              >
                Login Here
              </Link>
            </p>
          </div>
        </div>

        {/* Right Column - Welcome Message */}
        <div className="w-full md:w-1/2 bg-gradient-to-r from-[#1B2A41] to-[#324A5F] p-8 md:p-12 flex flex-col justify-center items-center text-center text-[#CCC9DC]">
          <div className="max-w-xs mx-auto">
            <div className="mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#CCC9DC]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold mb-4">Already one of us?</h2>
            <p className="mb-8 text-lg opacity-80">
              Welcome back! Log in to access your dashboard and continue your journey with us.
            </p>
            <Link 
              to="/login"
              className="inline-block px-6 py-3 bg-transparent border-2 border-[#CCC9DC] text-[#CCC9DC] rounded-lg font-medium transition-all duration-300 hover:bg-[#CCC9DC] hover:bg-opacity-10 hover:scale-105"
            >
              Login Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;

