import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ShieldAlert, Phone, Heart, Activity, AlertTriangle, User, Loader2, Mail, Info } from 'lucide-react';

const EmergencyScanPage = () => {
  const { token } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEmergencyData = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/public/emergency/${token}`);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching emergency data:', err);
        setError('Invalid or expired emergency link.');
      } finally {
        setLoading(false);
      }
    };

    fetchEmergencyData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="w-12 h-12 animate-spin text-red-600 mb-4" />
        <p className="text-gray-600 font-medium">Accessing Emergency Medical Records...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-20 h-20 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="w-10 h-10" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 text-center max-w-xs">{error}</p>
        <button 
          onClick={() => window.location.href = '/'}
          className="mt-8 text-primary-600 font-bold hover:underline"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Urgent Header */}
        <div className="bg-red-600 text-white rounded-2xl p-6 shadow-xl flex items-center space-x-4 animate-pulse">
          <AlertTriangle className="w-10 h-10 flex-shrink-0" />
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight">Emergency Medical Summary</h1>
            <p className="text-red-100 text-sm font-medium">Critical Information for First Responders</p>
          </div>
        </div>

        {/* Patient Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <div className="w-32 h-32 rounded-2xl border-4 border-gray-100 overflow-hidden shadow-sm bg-gray-50 flex-shrink-0">
              {data.profilePhoto ? (
                <img src={data.profilePhoto} alt="Patient" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>
            <div className="space-y-4 w-full">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">{data.fullName}</h2>
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                  <span className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center">
                    <Heart className="w-4 h-4 mr-1 fill-red-700" />
                    Blood Type: {data.bloodGroup || 'Unknown'}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    Age: {data.age || 'N/A'}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                    Gender: {data.gender || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Critical Information Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-red-700 font-bold flex items-center mb-4">
              <ShieldAlert className="w-5 h-5 mr-2" />
              Allergies
            </h3>
            {data.allergies && data.allergies.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {data.allergies.map((allergy, i) => (
                  <span key={i} className="bg-red-50 text-red-600 px-3 py-1 rounded-lg text-sm font-semibold border border-red-100">
                    {allergy}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm italic">No known allergies reported.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-amber-700 font-bold flex items-center mb-4">
              <Activity className="w-5 h-5 mr-2" />
              Medical Conditions
            </h3>
            {data.diseases && data.diseases.length > 0 ? (
              <ul className="space-y-2">
                {data.diseases.map((disease, i) => (
                  <li key={i} className="text-gray-700 text-sm flex items-start italic font-medium">
                    <span className="text-amber-500 mr-2">•</span> {disease}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm italic">No chronic conditions reported.</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 md:col-span-2">
            <h3 className="text-blue-700 font-bold flex items-center mb-4">
              <Info className="w-5 h-5 mr-2" />
              Current Medications
            </h3>
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <p className="text-gray-700 text-sm leading-relaxed font-medium">
                {data.medications || 'No current medications listed.'}
              </p>
            </div>
          </div>
        </div>

        {/* Emergency Contact Action */}
        {data.emergencyContact && (
          <div className="bg-white rounded-2xl shadow-xl border-2 border-primary-100 overflow-hidden">
            <div className="p-6">
              <h3 className="text-gray-900 font-bold flex items-center mb-6">
                <Phone className="w-5 h-5 mr-2 text-primary-600" />
                Emergency Contact
              </h3>
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-sm text-gray-500">Contact Name</p>
                  <p className="text-xl font-bold text-gray-900">{data.emergencyContact.name}</p>
                  <p className="text-sm font-medium text-primary-600">{data.emergencyContact.relation}</p>
                </div>
                
                <div className="flex gap-2 w-full sm:w-auto">
                  <a 
                    href={`tel:${data.emergencyContact.mobile}`}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-lg active:scale-95"
                  >
                    <Phone className="w-5 h-5 fill-white" />
                    <span>Call Now</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center pt-8 pb-12">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center">
            <ShieldAlert className="w-3 h-3 mr-1" />
            Swasthya Sathi Digital Health Registry
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmergencyScanPage;
