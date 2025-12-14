import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center text-gray-500 hover:text-indigo-600 transition-colors font-medium text-sm group"
      >
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Home
      </Link>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 tracking-tight">
            {title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {subtitle}
          </p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;