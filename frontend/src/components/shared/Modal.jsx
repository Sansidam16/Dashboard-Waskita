import React from 'react';

const Modal = ({ children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white rounded shadow-lg p-6 min-w-[320px] relative">
      <button
        className="absolute top-2 right-2 text-secondary hover:text-accent"
        onClick={onClose}
        aria-label="Close"
      >
        &times;
      </button>
      {children}
    </div>
  </div>
);

export default Modal;
