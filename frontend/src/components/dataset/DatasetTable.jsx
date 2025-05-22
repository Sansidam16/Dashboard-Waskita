import React, { useState, useEffect } from 'react';
import DatasetActions from './DatasetActions';
import DatasetFormModal from './DatasetFormModal';
import Modal from '../shared/Modal';

const DatasetTable = ({ refresh }) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [internalRefresh, setInternalRefresh] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/dataset')
      .then(res => res.json())
      .then(data => {
        setDatasets(data);
        setLoading(false);
      });
  }, [refresh, internalRefresh]);

  const handleEdit = (dataset) => setEditData(dataset);
  const handleDelete = (dataset) => setDeleteData(dataset);
  const handleEditSuccess = () => {
    setEditData(null);
    setInternalRefresh(r => !r);
  };
  const handleDeleteConfirm = async () => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/dataset/${deleteData.id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showToast) showToast({ message: 'Dataset berhasil dihapus!', type: 'success' });
      } else {
        const data = await res.json();
        if (showToast) showToast({ message: data.error || 'Gagal menghapus dataset', type: 'error' });
      }
      setDeleteData(null);
      setInternalRefresh(r => !r);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className="overflow-x-auto rounded shadow bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="px-4 py-2">Nama Dataset</th>
            <th className="px-4 py-2">Jumlah Item</th>
            <th className="px-4 py-2">Tanggal Dibuat</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={4} className="text-center p-4">Memuat data...</td></tr>
          ) : datasets.length === 0 ? (
            <tr><td colSpan={4} className="text-center p-4">Tidak ada data</td></tr>
          ) : (
            datasets.map(ds => (
              <tr key={ds.id} className="border-b">
                <td className="px-4 py-2">{ds.name}</td>
                <td className="px-4 py-2">{ds.items ?? ds.jumlah_item ?? '-'}</td>
                <td className="px-4 py-2">{ds.created_at}</td>
                <td className="px-4 py-2">
                  <DatasetActions dataset={ds} onEdit={handleEdit} onDelete={handleDelete} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Modal Edit */}
      {editData && (
        <DatasetFormModal
          open={true}
          onClose={() => setEditData(null)}
          onSuccess={handleEditSuccess}
          editData={editData}
        />
      )}
      {/* Modal Konfirmasi Hapus */}
      {deleteData && (
        <Modal onClose={() => setDeleteData(null)}>
          <div className="p-6">
            <div className="mb-4">Yakin ingin menghapus dataset <b>{deleteData.name}</b>?</div>
            <div className="flex justify-end space-x-2">
              <button className="bg-secondary text-white px-4 py-2 rounded" onClick={() => setDeleteData(null)} disabled={modalLoading}>Batal</button>
              <button className="bg-red-600 text-white px-4 py-2 rounded" onClick={handleDeleteConfirm} disabled={modalLoading}>{modalLoading ? 'Menghapus...' : 'Hapus'}</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default DatasetTable;
