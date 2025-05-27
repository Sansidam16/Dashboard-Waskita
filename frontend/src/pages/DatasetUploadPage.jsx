import React, { useState } from 'react';
import DatasetUploadForm from '../components/dataset/DatasetUploadForm';
import Toast from '../components/shared/Toast';
import EmptyState from '../components/shared/EmptyState';

const DatasetUploadPage = () => {
  const [toast, setToast] = useState(null);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);

  const handleSuccess = (msg) => {
    if (msg) setToast({ message: msg, type: 'success' });
    setFile(null);
    setPreview([]);
  };
  const handleError = (msg) => setToast({ message: msg, type: 'error' });

  // Custom handler for DatasetUploadForm to lift file/preview state up
  const handleFileChange = (f, p) => {
    setFile(f);
    setPreview(p);
  };

  return (
    <div className="max-w-3xl mx-auto px-2 md:px-0 py-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Unggah Data</h2>
      {(!file && preview.length === 0) ? (
        <EmptyState message="Belum ada file dataset yang diupload. Silakan pilih file untuk diunggah." />
      ) : (
        <DatasetUploadForm onSuccess={handleSuccess} onError={handleError} onFileChange={handleFileChange} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
export default DatasetUploadPage;
