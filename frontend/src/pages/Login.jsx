import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        navigate('/dashboard'); // Redirect ke dashboard utama
      } else {
        setError(data.message || 'Login gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-24 mb-4" />
        <h1 className="text-2xl font-bold text-blue-600 mb-2 text-center">Selamat Datang di Aplikasi WASKITA</h1>
        <p className="text-gray-500 mb-6 text-center text-sm">Deteksi Cepat Konten Intoleransi, Radikalisme, dan Terorisme di Ruang Siber</p>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Login</button>
        </form>
        <div className="flex gap-2 mt-4">
          <button onClick={() => navigate('/register')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2">
  <i className="fas fa-user-plus"></i>
  <span>Register</span>
</button>
        </div>
      </div>
    </div>
  );
}
