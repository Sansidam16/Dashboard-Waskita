import React from 'react';

const colorClasses = {
  accent: 'bg-accent text-white hover:bg-blue-700',
  secondary: 'bg-secondary text-white hover:bg-primary',
  primary: 'bg-primary text-white hover:bg-secondary',
};

const sizeClasses = {
  sm: 'px-3 py-1 text-sm',
  md: 'px-4 py-2',
};

const Button = ({ children, color = 'primary', size = 'md', ...props }) => (
  <button
    className={`rounded shadow transition-colors ${colorClasses[color]} ${sizeClasses[size]}`}
    {...props}
  >
    {children}
  </button>
);

export default Button;
