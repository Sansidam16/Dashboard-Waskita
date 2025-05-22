import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (password !== confirmPassword) {
      setError('Password dan konfirmasi password tidak sama!');
      return;
    }
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess('Registrasi berhasil! Silakan login.');
        setTimeout(() => navigate('/login'), 1500);
      } else {
        setError(data.message || 'Registrasi gagal');
      }
    } catch (err) {
      setError('Terjadi kesalahan pada server');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-24 mb-4" />
        <h1 className="text-2xl font-bold text-blue-600 mb-2 text-center">Daftar Akun Baru</h1>
        <form className="w-full" onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Username</label>
            <input type="text" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={username} onChange={e => setUsername(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Email</label>
            <input type="email" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Password</label>
            <input type="password" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Konfirmasi Password</label>
            <input type="password" className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && <div className="text-green-600 text-sm mb-2">{success}</div>}
          <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Register</button>
        </form>
        <div className="flex gap-2 mt-4">
          <button onClick={() => navigate('/login')} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2">
  <i className="fas fa-right-to-bracket"></i>
  <span>Login</span>
</button>
        </div>
      </div>
    </div>
  );
}
