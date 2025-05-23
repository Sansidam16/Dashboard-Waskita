import React, { useState, useEffect } from 'react';
import DatasetActions from './DatasetActions';
import DatasetFormModal from './DatasetFormModal';
import Modal from '../shared/Modal';
import { FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const PAGE_SIZE = 10;

const DatasetTable = ({ refresh, showToast }) => {
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editData, setEditData] = useState(null);
  const [deleteData, setDeleteData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [internalRefresh, setInternalRefresh] = useState(false);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filterSource, setFilterSource] = useState('');

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

  // Filtering, searching, and pagination
  let filtered = datasets.filter(ds =>
    (!filterSource || ds.source === filterSource) &&
    (ds.keyword?.toLowerCase().includes(search.toLowerCase()) ||
     ds.name?.toLowerCase().includes(search.toLowerCase()) ||
     ds.filename?.toLowerCase().includes(search.toLowerCase()) ||
     String(ds.id).includes(search))
  );
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;
  const pagedData = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);

  useEffect(() => { setPage(1); }, [search, filterSource, datasets.length]);

  return (
    <div className="overflow-x-auto rounded shadow bg-white p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
        <div className="flex gap-2 items-center">
          <input
            className="border rounded px-2 py-1 text-sm"
            placeholder="Cari cepat..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="border rounded px-2 py-1 text-sm"
            value={filterSource}
            onChange={e => setFilterSource(e.target.value)}
          >
            <option value="">Semua Sumber</option>
            <option value="crawling">Crawling</option>
            <option value="upload">Upload</option>
          </select>
        </div>
        <div className="text-xs text-gray-500">Total: {filtered.length} data</div>
      </div>
      <table className="min-w-full text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="px-2 py-2">ID</th>
            <th className="px-2 py-2">Sumber Data</th>
            <th className="px-2 py-2">Keyword/Nama File</th>
            <th className="px-2 py-2">Jumlah Record</th>
            <th className="px-2 py-2">Tanggal Simpan</th>
            <th className="px-2 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={6} className="text-center p-4">Memuat data...</td></tr>
          ) : pagedData.length === 0 ? (
            <tr><td colSpan={6} className="text-center p-4">Tidak ada data</td></tr>
          ) : (
            pagedData.map(ds => (
              <tr key={ds.id} className="border-b hover:bg-gray-50">
                <td className="px-2 py-2 text-center">{ds.id}</td>
                <td className="px-2 py-2 text-center capitalize">{ds.source || '-'}</td>
                <td className="px-2 py-2">{ds.keyword || ds.filename || ds.name || '-'}</td>
                <td className="px-2 py-2 text-center">{ds.record_count ?? ds.items ?? ds.jumlah_item ?? '-'}</td>
                <td className="px-2 py-2 text-center">{ds.created_at?.slice(0, 10) || '-'}</td>
                <td className="px-2 py-2 flex gap-1 justify-center">
                  <button title="Lihat" className="p-1 rounded hover:bg-primary/10" onClick={() => alert('Fitur lihat detail coming soon')}><FaEye className="text-primary" /></button>
                  <button title="Edit" className="p-1 rounded hover:bg-accent/10" onClick={() => handleEdit(ds)}><FaEdit className="text-accent" /></button>
                  <button title="Hapus" className="p-1 rounded hover:bg-red-100" onClick={() => handleDelete(ds)}><FaTrash className="text-red-600" /></button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination */}
      <div className="flex justify-between items-center mt-3">
        <div className="text-xs text-gray-500">Halaman {page} dari {totalPages}</div>
        <div className="flex gap-1">
          <button disabled={page===1} className="px-2 py-1 text-xs rounded bg-gray-200 disabled:opacity-50" onClick={()=>setPage(page-1)}>Prev</button>
          <button disabled={page===totalPages} className="px-2 py-1 text-xs rounded bg-gray-200 disabled:opacity-50" onClick={()=>setPage(page+1)}>Next</button>
        </div>
      </div>
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
            <div className="mb-4">Yakin ingin menghapus dataset <b>{deleteData.keyword || deleteData.filename || deleteData.name}</b>?</div>
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
