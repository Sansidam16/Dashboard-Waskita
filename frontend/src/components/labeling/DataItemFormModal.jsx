import React from 'react';
import Modal from '../shared/Modal';

const DataItemFormModal = ({ open, onClose, onSuccess, data }) => {
  const [value, setValue] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (open) {
      setValue(data && data.value ? data.value : '');
      setError('');
    }
  }, [open, data]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      let res, result;
      if (data && data.id) {
        res = await fetch(`/api/data-item/${data.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value })
        });
      } else {
        res = await fetch('/api/data-item', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dataset_id: data.dataset_id, value })
        });
      }
      result = await res.json();
      if (!res.ok) throw new Error(result.error || (data.id ? 'Gagal mengubah data item' : 'Gagal menambah data item'));
      if (onSuccess) onSuccess(data.id ? 'Data item berhasil diubah!' : 'Data item berhasil ditambah!');
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-4">{data && data.id ? 'Edit Data Item' : 'Tambah Data Item'}</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Isi Data Item"
            value={value}
            onChange={e => setValue(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-secondary text-white px-4 py-2 rounded" onClick={onClose} disabled={loading}>Batal</button>
            <button type="submit" className="bg-accent text-white px-4 py-2 rounded" disabled={loading}>{loading ? 'Menyimpan...' : (data && data.id ? 'Simpan Perubahan' : 'Simpan')}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DataItemFormModal;
