import React, { useEffect, useState } from 'react';
import Button from '../shared/Button';
import LabelFormModal from './LabelFormModal';
import Modal from '../shared/Modal';

const LabelTable = ({ dataItemId, showToast }) => {
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (!dataItemId) return;
    setLoading(true);
    fetch(`/api/label?data_item_id=${dataItemId}`)
      .then(res => res.json())
      .then(data => {
        setLabels(data);
        setLoading(false);
      });
  }, [dataItemId, refresh]);

  const handleEdit = (label) => setEditData(label);
  const handleDelete = (label) => setDeleteData(label);
  const handleEditSuccess = (msg) => {
    setEditData(null);
    setRefresh(r => !r);
    if (showToast) showToast({ message: msg, type: 'success' });
  };
  const handleDeleteConfirm = async () => {
    setModalLoading(true);
    try {
      const res = await fetch(`/api/label/${deleteData.id}`, { method: 'DELETE' });
      if (res.ok) {
        if (showToast) showToast({ message: 'Label berhasil dihapus!', type: 'success' });
      } else {
        const data = await res.json();
        if (showToast) showToast({ message: data.error || 'Gagal menghapus label', type: 'error' });
      }
      setDeleteData(null);
      setRefresh(r => !r);
    } finally {
      setModalLoading(false);
    }
  };

  if (!dataItemId) return <div className="p-4 text-gray-500">Pilih data item untuk melihat label.</div>;

  return (
    <div className="overflow-x-auto rounded shadow bg-white mt-4">
      <div className="flex justify-between items-center p-4">
        <h3 className="font-bold">Label</h3>
        <Button color="accent" onClick={() => setEditData({ data_item_id: dataItemId })}>Tambah Label</Button>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="px-4 py-2">Isi Label</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={2} className="text-center p-4">Memuat data...</td></tr>
          ) : labels.length === 0 ? (
            <tr><td colSpan={2} className="text-center p-4">Tidak ada label</td></tr>
          ) : (
            labels.map(label => (
              <tr key={label.id} className="border-b">
                <td className="px-4 py-2">{label.value}</td>
                <td className="px-4 py-2">
                  <Button color="accent" size="sm" onClick={() => handleEdit(label)}>Edit</Button>{' '}
                  <Button color="secondary" size="sm" onClick={() => handleDelete(label)}>Hapus</Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Modal Edit/Tambah */}
      {editData && (
        <LabelFormModal
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
            <div className="mb-4">Yakin ingin menghapus label <b>{deleteData.value}</b>?</div>
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

export default LabelTable;
