import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-32 mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 text-center">Selamat Datang di Aplikasi WASKITA</h1>
        <p className="text-gray-500 mb-8 text-center text-base md:text-lg">Deteksi Cepat Konten Intoleransi, Radikalisme, dan Terorisme di Ruang Siber</p>
        <div className="flex gap-4 mt-2">
          <button onClick={() => navigate('/login')} className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-base font-medium">
  <i className="fas fa-right-to-bracket"></i>
  <span>Login</span>
</button>
          <button onClick={() => navigate('/register')} className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 text-base font-medium">
  <i className="fas fa-user-plus"></i>
  <span>Register</span>
</button>
        </div>
      </div>
    </div>
  );
}
