import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!identifier || !password) {
      setError('Email/username dan password wajib diisi!');
      return;
    }
    // Debug: cek nilai identifier dan password

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: identifier, password }),
      });
      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        window.location.href = '/dashboard'; // Reload penuh agar Sidebar fetch ulang status admin
      } else {
        setError(data.message || 'Email atau Username dan Password Salah');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-24 mb-4" />
        <h1 className="text-2xl font-bold text-blue-600 mb-2 text-center">Selamat Datang di Aplikasi WASKITA</h1>
        <p className="text-gray-500 mb-6 text-center text-sm">Deteksi Cepat Konten Intoleransi, Radikalisme, dan Terorisme di Ruang Siber</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email atau Username</label>
            <input type="text" className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : ''}`} value={identifier} onChange={e => setIdentifier(e.target.value)} required placeholder="Masukkan email atau username" />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : ''}`} value={password} onChange={e => setPassword(e.target.value)} required />
              <button type="button" tabIndex="-1" className="absolute right-2 top-2 text-gray-400 hover:text-gray-700" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.217 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.875 4.575A9.978 9.978 0 0022 9c0-5.523-4.477-10-10-10-.825 0-1.625.1-2.4.275" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.895-4.21 2.343-5.657" /></svg>
                )}
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-lg shadow-md hover:bg-blue-700 transition font-semibold flex items-center justify-center gap-2" disabled={loading}>
            {loading && (
              <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
              </svg>
            )}
            {loading ? 'Memproses...' : 'Login'}
          </button>
        </form>
        <button
  onClick={() => navigate('/register')}
  className="w-full mt-4 bg-green-600 text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition font-semibold flex items-center justify-center gap-2"
>
  {/* Icon Register dari react-icons */}
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8zm6 8v-2a6 6 0 00-12 0v2m6-8v6m3-3h-6" /></svg>
  <span>Register</span>
</button>
      </div>
    </div>
  );
}
