import React from 'react';
import Modal from '../shared/Modal';

const DatasetFormModal = ({ open, onClose, onSuccess, editData }) => {
  const [name, setName] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setName(editData ? editData.name : "");
      setError("");
    }
  }, [open, editData]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      let res, data;
      if (editData) {
        res = await fetch(`/api/dataset/${editData.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
      } else {
        res = await fetch('/api/dataset', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name })
        });
      }
      data = await res.json();
      if (!res.ok) throw new Error(data.error || (editData ? 'Gagal mengubah dataset' : 'Gagal menambah dataset'));
      if (onSuccess) onSuccess(editData ? 'Dataset berhasil diubah!' : 'Dataset berhasil ditambah!');
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
        <h3 className="text-lg font-bold mb-4">{editData ? 'Edit Dataset' : 'Tambah Dataset'}</h3>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full border rounded px-3 py-2"
            placeholder="Nama Dataset"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button type="button" className="bg-secondary text-white px-4 py-2 rounded" onClick={onClose} disabled={loading}>Batal</button>
            <button type="submit" className="bg-accent text-white px-4 py-2 rounded" disabled={loading}>{loading ? (editData ? 'Menyimpan...' : 'Menyimpan...') : (editData ? 'Simpan Perubahan' : 'Simpan')}</button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default DatasetFormModal;
