import React, { useEffect, useState } from 'react';
import Button from '../shared/Button';
import DataItemFormModal from './DataItemFormModal';
import Modal from '../shared/Modal';
import { FaUserShield } from 'react-icons/fa';

const DataItemTable = ({ datasetId, onSelect, showToast }) => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!datasetId) return;
    setLoading(true);
    fetch(`/api/data-item?dataset_id=${datasetId}`)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setLoading(false);
      });
  }, [datasetId, refresh]);

  const handleEdit = (item) => setEditData(item);
  const handleDelete = (item) => setDeleteData(item);
  const handleEditSuccess = (msg) => {
    setEditData(null);
    setRefresh(r => !r);
    if (showToast) showToast({ message: msg, type: 'success' });
  };
  const handleDeleteConfirm = async () => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/data-item/${deleteData.id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showToast) showToast({ message: 'Data item berhasil dihapus!', type: 'success' });
      } else {
        const data = await res.json();
        if (showToast) showToast({ message: data.error || 'Gagal menghapus data item', type: 'error' });
      }
      setDeleteData(null);
      setRefresh(r => !r);
    } finally {
      setModalLoading(false);
    }
  };

  if (!datasetId) return <div className="p-4 text-gray-500">Pilih dataset untuk melihat data item.</div>;

  return (
    <div className="overflow-x-auto rounded shadow bg-white mt-4">
      <div className="flex justify-between items-center p-4">
        <h3 className="font-bold">Data Item</h3>
        <Button color="accent" onClick={() => setEditData({ dataset_id: datasetId })}>Tambah Data Item</Button>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="px-4 py-2">Isi Data Item</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={2} className="text-center p-4">Memuat data...</td></tr>
          ) : items.length === 0 ? (
            <tr><td colSpan={2} className="text-center p-4">Tidak ada data item</td></tr>
          ) : (
            items.map(item => (
              <tr key={item.id} className="border-b">
                <td className="px-4 py-2 cursor-pointer hover:underline" onClick={() => onSelect(item)}>{(() => {
  const cleanUsername = (item.username || '').replace(/^@/, '').toLowerCase();
  const loginUsername = (localStorage.getItem('username') || '').toLowerCase();
  return cleanUsername === loginUsername ? (
    <span className="inline-flex items-center gap-1">
      {item.username}
      <span className="text-teal-600 align-middle hover:scale-110 hover:drop-shadow transition-transform ml-1" title="User Aktif"><FaUserShield /></span>
    </span>
  ) : item.username;
})()}</td>
                <td className="px-4 py-2">
                  <Button color="accent" size="sm" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                  <Button color="secondary" size="sm" onClick={() => handleDelete(item)}>Hapus</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Modal Edit/Tambah */}
      {editData && (
        <DataItemFormModal
          open={true}
          onClose={() => setEditData(null)}
          onSuccess={handleEditSuccess}
          data={editData}
        />
      )}
      {/* Modal Konfirmasi Hapus */}
      {deleteData && (
        <Modal onClose={() => setDeleteData(null)}>
          <div className="p-6">
            <div className="mb-4">Yakin ingin menghapus data item <b>{deleteData.value}</b>?</div>
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

export default DataItemTable;
