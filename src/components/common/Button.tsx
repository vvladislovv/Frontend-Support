import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'warning';
}

const base = 'px-4 py-2 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400';
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  danger: 'bg-red-500 text-white hover:bg-red-600',
  warning: 'bg-yellow-400 text-white hover:bg-yellow-500',
};

export const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', ...props }) => (
  <button className={`${base} ${variants[variant]} ${className}`} {...props}>
    {children}
  </button>
); 