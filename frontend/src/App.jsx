import React from 'react';
import AppRoutes from './routes/AppRoutes';
import MainLayout from './components/layout/MainLayout';
import { useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register'];
  const token = localStorage.getItem('token');
  // Route '/' redirect ke dashboard jika login, ke landing jika belum login
  if (location.pathname === '/') {
    if (token) {
      window.location.replace('/dashboard');
      return null;
    }
    // Jika belum login, biarkan ke landing
    return <AppRoutes />;
  }
  // Hanya login dan register yang tanpa layout
  if (noLayoutRoutes.includes(location.pathname)) {
    return <AppRoutes />;
  }
  // Semua halaman lain pakai MainLayout
  return (
    <div className="bg-gray-100 min-h-screen">
      <MainLayout>
        <AppRoutes />
      </MainLayout>
    </div>
  );
}

export default App;
