import React from 'react';
import DatasetTable from '../components/dataset/DatasetTable';
import DatasetFormModal from '../components/dataset/DatasetFormModal';
import DataItemTable from '../components/labeling/DataItemTable';
import LabelTable from '../components/labeling/LabelTable';
import Toast from '../components/shared/Toast';

const DatasetPage = () => {
  const [open, setOpen] = React.useState(false);
  const [refresh, setRefresh] = React.useState(false);
  const [toast, setToast] = React.useState(null);
  const [selectedDataset, setSelectedDataset] = React.useState(null);
  const [selectedDataItem, setSelectedDataItem] = React.useState(null);

  // Fungsi untuk trigger refresh tabel
  const handleAdded = (msg) => {
    setRefresh(r => !r);
    if (msg) setToast({ message: msg, type: 'success' });
  };
  const handleError = (msg) => setToast({ message: msg, type: 'error' });

  // DatasetTable: klik baris dataset untuk memilih
  const handleSelectDataset = (dataset) => {
    setSelectedDataset(dataset);
    setSelectedDataItem(null);
  };
  // DataItemTable: klik baris data item untuk memilih
  const handleSelectDataItem = (item) => setSelectedDataItem(item);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Dataset</h2>
        <button className="bg-accent text-white px-4 py-2 rounded shadow" onClick={() => setOpen(true)}>Tambah Dataset</button>
      </div>
      <DatasetTable refresh={refresh} showToast={setToast} onSelect={handleSelectDataset} />
      <DatasetFormModal open={open} onClose={() => setOpen(false)} onSuccess={() => handleAdded('Dataset berhasil ditambah!')} onError={handleError} />
      {selectedDataset && (
        <DataItemTable datasetId={selectedDataset.id} onSelect={handleSelectDataItem} showToast={setToast} />
      )}
      {selectedDataItem && (
        <LabelTable dataItemId={selectedDataItem.id} showToast={setToast} />
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default DatasetPage;
