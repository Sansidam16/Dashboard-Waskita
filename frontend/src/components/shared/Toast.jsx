import React from 'react';

const Toast = ({ message, type = 'info', onClose }) => {
  const bg = type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-secondary';
  return (
    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded shadow text-white ${bg}`}>
      <span>{message}</span>
      <button className="ml-4" onClick={onClose}>&times;</button>
    </div>
  );
};

export default Toast;
