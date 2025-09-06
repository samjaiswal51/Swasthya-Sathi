import React, { useState, useEffect } from 'react';
import axios from 'axios';

// --- Helper Functions and Services (moved from patientService.js) ---
const API_URL = 'http://localhost:5000/api/patient';

const getAuthToken = () => {
  return localStorage.getItem('token');
};

const getAuthHeaders = () => {
    const token = getAuthToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

const handleApiError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Authentication error. Logging out.");
        // Consider a more robust way to handle logout in a real app
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.location.href = '/login';
    }
    const message = (error.response?.data?.message) || error.message;
    throw new Error(message);
};

const getSwasthyaCard = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile/swasthya-card`, { headers: getAuthHeaders() });
    return response.data;
  } catch (error) {
    handleApiError(error);
  }
};


// --- SVG Icons (replaces react-icons/fi) ---
const IconCreditCard = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>);
const IconUser = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>);
const IconHeart = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>);
const IconPhone = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>);
const IconAlertTriangle = () => (<svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>);
const API_BASE_URL = 'http://localhost:5000';

const SwasthyaCard = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const data = await getSwasthyaCard();
        if (data.success) {
          setCardData(data.swasthyaCard);
        } else {
          setError('Could not retrieve card data.');
        }
      } catch (err) {
        setError('Failed to fetch card data. Please complete your profile first.');
        console.error("Failed to fetch card data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCardData();
  }, []);

  if (loading) {
    return (
      <div className="text-center p-10 text-[#03045E]">
        <p>Loading Your Swasthya Card...</p>
      </div>
    );
  }

  if (error || !cardData) {
    return (
      <div className="text-center p-10 bg-red-100 rounded-lg border border-red-200">
        <IconAlertTriangle className="mx-auto text-4xl text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-red-700">Error</h2>
        <p className="text-red-600">{error || 'Could not load card data.'}</p>
      </div>
    );
  }

  const qrCodeUrl = `${API_BASE_URL}/api/patient/scan/${cardData.patientId}`;
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  return (
    <div className="bg-[#CAF0F8] backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-[#00B4D8]/30 text-[#03045E] max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#00B4D8]/30">
        <h1 className="text-2xl font-bold text-[#03045E]">Swasthya Card</h1>
        <div className="text-3xl text-[#0077B6]"><IconCreditCard /></div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Personal & Medical Info */}
        <div className="md:col-span-2 space-y-4">
          <InfoItem icon={<IconUser />} label="Name" value={cardData.name || 'N/A'} />
          <InfoItem icon={<IconHeart />} label="Blood Group" value={cardData.bloodGroup || 'N/A'} isHighlight={true} />
          <InfoItem icon={<IconAlertTriangle />} label="Allergies" value={cardData.allergies?.join(', ') || 'None'} />
          <InfoItem icon={<IconUser />} label="Date of Birth" value={formatDate(cardData.dob)} />
          <InfoItem icon={<IconUser />} label="Gender" value={cardData.gender || 'N/A'} />
          <div className="pt-4 mt-4 border-t border-[#00B4D8]/30">
             <h3 className="text-lg font-semibold text-[#03045E] mb-2">Emergency Contact</h3>
             <InfoItem icon={<IconUser />} label="Name" value={cardData.emergencyContact?.name || 'N/A'} />
             <InfoItem icon={<IconPhone />} label="Phone" value={cardData.emergencyContact?.phone || 'N/A'} />
          </div>
        </div>
        
        {/* QR Code Section (replaces react-qr-code with an img) */}
        <div className="flex flex-col items-center justify-center bg-[#ADEBF4] p-4 rounded-lg border border-[#00B4D8]/30">
          <div className="bg-white p-2 rounded-md shadow-lg">
            <img 
              src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCodeUrl)}`}
              alt="Patient QR Code"
              width="150"
              height="150"
            />
          </div>
           <p className="text-xs text-center mt-3 text-[#0077B6]">
            Card No: <strong>{cardData.cardNumber}</strong>
          </p>
          <p className="text-xs text-center mt-1 text-[#0077B6]">
            Scan for public emergency profile
          </p>
        </div>
      </div>
    </div>
  );
};

// Sub-component for displaying info items
const InfoItem = ({ icon, label, value, isHighlight = false }) => (
  <div>
    <p className="text-sm text-[#0077B6] flex items-center">{icon}<span className="ml-2">{label}</span></p>
    <p className={`text-lg ${isHighlight ? 'font-bold text-[#03045E]' : 'text-[#023E8A]'}`}>{value}</p>
  </div>
);

export default SwasthyaCard;