import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { FaUserShield } from 'react-icons/fa';

const sidebarMenu = [
  { label: 'Dashboard', to: '/dashboard', icon: 'fas fa-tachometer-alt' },
  {
    label: 'Dataset',
    icon: 'fas fa-database',
    subMenu: [
      { label: 'Crawling Data', to: '/dataset/crawl', icon: 'fas fa-search' },
      { label: 'Unggah Data', to: '/dataset/upload', icon: 'fas fa-upload' },
      { label: 'Data Saved', to: '/dataset/saved', icon: 'fas fa-database' }
    ]
  },
  { label: 'Labelling', to: '/labeling', icon: 'fas fa-tags' }
];

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

  return (
    <aside className="bg-primary text-white w-64 min-h-screen flex flex-col shadow-lg">
      <div className="p-6 flex flex-row items-center gap-3 text-2xl font-bold tracking-wide border-b border-secondary">
        <img src="/logo.png" alt="Logo" className="w-12 h-12" />
        <span className="uppercase">WASKITA</span>
      </div>
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `flex px-4 py-2 rounded transition-colors items-center gap-2 ${isActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`
              }
              end
            >
              <i className="fas fa-tachometer-alt text-lg"></i>
              <span>Dashboard</span>
            </NavLink>
          </li>

          {/* Dataset with Expand/Collapse */}
          <li>
            <button
              className={`flex w-full px-4 py-2 rounded transition-colors items-center gap-2 focus:outline-none ${isDatasetActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`}
              onClick={handleDatasetClick}
              aria-expanded={open}
            >
              <i className="fas fa-database text-lg"></i>
              <span>Dataset</span>
              <i className={`fas fa-chevron-${open ? 'down' : 'right'} ml-auto text-xs`}></i>
            </button>
            {open && (
              <ul className="ml-8 mt-1 space-y-1">
                <li>
                  <NavLink
                    to="/dataset/crawl"
                    className={({ isActive }) =>
                      `flex px-3 py-2 rounded items-center gap-2 text-sm ${isActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`
                    }
                  >
                    <i className="fas fa-search"></i>
                    Crawling Data
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dataset/upload"
                    className={({ isActive }) =>
                      `flex px-3 py-2 rounded items-center gap-2 text-sm ${isActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`
                    }
                  >
                    <i className="fas fa-upload"></i>
                    Unggah Data
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/dataset/saved"
                    className={({ isActive }) =>
                      `flex px-3 py-2 rounded items-center gap-2 text-sm ${isActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`
                    }
                  >
                    <i className="fas fa-database"></i>
                    Data Saved
                  </NavLink>
                </li>
              </ul>
            )}
          </li>

          {/* Labelling */}
          <li>
            <NavLink
              to="/labeling"
              className={({ isActive }) =>
                `flex px-4 py-2 rounded transition-colors items-center gap-2 ${isActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`
              }
              end
            >
              <i className="fas fa-tags text-lg"></i>
              <span>Labelling</span>
            </NavLink>
          </li>
        {/* Admin Setting */}
        {isAdmin && (
          <li>
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex px-4 py-2 rounded transition-colors items-center gap-2 ${isActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`
              }
              end
            >
              <FaUserShield className="text-lg" />
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
