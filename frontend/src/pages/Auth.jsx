import React from 'react';
import { Link } from 'react-router-dom';

function AuthPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          स्वास्थ्य साथी
        </h1>
        <p className="text-center text-gray-600">
          आपकी स्वास्थ्य यात्रा में आपका विश्वसनीय साथी।
        </p>
        <div className="flex flex-col space-y-4">
          <Link
            to="/login"
            className="w-full px-4 py-2 text-center text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            लॉग इन करें
          </Link>
          <Link
            to="/register"
            className="w-full px-4 py-2 text-center text-white bg-green-600 rounded-lg hover:bg-green-700 transition duration-300"
          >
            नया खाता बनाएँ
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
