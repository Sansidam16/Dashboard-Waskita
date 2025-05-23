import React from 'react';
import DatasetTable from '../components/dataset/DatasetTable';
import Toast from '../components/shared/Toast';

const DatasetSavedPage = () => {
  const [refresh, setRefresh] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  return (
    <div className="max-w-5xl mx-auto px-2 md:px-0 py-6">
      <h2 className="text-2xl font-bold text-primary mb-6">Data Saved</h2>
      <DatasetTable refresh={refresh} showToast={setToast} />
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};
export default DatasetSavedPage;
