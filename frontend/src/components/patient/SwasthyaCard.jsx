// frontend/src/components/patient/SwasthyaCard.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
const SWASTHYA_CARD_URL = `${API_BASE_URL}/api/patient/profile/swasthya-card`;

const SwasthyaCard = () => {
  const [cardData, setCardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCardData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('You are not logged in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(SWASTHYA_CARD_URL, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // backend getSwasthyaCard returns { success, swasthyaCard }
        if (response.data && response.data.success && response.data.swasthyaCard) {
          setCardData(response.data.swasthyaCard);
        } else {
          setError('No Swasthya Card found. Please complete your profile first.');
        }
      } catch (err) {
        console.error('Failed to fetch card data:', err);
        setError('Failed to fetch card data. Please complete your profile first.');
      } finally {
        setLoading(false);
      }
    };

    fetchCardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full text-white">
        Loading Swasthya Card...
      </div>
    );
  }

  if (error) {
    return (
      <div className="m-6 rounded-lg bg-red-100 p-4 text-center text-red-700">
        <h2 className="mb-2 text-lg font-semibold">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!cardData) {
    return null;
  }

  // yahan tumhara existing UI code for card rahega
  return (
    <div className="p-6">
      {/* Example: existing Swasthya Card design yahan paste kar do */}
      <div className="mx-auto max-w-md rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Swasthya Card</h2>
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-wide">
            Emergency
          </span>
        </div>
        <p className="text-sm opacity-80">Card Number</p>
        <p className="mb-4 text-lg font-semibold">{cardData.cardNumber}</p>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="opacity-80">Name</p>
            <p className="font-medium">{cardData.name}</p>
          </div>
          <div>
            <p className="opacity-80">Blood Group</p>
            <p className="font-medium">{cardData.bloodGroup || 'N/A'}</p>
          </div>
          <div>
            <p className="opacity-80">Date of Birth</p>
            <p className="font-medium">
              {cardData.dob ? new Date(cardData.dob).toLocaleDateString() : 'N/A'}
            </p>
          </div>
          <div>
            <p className="opacity-80">Allergies</p>
            <p className="font-medium">
              {cardData.allergies && cardData.allergies.length
                ? cardData.allergies.join(', ')
                : 'None'}
            </p>
          </div>
        </div>

        {cardData.emergencyContact && (
          <div className="mt-4 border-t border-white/20 pt-4 text-sm">
            <p className="opacity-80">Primary Emergency Contact</p>
            <p className="font-medium">{cardData.emergencyContact.name}</p>
            <p className="opacity-90">{cardData.emergencyContact.phone}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwasthyaCard;
