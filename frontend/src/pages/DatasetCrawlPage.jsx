import React from 'react';
import DatasetCrawlForm from '../components/dataset/DatasetCrawlForm';
import Toast from '../components/shared/Toast';

const DatasetCrawlPage = () => {
  const [refresh, setRefresh] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const handleSuccess = (msg) => {
    setRefresh(r => !r);
    if (msg) setToast({ message: msg, type: 'success' });
  };
  const handleError = (msg) => setToast({ message: msg, type: 'error' });
  return (
    <div className="max-w-3xl mx-auto px-2 md:px-0 py-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Crawling Data</h2>
      <DatasetCrawlForm onSuccess={handleSuccess} onError={handleError} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
export default DatasetCrawlPage;
