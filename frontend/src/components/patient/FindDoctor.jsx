import React, { useState, useEffect } from 'react';
import doctorService from '../../services/doctorService';
import { FiSearch, FiAlertCircle } from 'react-icons/fi';

const FindDoctor = () => {
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      try {
        const data = await doctorService.getAllDoctors(searchTerm.trim());
        setDoctors(data);
      } catch (err) {
        setError('Failed to fetch doctors. Please try again later.');
        console.error("Failed to fetch doctors:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchDoctors();
    }, 300); // Debounce search to avoid too many API calls

    return () => clearTimeout(debounceTimer);
  }, [searchTerm]);

  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150/48CAE4/FFFFFF?text=Doctor';
  };

  return (
    <div className="text-white p-1 md:p-4 h-full flex flex-col">
      <h1 className="text-2xl md:text-3xl font-bold mb-6 text-[#CAF0F8]">Find a Doctor</h1>
      
      {/* Search Bar */}
      <div className="relative mb-6">
        <FiSearch className="absolute top-1/2 left-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by name or specialization (e.g., Cardiology)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-lg bg-[#0077B6]/30 text-white border border-transparent focus:border-[#48CAE4] focus:ring-0 focus:outline-none transition-all placeholder-gray-400"
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="text-center p-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#48CAE4] mx-auto mb-4"></div>
            <p className="text-lg text-[#90E0EF]">Loading doctors...</p>
          </div>
        ) : error ? (
          <div className="text-center p-8 bg-red-500/20 rounded-lg border border-red-500/30">
            <FiAlertCircle className="text-red-300 text-4xl mx-auto mb-4" />
            <p className="text-lg text-red-300">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-500/30 text-red-200 rounded-lg hover:bg-red-500/40 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              <div 
                key={doctor._id} 
                className="bg-[#0077B6]/20 backdrop-blur-sm p-5 rounded-xl flex items-center space-x-4 border border-[#48CAE4]/20 hover:border-[#48CAE4]/60 transition-all duration-300 hover:shadow-lg hover:shadow-[#48CAE4]/10"
              >
                <img 
                  src={doctor.profilePicture} 
                  alt={doctor.fullName}
                  onError={handleImageError}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#48CAE4] flex-shrink-0" 
                />
                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-semibold text-[#CAF0F8] truncate">{doctor.fullName}</h2>
                  <p className="text-[#48CAE4] font-medium truncate">{doctor.specialization}</p>
                  <p className="text-[#90E0EF] text-sm mt-1">
                    {doctor.yearsOfExperience} {doctor.yearsOfExperience === 1 ? 'year' : 'years'} of experience
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-8 bg-[#0077B6]/20 rounded-lg border border-[#48CAE4]/20">
            <FiSearch className="text-[#90E0EF] text-4xl mx-auto mb-4" />
            <p className="text-lg text-[#90E0EF] mb-2">
              {searchTerm ? 'No doctors found matching your search.' : 'No approved doctors available at the moment.'}
            </p>
            {searchTerm && (
              <p className="text-sm text-[#90E0EF]/70">
                Try searching with different terms or check your spelling.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindDoctor;