import React, { useState } from 'react';
import { FaSearch, FaCheckCircle, FaUserShield } from 'react-icons/fa';
import { ImSpinner2 } from 'react-icons/im';

const DATA_TYPES = [
  { label: 'Username', value: 'username' },
  { label: 'Post Teks', value: 'post_teks' },
  { label: 'URL', value: 'url' },
  { label: 'Like', value: 'like' },
  { label: 'Retweet', value: 'retweet' },
  { label: 'Lokasi', value: 'lokasi' },
];

const DatasetCrawlForm = ({ onSuccess, onError }) => {
  const [keyword, setKeyword] = useState('');
  const [limit, setLimit] = useState(10); // default 10 agar konsisten dengan backend
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [crawledData, setCrawledData] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [saveSuccess, setSaveSuccess] = useState('');

  // Konfigurasi Apify Dataset (hardcoded sesuai instruksi)
  const datasetId = 'RXdjZmshtzELc18j1';
  const apifyToken = 'apify_api_KcClC67c1OfmSkJWKVqiFVf5QWgKX72am5OG';

  // Tombol "Cari Data" dari X API
  const handleCrawl = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCrawledData(null);
    setSaveError('');
    setSaveSuccess('');
    try {
      const res = await fetch('/api/crawling/twitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setCrawledData(data.data || data.tweets || data.result || data); // data hasil crawling
    } catch (err) {
      setError(err.message);
      setCrawledData(null);
    } finally {
      setLoading(false);
    }
  };

  // Tombol "Cari Data" dari Apify Dataset Items
  const handleCrawlApify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setCrawledData(null);
    setSaveError('');
    setSaveSuccess('');
    try {
      const res = await fetch('/api/crawling/twitter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
      setCrawledData(data.data || data.tweets || data.result || data);
    } catch (err) {
      setError(err.message);
      setCrawledData(null);
    } finally {
      setLoading(false);
    }
  };


  // Tombol "Simpan ke Database"
  const handleSave = async () => {
    if (!crawledData) return;
    setSaveLoading(true);
    setSaveError('');
    setSaveSuccess('');
    try {
      const res = await fetch('/api/dataset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: crawledData, keyword, maxCount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal simpan data');
      setSaveSuccess('Data berhasil disimpan ke database!');
      setCrawledData(null);
      setKeyword('');
      setMaxCount(100);
      if (onSuccess) onSuccess('Data hasil crawling berhasil disimpan!');
    } catch (err) {
      setSaveError(err.message);
      if (onError) onError(err.message);
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <form onSubmit={handleCrawlApify} className="space-y-4">
      <div>
        <label className="block font-semibold">Keyword:</label>
        <input
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          className="border rounded w-full px-2 py-1"
          required
        />
      </div>
      <div>
        <label className="block font-semibold">Banyak Data (limit):</label>
        <input
          type="number"
          min={1}
          max={1000}
          value={limit}
          onChange={e => setLimit(Number(e.target.value))}
          className="border rounded w-full px-2 py-1"
          required
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full font-semibold text-base shadow-md hover:bg-blue-700 transition w-fit min-w-[120px] mx-auto"
        style={{ minWidth: 120 }}
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
      {crawledData && Array.isArray(crawledData) && (
        <div className="mt-6 p-4 rounded-lg shadow-lg bg-gray-50 border mx-1 md:mx-2 w-full" style={{marginLeft: '0.5rem', marginRight: '0.5rem', maxWidth: '100%'}}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
            <h3 className="font-bold text-lg mb-1 md:mb-0">Hasil Crawling</h3>
            <span className="text-gray-500 text-xs md:text-sm">Jumlah data: <span className="font-semibold text-blue-700">{crawledData.length}</span></span>
          </div>
          {crawledData.length === 0 ? (
            <div className="text-gray-500 text-center">Tidak ada data ditemukan.</div>
          ) : (
            <div className="overflow-x-auto" style={{ maxHeight: '400px' }}>
              <div className="min-w-full w-full max-w-7xl">
                <table className="w-full text-xs md:text-sm border-collapse">
                  <thead className="bg-blue-50 sticky top-0 z-10">
                    <tr>
                      {Object.keys(crawledData[0]).map((key) => (
                        <th key={key} className="px-2 py-2 border-b font-bold text-gray-700 whitespace-nowrap text-xs md:text-sm text-center bg-blue-50">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {crawledData.map((item, idx) => (
                      <tr key={idx} className="even:bg-gray-100 hover:bg-blue-50 transition">
                        {Object.keys(crawledData[0]).map((key) => (
                          <td key={key} className="px-2 py-1 border-b whitespace-nowrap max-w-xs truncate text-center" title={typeof item[key] === 'string' ? item[key] : JSON.stringify(item[key])}>
                            {key === 'username' && item['username'] ? (
                              <span className="inline-flex items-center gap-1 justify-center">
                                {item['username']}
                                {/* Icon verified */}
                                {item['verified'] && (
                                  <span className="text-blue-500 align-middle" title="Verified"><FaCheckCircle /></span>
                                )}
                                {/* Icon user aktif */}
                                {(() => {
                                  const loginUsername = (typeof window !== 'undefined' && localStorage.getItem('username')) || '';
                                  // username di tabel biasanya ada '@', username login biasanya tanpa '@', bandingkan lowercase
                                  const cleanUsername = (item['username'] || '').replace(/^@/, '').toLowerCase();
                                  return cleanUsername === loginUsername.toLowerCase() ? (
                                    <span className="text-teal-600 align-middle hover:scale-110 hover:drop-shadow transition-transform" title="User Aktif"><FaUserShield /></span>
                                  ) : null;
                                })()}
                              </span>
                            ) : (
                              typeof item[key] === 'string' ? item[key] : JSON.stringify(item[key])
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          <div className="flex flex-col md:flex-row md:justify-end gap-2 mt-4">
            <button
              className="bg-green-600 text-white px-6 py-2 rounded font-bold text-lg shadow-md hover:bg-green-700 transition flex items-center gap-2"
              onClick={handleSave}
              disabled={saveLoading}
            >
              <span className="inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16v2a2 2 0 01-2 2H9a2 2 0 01-2-2v-2M7 10V6a2 2 0 012-2h6a2 2 0 012 2v4M7 10h10M7 10v4m10-4v4" /></svg>
              </span>
              {saveLoading ? 'Menyimpan...' : 'Simpan ke Database'}
            </button>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded font-bold text-lg shadow-md hover:bg-blue-600 transition flex items-center gap-2"
              type="button"
              onClick={() => {
                setKeyword('');
                setLimit(100);
                setCrawledData(null);
                setSaveError('');
                setSaveSuccess('');
              }}
            >
              <span className="inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582A2.997 2.997 0 017 9h10a3 3 0 012.418 1.418H20V4a2 2 0 00-2-2H6a2 2 0 00-2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 15v5a2 2 0 002 2h12a2 2 0 002-2v-5" /></svg>
              </span>
              Cari Baru
            </button>
          </div>
          {saveError && <div className="text-red-500 text-sm mt-2">{saveError}</div>}
          {saveSuccess && <div className="text-green-600 text-sm mt-2">{saveSuccess}</div>}
        </div>
      )}
    </form>
  );
};

export default DatasetCrawlForm;
