import React from 'react';
import { Construction } from 'lucide-react';

const PlaceholderPage = ({ title }) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
      <div className="w-24 h-24 bg-primary-50 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-12 h-12 text-primary-500" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-500 max-w-md text-center">
        This module is currently under construction. Please check back later for updates to the {title} feature.
      </p>
    </div>
  );
};

export default PlaceholderPage;
