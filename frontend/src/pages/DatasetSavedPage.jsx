import React, { useEffect, useState } from 'react';
import DatasetTable from '../components/dataset/DatasetTable';
import Toast from '../components/shared/Toast';
import EmptyState from '../components/shared/EmptyState';

const DatasetSavedPage = () => {
  const [refresh] = useState(false);
  const [toast, setToast] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token');
    fetch('/api/datasets', {
      headers: token ? { 'Authorization': `Bearer ${token}` } : {}
    })
      .then(async res => {
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success && Array.isArray(data.datasets)) {
          setDatasets(data.datasets);
        } else {
          setDatasets([]);
          if (data.error && setToast) setToast({ message: data.error, type: 'error' });
        }
        setLoading(false);
      })
      .catch(err => {
        setDatasets([]);
        if (setToast) setToast({ message: err.message || 'Gagal mengambil data dataset', type: 'error' });
        setLoading(false);
      });
  }, [refresh]);

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0 py-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Data Saved</h2>
      {loading ? (
        <div className="text-center text-gray-400 py-12">Memuat data...</div>
      ) : datasets.length === 0 ? (
        <EmptyState message="Belum ada data dataset tersimpan. Silakan crawling atau upload dataset." />
      ) : (
        <DatasetTable datasets={datasets} showToast={setToast} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
export default DatasetSavedPage;
