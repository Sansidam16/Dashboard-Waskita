import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl shadow-lg p-10 w-full max-w-2xl flex flex-col items-center">
        <img src="/logo.png" alt="Logo" className="w-32 mb-6" />
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-2 text-center">Selamat Datang di Aplikasi WASKITA</h1>
        <p className="text-gray-500 mb-10 text-center text-base md:text-lg">Deteksi Cepat Konten Intoleransi, Radikalisme, dan Terorisme di Ruang Siber</p>
        <div className="flex flex-wrap justify-center gap-6 mt-2">
          <button
  onClick={() => navigate('/login')}
  className="flex items-center gap-2 min-w-[140px] px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition font-semibold text-base justify-center"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9V5a1 1 0 011-1h2a1 1 0 011 1v4m-1 4h-4m4 0l-4 4m0-4l4 4" /></svg>
  <span>Login</span>
</button>
          <button
  onClick={() => navigate('/register')}
  className="flex items-center gap-2 min-w-[140px] px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition font-semibold text-base justify-center"
>
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-8 0v2M12 11a4 4 0 100-8 4 4 0 000 8zm6 8v-2a6 6 0 00-12 0v2m6-8v6m3-3h-6" /></svg>
  <span>Register</span>
</button>
        </div>
      </div>
    </div>
  );
}
