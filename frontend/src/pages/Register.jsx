import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../register-progress.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
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
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={password} onChange={e => {
                setPassword(e.target.value);
                // Password strength
                const val = e.target.value;
                if (val.length < 6) setPasswordStrength('Lemah');
                else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(val)) setPasswordStrength('Kuat');
                else setPasswordStrength('Sedang');
              }} required />
              <button type="button" tabIndex="-1" className="absolute right-2 top-2 text-gray-400 hover:text-gray-700" onClick={() => setShowPassword(v => !v)} aria-label="Toggle password visibility">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.217 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.875 4.575A9.978 9.978 0 0022 9c0-5.523-4.477-10-10-10-.825 0-1.625.1-2.4.275" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.895-4.21 2.343-5.657" /></svg>
                )}
              </button>
            </div>
            {/* Saran kekuatan password */}
            {password && (
              <div className={`mt-1 text-xs ${passwordStrength === 'Kuat' ? 'text-green-600' : passwordStrength === 'Sedang' ? 'text-yellow-600' : 'text-red-600'}`}>
                Kekuatan password: <b>{passwordStrength}</b>
                {passwordStrength === 'Kuat' && ' (bagus)'}
                {passwordStrength === 'Sedang' && ' (gunakan huruf besar, kecil, dan angka untuk lebih kuat)'}
                {passwordStrength === 'Lemah' && ' (minimal 6 karakter, gunakan kombinasi huruf & angka)'}
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Konfirmasi Password</label>
            <div className="relative">
              <input type={showConfirmPassword ? 'text' : 'password'} className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
              <button type="button" tabIndex="-1" className="absolute right-2 top-2 text-gray-400 hover:text-gray-700" onClick={() => setShowConfirmPassword(v => !v)} aria-label="Toggle password visibility">
                {showConfirmPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.402-3.217 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.875 4.575A9.978 9.978 0 0022 9c0-5.523-4.477-10-10-10-.825 0-1.625.1-2.4.275" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm2.121-2.121A9.969 9.969 0 0122 12c0 5.523-4.477 10-10 10S2 17.523 2 12c0-2.21.895-4.21 2.343-5.657" /></svg>
                )}
              </button>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
          {success && (
            <>
              <div className="text-green-600 text-sm mb-2">{success}</div>
              <div className="w-full h-1 bg-green-200 rounded overflow-hidden mb-2">
                <div className="h-full bg-green-600 animate-register-progress" style={{width: '100%', animation: 'register-progress-bar 1.5s linear'}}></div>
              </div>
            </>
          )}
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
