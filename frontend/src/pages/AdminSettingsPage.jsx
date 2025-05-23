import React, { useState } from 'react';

function AdminSettingsPage() {


  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  // State untuk tambah user
  const [addUserLoading, setAddUserLoading] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [toast, setToast] = useState({ open: false, message: '' });
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });

  // Ambil data user saat mount
  // Buat fetchUsers agar bisa dipanggil dari aksi manapun
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data);
      } else {
        setUsers([]);
      }
    } catch {
      setUsers([]);
    }
    setLoadingUsers(false);
  };
  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Yakin ingin menghapus user ini?')) return;
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ open: true, message: 'User berhasil dihapus!' });
        setTimeout(() => setToast({ open: false, message: '' }), 2000);
        setUsers(users.filter(u => u.id !== id));
        if (typeof fetchUsers === 'function') fetchUsers();
      } else {
        setMessage(data.message || 'Gagal menghapus user!');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan: ' + err.message);
    }
    setLoading(false);
  };

  const handleResetPassword = async (id) => {
    const newPassword = window.prompt('Masukkan password baru untuk user ini:');
    if (!newPassword) return;
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}/reset-password`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ open: true, message: 'Password berhasil direset!' });
        setTimeout(() => setToast({ open: false, message: '' }), 2000);
        await fetchUsers();
      } else {
        setMessage(data.message || 'Gagal reset password!');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan: ' + err.message);
    }
    setLoading(false);
  };

  const handleUpdateRole = async (id, isAdmin) => {
    if (!window.confirm('Yakin ingin mengubah role user ini?')) return;
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/users/${id}/update-role`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isAdmin })
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ open: true, message: 'Role user berhasil diubah!' });
        setTimeout(() => setToast({ open: false, message: '' }), 2000);
        await fetchUsers();
      } else {
        setMessage(data.message || 'Gagal mengubah role!');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan: ' + err.message);
    }
    setLoading(false);
  };

  const [stats, setStats] = useState(null);
  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/users/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          setStats(await res.json());
        }
      } catch {}
    };
    fetchStats();
  }, []);

  const handleDeleteAllUsers = async () => {
    if (!window.confirm('Yakin ingin menghapus SEMUA user? Tindakan ini tidak bisa dibatalkan!')) return;
    setLoading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ open: true, message: 'Semua user berhasil dihapus!' });
        setTimeout(() => setToast({ open: false, message: '' }), 2000);
        setUsers([]); // Kosongkan tabel user setelah dihapus
        await fetchUsers();
      } else {
        setMessage(data.message || 'Gagal menghapus user!');
      }
    } catch (err) {
      setMessage('Terjadi kesalahan: ' + err.message);
    }
    setLoading(false);
  };


  // Handler tambah user
  const handleAddUser = async (e) => {
    e.preventDefault();
    setAddUserError('');
    setAddUserLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ open: true, message: 'User berhasil ditambahkan!' });
        setTimeout(() => setToast({ open: false, message: '' }), 2000);
        setNewUser({ username: '', email: '', password: '' });
        // Refresh user list dari server agar data up-to-date
        await fetchUsers();
      } else {
        setAddUserError(data.message || 'Gagal menambah user!');
      }
    } catch (err) {
      setAddUserError('Terjadi kesalahan: ' + err.message);
    }
    setAddUserLoading(false);
  };

  return (
    <>
      {/* TOAST NOTIFIKASI */}
      {toast.open && (
        <div className="fixed left-1/2 bottom-8 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded shadow-lg animate-fade-in-out transition-all duration-300 text-center text-base min-w-[220px]">
          {toast.message}
        </div>
      )}
      <div className="max-w-7xl mx-auto p-8 bg-white rounded shadow mt-8 mb-20">
        <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
      {/* Form Tambah User */}
      <form onSubmit={handleAddUser} className="mb-8 p-4 bg-gray-50 rounded shadow flex flex-col gap-2">
        <h3 className="text-lg font-semibold mb-2">Tambah User Baru</h3>
        <div className="flex flex-col md:flex-row gap-2 md:items-center">
          <input
            type="text"
            className="border px-3 py-2 rounded w-full md:w-1/4"
            placeholder="Username"
            value={newUser.username}
            onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))}
            required
            autoComplete="username"
          />
          <input
            type="email"
            className="border px-3 py-2 rounded w-full md:w-1/3"
            placeholder="Email"
            value={newUser.email}
            onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
            required
            autoComplete="email"
          />
          <input
            type="password"
            className="border px-3 py-2 rounded w-full md:w-1/4"
            placeholder="Password"
            required
            autoComplete="new-password"
            value={newUser.password}
            onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))}
          />
          <button
            type="submit"
            className="bg-green-600 text-white px-3 py-2 rounded font-semibold hover:bg-green-700 transition flex items-center text-sm gap-2 min-w-[130px]"
            disabled={addUserLoading}
          >
            {/* Spinner jika loading */}
            {addUserLoading && (
              <svg className="animate-spin h-4 w-4 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
            )}
            {/* Icon plus */}
            <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
            Tambah User
          </button>
        </div>
      </form>

      {loadingUsers ? (
        <div className="w-full text-center py-8 text-gray-400">Memuat data user...</div>
      ) : (
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="py-3 px-6">Username</th>
              <th scope="col" className="py-3 px-6">Email</th>
              <th scope="col" className="py-3 px-6 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} className="bg-white border-b">
                <td className="py-1 px-3 border">
                  {user.username}
                  {user.is_admin && (
                    <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-yellow-300 text-yellow-900 align-middle">Admin</span>
                  )}
                </td>
                <td className="py-1 px-3 border">{user.email}</td>
                <td className="py-1 px-3 border text-center align-middle">
                  <div className="inline-flex flex-row justify-center items-center gap-1">
                    <button
                      onClick={() => handleResetPassword(user.id)}
                      className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-1 py-1 rounded font-semibold transition flex items-center text-xs gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 11V7a5 5 0 00-10 0v4m12 4v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5" /></svg>
                      Reset
                    </button>
                    <button
                      onClick={() => handleUpdateRole(user.id, !user.is_admin)}
                      className={`bg-blue-500 hover:bg-blue-600 text-white px-1 py-1 rounded font-semibold transition flex items-center text-xs gap-1`}
                    >
                      {user.is_admin ? (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3a6 6 0 01-12 0V9" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 9V7a5 5 0 0110 0v2" /></svg>
                          User
                        </>
                      ) : (
                        <>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                          Admin
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-1 py-1 rounded font-semibold transition flex items-center text-xs gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        onClick={handleDeleteAllUsers}
        className="bg-red-600 hover:bg-red-700 text-white px-2 py-1 rounded font-semibold transition mr-4 flex items-center text-xs gap-1"
        disabled={loading}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        {loading ? 'Menghapus...' : 'Hapus Semua User'}
      </button>
      {message && <div className="mt-4 text-center text-lg font-medium text-red-600">{message}</div>}
    </div>
    </>
  );
}

export default AdminSettingsPage;
