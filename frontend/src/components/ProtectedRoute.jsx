import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * ProtectedRoute
 * Membatasi akses halaman hanya untuk user yang sudah login.
 * Jika tidak login, redirect ke halaman login.
 *
 * Penggunaan:
 * <ProtectedRoute>
 *   <HalamanPrivat />
 * </ProtectedRoute>
 */
function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          setLoading(false);
          return;
        }
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setIsAuthenticated(res.ok);
      } catch {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  if (loading) return <div className="flex items-center justify-center h-screen">Memuat data, mohon tunggu...</div>;
  if (!isAuthenticated) return null;
  return children;
}

export default ProtectedRoute;
