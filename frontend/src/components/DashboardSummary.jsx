import React from 'react';

const DashboardSummary = () => {
  const token = localStorage.getItem('token');
  const username = localStorage.getItem('username');
  // Jika tidak ada token/username, jangan render apapun (biarkan redirect oleh Header)
  if (!token || !username) {
    return null;
  }
  return (
    <div className="w-full min-h-[80vh] flex flex-col items-center justify-start bg-gray-50 dark:bg-slate-950 py-8">
      <h2 className="text-3xl font-bold text-black dark:text-white mb-8">Dashboard Ringkasan</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <i className="fas fa-database text-4xl text-blue-500 dark:text-blue-400 mb-2"></i>
            <span className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">12</span>
          <span className="text-lg text-black">Total Datasets</span>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center hover:scale-105 hover:shadow-2xl transition-all duration-300">
          <i className="fas fa-tags text-4xl text-blue-500 dark:text-blue-400 mb-2"></i>
            <span className="text-5xl font-bold text-blue-600 dark:text-blue-400 mb-2">34</span>
          <span className="text-lg text-black">Total Labels</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardSummary;
