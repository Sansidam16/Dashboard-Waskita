import React, { useState, useEffect } from "react";
import MuiDatasetCrawlTable from './MuiDatasetCrawlTable';
import Toast from '../shared/Toast';
import { FaSearch, FaCheckCircle } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';



const DatasetCrawlForm = ({ onError }) => {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('info');
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(10); // default 10 agar konsisten dengan backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [crawledData, setCrawledData] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');
  const [alreadySaved, setAlreadySaved] = useState(false);

  // Notifikasi sukses auto hilang setelah 2 detik
  useEffect(() => {
    if (saveSuccess) {
      const timeout = setTimeout(() => setSaveSuccess(''), 2000);
      return () => clearTimeout(timeout);
    }
  }, [saveSuccess]);

  // Reset state alreadySaved jika data berubah (misal pencarian baru)
  useEffect(() => {
    setAlreadySaved(false);
  }, [crawledData]);


  // Tombol "Cari Data" dari Apify Dataset Items
  const handleCrawlApify = async (e) => {
    e.preventDefault();
    // Frontend validation
    if (!keyword.trim()) {
      setError('Keyword wajib diisi');
      return;
    }
    if (!Number.isInteger(Number(limit)) || limit < 1 || limit > 100) {
      setError('Limit harus antara 1-100');
      return;
    }
    setLoading(true);
    setError('');
    setCrawledData(null);
    setSaveError('');
    setSaveSuccess('');
    try {
      // Ambil token dari localStorage untuk Authorization
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Anda harus login untuk melakukan crawling.');
        setLoading(false);
        return;
      }
      const res = await fetch('/api/crawling/twitter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ keyword, limit })
      });
      let data;
      const text = await res.text();
      try {
        data = text ? JSON.parse(text) : {};
      } catch (e) {
        throw new Error('Response bukan JSON valid');
      }
      if (!res.ok) throw new Error(data.error || 'Gagal crawling data');
      // Normalisasi: gunakan struktur nested sesuai backend terbaru
      let arr = data.data || data.tweets || data.result || data;
      if (Array.isArray(arr)) {
        setCrawledData(arr);
      } else {
        setCrawledData([]);
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setCrawledData(null);
    } finally {
      setLoading(false);
    }
  };

  // Tombol "Simpan ke Database"
  const handleSave = async () => {
    if (alreadySaved) {
      setSaveError('Data sudah pernah disimpan.');
      setSaveSuccess('');
      setTimeout(() => setSaveError(''), 2000);
      return;
    }
    // DEBUG: Log data tweet yang akan dikirim ke backend
    console.log('[DEBUG] Data tweets yang akan disimpan:', crawledData);
    if (!Array.isArray(crawledData) || crawledData.length === 0) {
      setSaveError('Tidak ada data yang akan disimpan!');
      return;
    }
    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      // Ambil token dari localStorage untuk Authorization
      const token = localStorage.getItem('token');
      if (!token) {
        setSaveError('Anda harus login untuk menyimpan data.');
        setSaveLoading(false);
        return;
      }
      const res = await fetch('/api/crawling/twitter/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ tweets: crawledData, keyword })
      });
      let data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal simpan data');
      setSaveError('');
      setSaveSuccess('Data berhasil disimpan ke database!');
      setToastMessage('Data berhasil disimpan ke database!');
      setToastType('success');
      setShowToast(true);
      setAlreadySaved(true);
    } catch (err) {
      setSaveSuccess('');
      setSaveError(err.message);
      setToastMessage(err.message);
      setToastType('error');
      setShowToast(true);
      if (onError) onError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  // Hilangkan renderNotif, ganti dengan Toast

  return (
    <div className="w-full max-w-[98vw] mx-auto p-4">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
          <FaSearch className="text-blue-500 text-xl" /> Crawling Data Twitter/X
        </h1>
        <p className="text-gray-600 text-sm mt-1">Cari dan simpan data tweet dengan mudah. Gunakan filter di bawah untuk memulai crawling.</p>
      </div>
      {/* Toast Notification */}
      {showToast && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}

      {/* Form Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-4">
        <form onSubmit={handleCrawlApify} className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block font-semibold mb-1">Keyword</label>
            <input
              type="text"
              className="border px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Masukkan kata kunci"
              value={keyword}
              onChange={e => {
                setKeyword(e.target.value);
                setError('');
              }}
              autoFocus
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">Limit</label>
            <input
              type="number"
              min={1}
              max={100}
              className="border px-2 py-1 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={limit}
              onChange={e => {
                setLimit(Number(e.target.value));
                setError('');
              }}
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-md hover:bg-blue-700 transition min-w-[120px]"
            disabled={loading}
          >
            {loading ? (
              <>
                <ImSpinner2 className="animate-spin text-lg" />
                <span>Memproses...</span>
              </>
            ) : (
              <>
                <FaSearch className="text-base" />
                <span>Cari</span>
              </>
            )}
          </button>
          {/* Tombol Cari Baru hanya muncul jika sudah ada data crawling */}
        </form>
        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </div>

      {/* Semua blok data crawling di dalam satu parent div */}
      <div>
        {Array.isArray(crawledData) && crawledData.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <img src="/empty-state.svg" alt="Empty" className="w-32 mb-4" onError={e => {e.target.style.display='none'}} />
            <div className="text-lg">Belum ada data crawling.<br />Silakan lakukan pencarian.</div>
          </div>
        )}
        {crawledData && Array.isArray(crawledData) && crawledData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6 my-4 flex flex-col gap-6">
          <div className="w-full overflow-x-auto">
            <MuiDatasetCrawlTable rows={crawledData} />
          </div>
          <button
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold text-base shadow-md hover:bg-green-700 transition min-w-[180px] self-end"
            onClick={handleSave}
            disabled={saveLoading || alreadySaved}
          >
            {saveLoading ? (
              <>
                <ImSpinner2 className="animate-spin text-lg" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <FaCheckCircle className="text-base" />
                <span>Simpan ke Database</span>
              </>
            )}
          </button>
          {/* Catatan pengertian label tabel */}
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded text-xs md:text-sm max-w-2xl mt-4">
            <div className="font-semibold mb-1 text-yellow-800">Catatan Pengertian Label Tabel:</div>
            <ul className="list-disc pl-5 space-y-1 text-yellow-900">
              <li><b>Username</b>: Nama pengguna Twitter/X.</li>
              <li><b>Name</b>: Nama asli pemilik akun.</li>
              <li><b>Followers</b>: Jumlah pengikut akun.</li>
              <li><b>Following</b>: Jumlah akun yang diikuti.</li>
              <li><b>Tweet Text</b>: Isi/konten tweet.</li>
              <li><b>Tweet URL</b>: Link langsung ke tweet.</li>
              <li><b>Verified</b>: Status verifikasi akun.</li>
              <li><b>Likes</b>: Jumlah like pada tweet.</li>
              <li><b>Replies</b>: Jumlah balasan ke tweet.</li>
              <li><b>Retweets</b>: Jumlah retweet tweet.</li>
              <li><b>Quote Tweets</b>: Jumlah tweet kutipan.</li>
              <li><b>Language</b>: Bahasa tweet.</li>
              <li><b>Bio</b>: Deskripsi singkat akun.</li>
              <li><b>Profile Picture</b>: Foto profil akun.</li>
              <li><b>Location</b>: Lokasi user (jika diisi).</li>
              {/* Tambahkan label lain sesuai kebutuhan */}
            </ul>
            <div className="mt-2 text-yellow-700">Jika ada label yang kurang jelas, silakan arahkan kursor ke header tabel untuk melihat tooltip penjelasan.</div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}
export default DatasetCrawlForm;
