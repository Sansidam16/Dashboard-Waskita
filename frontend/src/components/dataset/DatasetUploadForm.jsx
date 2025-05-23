import React, { useState } from 'react';

const ACCEPTED_FORMATS = ['.csv', '.xls', '.xlsx'];

function getExtension(fileName) {
  return fileName.slice(((fileName.lastIndexOf('.') - 1) >>> 0) + 2).toLowerCase();
}

const DatasetUploadForm = ({ onSuccess, onError }) => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    setError('');
    setPreview([]);
    const f = e.target.files[0];
    if (!f) return;
    const ext = '.' + getExtension(f.name);
    if (!ACCEPTED_FORMATS.includes(ext)) {
      setError('Format file tidak didukung. Hanya .csv, .xls, .xlsx.');
      setFile(null);
      return;
    }
    setFile(f);
    // Preview CSV: hanya tampilkan 5 baris pertama
    const reader = new FileReader();
    reader.onload = function(event) {
      const text = event.target.result;
      const lines = text.split(/\r?\n/).slice(0, 5);
      setPreview(lines.map(l => l.split(',')));
    };
    if (ext === '.csv') {
      reader.readAsText(f);
    } else {
      setPreview([['Preview hanya untuk file CSV']]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setError('');
    if (!file) {
      setError('Pilih file terlebih dahulu!');
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/dataset/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload gagal');
      if (onSuccess) onSuccess('Data berhasil diupload dan disimpan!');
      setFile(null);
      setPreview([]);
    } catch (err) {
      setError(err.message);
      if (onError) onError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 bg-white rounded shadow p-6" onSubmit={handleUpload}>
      <div>
        <label className="block font-semibold mb-1">Unggah File Dataset</label>
        <input
          type="file"
          accept={ACCEPTED_FORMATS.join(',')}
          onChange={handleFileChange}
          className="block w-full border rounded px-3 py-2"
        />
        <div className="text-xs text-gray-600 mt-1">Format yang diperbolehkan: .csv, .xls, .xlsx. Baris pertama = header. Data teks utama di kolom pertama.</div>
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {preview.length > 0 && (
        <div className="overflow-x-auto border rounded bg-gray-50 p-2 mt-2">
          <div className="font-semibold mb-1">Preview Data (5 baris pertama):</div>
          <table className="min-w-full text-xs">
            <tbody>
              {preview.map((row, i) => (
                <tr key={i}>{row.map((cell, j) => <td key={j} className="px-2 py-1 border-b">{cell}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <button type="submit" className="bg-accent text-white px-6 py-2 rounded font-bold text-lg w-full mt-2 shadow-md hover:bg-accent-dark transition" disabled={loading}>
        {loading ? 'Menyimpan...' : 'Simpan ke Database'}
      </button>
    </form>
  );
};

export default DatasetUploadForm;
