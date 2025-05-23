import React from 'react';
import { useState, useEffect } from 'react';

function AdminRoute({ children }) {
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAdmin(false);
          setLoading(false);
          return;
        }
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!res.ok) {
          setIsAdmin(false);
        } else {
          const data = await res.json();
          setIsAdmin(!!data.isAdmin);
        }
      } catch {
        setIsAdmin(false);
      }
      setLoading(false);
    };
    checkAdmin();
  }, []);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Memuat data, mohon tunggu...</div>;
  }
  if (!isAdmin) {
    return <div className="text-center p-10 text-red-600 text-xl">Maaf, halaman ini hanya dapat diakses oleh admin. Silakan kembali ke halaman utama.</div>;
  }
  return children;
}

export default AdminRoute;
