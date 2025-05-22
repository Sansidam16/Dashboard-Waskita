import React from 'react';
import { NavLink } from 'react-router-dom';

const sidebarMenu = [
  { label: 'Dashboard', to: '/dashboard', icon: 'fas fa-tachometer-alt' },
  { label: 'Dataset', to: '/dataset', icon: 'fas fa-database' },
  { label: 'Labelling', to: '/labeling', icon: 'fas fa-tags' }
];

const Sidebar = () => (
  <aside className="bg-primary text-white w-64 min-h-screen flex flex-col shadow-lg">
    <div className="p-6 flex flex-row items-center gap-3 text-2xl font-bold tracking-wide border-b border-secondary">
      <img src="/logo.png" alt="Logo" className="w-12 h-12" />
      <span className="uppercase">WASKITA</span>
    </div>
    <nav className="flex-1 p-4">
      <ul className="space-y-2">
        {sidebarMenu.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex px-4 py-2 rounded transition-colors items-center gap-2 ${isActive ? 'bg-accent text-white' : 'hover:bg-secondary'}`
              }
              end
            >
              <i className={item.icon + ' text-lg'}></i>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  </aside>
);

export default Sidebar;
