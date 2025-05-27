import React from 'react';

const EmptyState = ({ message, img = "/empty-state.svg", children }) => (
  <div className="flex flex-col items-center justify-center py-16 text-gray-400">
    <img src={img} alt="Empty" className="w-32 mb-4" onError={e => {e.target.style.display='none'}} />
    <div className="text-lg text-center">{message}</div>
    {children}
  </div>
);

export default EmptyState;
