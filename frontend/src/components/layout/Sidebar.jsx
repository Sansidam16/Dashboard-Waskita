import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';



// Sidebar utama dashboard: navigasi utama, menu collapse/expand, highlight aktif
const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDatasetActive = location.pathname.startsWith('/dataset');
  const [open, setOpen] = useState(isDatasetActive);
  const [isAdmin, setIsAdmin] = useState(false);

  React.useEffect(() => {
    const fetchMe = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return setIsAdmin(false);
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) return setIsAdmin(false);
        const data = await res.json();
        setIsAdmin(!!data.isAdmin);
      } catch {
        setIsAdmin(false);
      }
    };
    fetchMe();
  }, []);

  // Sync open state with route
  React.useEffect(() => {
    if (isDatasetActive) setOpen(true);
  }, [isDatasetActive]);

  // Handle Dataset menu click
  const handleDatasetClick = () => {
    if (!isDatasetActive) {
      setOpen(true);
      navigate('/dataset/crawl');
    } else {
      setOpen((o) => !o);
    }
  };

  // Struktur sidebar: logo, menu utama, menu dataset (expand/collapse), labelling, admin setting
  return (
    <aside className="bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-slate-800 w-64 min-h-screen flex flex-col">
      <div className="p-6 flex flex-row items-center gap-3 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
  <img
    src="/logo.png"
    alt="Logo"
    className="w-12 h-12 rounded-xl shadow-lg ring-2 ring-blue-700/30 bg-white dark:bg-transparent transition-all"
  />
  <span className="uppercase font-extrabold text-2xl tracking-wide text-primary dark:text-blue-200 transition-colors">
    WASKITA
  </span>
</div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* Menu utama: Dashboard */}
          <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-semibold text-base selection:bg-blue-200 selection:text-black
              ${isActive
                ? 'bg-blue-700 dark:bg-blue-900 text-white shadow-md shadow-blue-800/20'
                : 'bg-gray-100 text-black dark:text-slate-200 hover:bg-blue-800/60 hover:text-blue-200'}`
            }
            end
          >
            {({ isActive }) => (
              <>
                <span className="relative group">
                  <i className={`fas fa-tachometer-alt text-lg ${isActive ? "text-blue-400" : "text-slate-500"}`}></i>
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                    Dashboard
                  </span>
                </span>
                <span>Dashboard</span>
              </>
            )}
          </NavLink>
          </li>

          {/* Menu Dataset: Expand/Collapse, highlight submenu aktif */}
          <li>
            <button
              className={`flex w-full px-4 py-2 rounded-lg font-semibold transition-colors duration-200 items-center gap-2 focus:outline-none
                ${isDatasetActive ? 'bg-blue-600 text-white shadow-md shadow-blue-900/20' : 'bg-transparent text-black dark:text-slate-200 hover:bg-slate-800 hover:text-blue-200'}`}
              onClick={handleDatasetClick}
              aria-expanded={open}
            >
              <span className="relative group">
                <i className={isDatasetActive ? "fas fa-database text-blue-400 text-lg" : "fas fa-database text-slate-500 text-lg"}></i>
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 rounded bg-gray-800 dark:bg-gray-700 text-white dark:text-gray-100 text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                  Dataset
                </span>
              </span>
              <span>Dataset</span>
              <i className={`fas fa-chevron-${open ? 'down' : 'right'} ml-auto text-xs`}></i>
            </button>
            {open && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                <NavLink
                  to="/dataset/crawl"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-semibold shadow selection:bg-blue-200 selection:text-black
                    ${isActive
                      ? 'bg-blue-700 dark:bg-blue-900 text-white shadow-md shadow-blue-800/20'
                      : 'bg-gray-100 text-black dark:text-slate-200 hover:bg-blue-800/60 hover:text-blue-200'}`
                  }
                >
                  <i className="fas fa-search text-lg"></i>
                  Crawling Data
                </NavLink>

                <NavLink
                  to="/dataset/upload"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-semibold shadow selection:bg-blue-200 selection:text-black
                    ${isActive
                      ? 'bg-blue-700 dark:bg-blue-900 text-white shadow-md shadow-blue-800/20'
                      : 'bg-gray-100 text-black dark:text-slate-200 hover:bg-blue-800/60 hover:text-blue-200'}`
                  }
                >
                  <i className="fas fa-upload text-lg"></i>
                  Unggah Data
                </NavLink>

                <NavLink
                  to="/dataset/saved"
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-semibold shadow selection:bg-blue-200 selection:text-black
                    ${isActive
                      ? 'bg-blue-700 dark:bg-blue-900 text-white shadow-md shadow-blue-800/20'
                      : 'bg-gray-100 text-black dark:text-slate-200 hover:bg-blue-800/60 hover:text-blue-200'}`
                  }
                >
                  <i className="fas fa-database text-lg"></i>
                  Data Saved
                </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Menu Labelling */}
          <li>
            <NavLink
              to="/labeling"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-semibold text-base selection:bg-blue-200 selection:text-black
                ${isActive
                  ? 'bg-blue-700 dark:bg-blue-900 text-white shadow-md shadow-blue-800/20'
                  : 'text-black dark:text-slate-200 hover:bg-gray-800 hover:text-blue-200'}`
              }
              end
            >
              <span className="relative group">
                <i className="fas fa-tags text-lg"></i>
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                  Labelling
                </span>
              </span>
              <span>Labelling</span>
            </NavLink>
          </li>
        {/* Menu Admin Setting (khusus admin) */}
        {isAdmin && (
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors duration-200 font-semibold text-base selection:bg-blue-200 selection:text-black
                ${isActive
                  ? 'bg-blue-700 dark:bg-blue-900 text-white shadow-md shadow-blue-800/20'
                  : 'text-black dark:text-slate-200 hover:bg-gray-800 hover:text-blue-200'}`
              }
              end
            >
              <span className="relative group">
                <i className="fas fa-user-cog text-lg"></i>
                <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2 py-1 rounded bg-gray-800 text-white text-xs opacity-0 group-hover:opacity-100 transition whitespace-nowrap z-20">
                  Admin Setting
                </span>
              </span>
              <span>Admin Setting</span>
            </NavLink>
          </li>
        )}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
