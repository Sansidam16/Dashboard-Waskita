import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import { useLocation } from 'react-router-dom';
import DatasetPage from './pages/DatasetPage';
import DatasetCrawlPage from './pages/DatasetCrawlPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import AdminRoute from './components/AdminRoute';

function App() {
  const [isCheckingAuth, setIsCheckingAuth] = React.useState(true);
  const location = useLocation();
  const noLayoutRoutes = ['/login', '/register'];
  const token = localStorage.getItem('token');

  React.useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setIsCheckingAuth(false);
        return;
      }
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          localStorage.clear();
          setIsCheckingAuth(false);
          return;
        }
      } catch {
        localStorage.clear();
        setIsCheckingAuth(false);
        return;
      }
      setIsCheckingAuth(false);
    };
    checkAuth();
  }, [token]);

  if (isCheckingAuth) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
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
        <AppRoutes>
          <Route path="/dataset" element={<DatasetPage />} />
          <Route path="/dataset/crawl" element={<DatasetCrawlPage />} />
          <Route path="/admin/settings" element={<AdminRoute><AdminSettingsPage /></AdminRoute>} />
        </AppRoutes>
      </MainLayout>
    </div>
  );
}

export default App;
