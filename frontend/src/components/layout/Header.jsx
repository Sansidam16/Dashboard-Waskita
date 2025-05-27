import React from 'react';
import { FaUserShield } from 'react-icons/fa';
import { AiOutlineUser } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun } from 'react-icons/fa';

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
  // Dark mode state
  const [darkMode, setDarkMode] = React.useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="bg-white dark:bg-gray-900 shadow-sm flex items-center justify-between px-6 py-3 sticky top-0 z-30">
      <h1 className="text-xl font-bold text-primary dark:text-white">Dashboard</h1>
      <div className="flex items-center gap-3">
        {/* Toggle dark mode */}
        <button
          onClick={() => setDarkMode((d) => !d)}
          className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <FaSun className="text-yellow-400 text-xl" /> : <FaMoon className="text-gray-700 text-xl" />}
        </button>
        {/* Avatar dan username */}
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-full shadow transition focus:outline-none">
          {localStorage.getItem('profilePicture') ? (
            <img
              src={localStorage.getItem('profilePicture')}
              alt="avatar"
              className="w-7 h-7 rounded-full border-2 border-blue-600 shadow-sm bg-white object-cover"
            />
          ) : (
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border-2 border-blue-600 shadow-sm">
              <AiOutlineUser className="w-6 h-6 text-blue-600" />
            </span>
          )}
          <span className="font-semibold">{username || 'User'}</span>
          {username && (
            <span className="text-teal-200 align-middle hover:scale-110 hover:drop-shadow transition-transform" title="User Aktif">
              <FaUserShield />
            </span>
          )}
        </button>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-full shadow transition ml-4 focus:outline-none">
          <i className="fas fa-sign-out-alt"></i>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
