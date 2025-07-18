import React from 'react';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input
    className={`w-full px-3 py-2 border border-gray-300 rounded bg-white text-black placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 ${className}`}
    {...props}
  />
); 