import React, { useState } from 'react';
import DatasetCrawlForm from '../components/dataset/DatasetCrawlForm';
import DatasetUploadForm from '../components/dataset/DatasetUploadForm';
import DatasetTable from '../components/dataset/DatasetTable';
import Toast from '../components/shared/Toast';
import { FaSearch, FaUpload, FaDatabase } from 'react-icons/fa';

const DatasetPage = () => {
  const [submenu, setSubmenu] = useState('crawl'); // crawl | upload | saved
  const [refresh, setRefresh] = useState(false);
  const [toast, setToast] = useState(null);

  const submenuOptions = [
    {
      value: 'crawl',
      label: 'Crawling Data',
      icon: <FaSearch className="inline mr-2 mb-1 text-accent" />,
      desc: 'Ambil data langsung dari sumber (misal: Twitter) berdasarkan kata kunci, dengan batas jumlah postingan. Data akan langsung disimpan ke database.'
    },
    {
      value: 'upload',
      label: 'Unggah Data',
      icon: <FaUpload className="inline mr-2 mb-1 text-accent" />,
      desc: 'Unggah dataset dari file (.csv, .xls, .xlsx) yang sudah Anda miliki. Pastikan format file sesuai instruksi.'
    },
    {
      value: 'saved',
      label: 'Data Saved',
      icon: <FaDatabase className="inline mr-2 mb-1 text-accent" />,
      desc: 'Lihat, filter, dan kelola seluruh dataset yang sudah tersimpan di database, baik hasil crawling maupun upload.'
    }
  ];

  const handleSuccess = (msg) => {
    setRefresh(r => !r);
    if (msg) setToast({ message: msg, type: 'success' });
  };
  const handleError = (msg) => setToast({ message: msg, type: 'error' });

  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0 py-8">
      <h2 className="text-3xl font-bold text-primary mb-8">Dataset</h2>
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
        <label htmlFor="submenu" className="font-semibold text-gray-700">Pilih Fitur Dataset:</label>
        <div className="relative w-full md:w-72">
          <select
            id="submenu"
            className="border rounded px-4 py-2 text-lg shadow-sm focus:ring-accent focus:border-accent w-full appearance-none pr-10"
            value={submenu}
            onChange={e => setSubmenu(e.target.value)}
            style={{fontWeight: 'bold'}}
          >
            {submenuOptions.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-3 pointer-events-none">
            {submenuOptions.find(opt => opt.value === submenu)?.icon}
          </span>
        </div>
      </div>
      <div className="mb-8 text-gray-600 text-sm bg-gray-50 rounded px-4 py-3 border border-gray-100 flex items-center gap-2">
        {submenuOptions.find(opt => opt.value === submenu)?.icon}
        <span>{submenuOptions.find(opt => opt.value === submenu)?.desc}</span>
      </div>
      {submenu === 'crawl' && (
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-accent">Crawling Data</h3>
          <DatasetCrawlForm onSuccess={handleSuccess} onError={handleError} />
        </section>
      )}
      {submenu === 'upload' && (
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-accent">Unggah Data</h3>
          <DatasetUploadForm onSuccess={handleSuccess} onError={handleError} />
        </section>
      )}
      {submenu === 'saved' && (
        <section className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4 text-accent">Data Saved</h3>
          <DatasetTable refresh={refresh} showToast={setToast} />
        </section>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default DatasetPage;
