import React, { useState } from 'react';

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
  const [maxCount, setMaxCount] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/dataset/crawl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, maxCount })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Gagal crawling data');
      if (onSuccess) onSuccess('Data hasil crawling berhasil disimpan!');
      setKeyword('');
      setMaxCount(100);
    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 bg-white rounded shadow p-6" onSubmit={handleSubmit}>
      <div>
        <label className="block font-semibold mb-1">Keyword Pencarian</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="text"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          placeholder="Masukkan keyword..."
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Batas Maksimal Pengambilan Postingan</label>
        <input
          className="w-full border rounded px-3 py-2"
          type="number"
          min={1}
          max={1000}
          value={maxCount}
          onChange={e => setMaxCount(Number(e.target.value))}
          required
        />
      </div>
      <div>
        <label className="block font-semibold mb-1">Tipe Data yang Diambil</label>
        <div className="flex flex-wrap gap-3">
          {DATA_TYPES.map(dt => (
            <label key={dt.value} className="flex items-center gap-2">
              <input type="checkbox" checked readOnly />
              <span>{dt.label}</span>
            </label>
          ))}
        </div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button type="submit" className="bg-accent text-white px-6 py-2 rounded font-bold text-lg w-full mt-2 shadow-md hover:bg-accent-dark transition" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan ke Database'}
      </button>
    </form>
  );
};

export default DatasetCrawlForm;
