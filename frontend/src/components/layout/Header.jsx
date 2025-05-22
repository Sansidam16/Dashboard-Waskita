import React from 'react';

import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  React.useEffect(() => {
    if (!username) {
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [username, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    navigate('/login');
  };
  return (
    <header className="bg-white shadow flex items-center justify-between px-6 py-4 border-b border-gray-200">
      <h1 className="text-xl font-bold text-primary">Dashboard</h1>
      <div className="flex items-center space-x-4">
        {/* Tampilkan username */}
        <span className="bg-accent text-white rounded-full px-3 py-1 font-medium">{username || 'User'}</span>
        <button onClick={handleLogout} className="ml-4 px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition">Logout</button>
      </div>
    </header>
  );
};

export default Header;
