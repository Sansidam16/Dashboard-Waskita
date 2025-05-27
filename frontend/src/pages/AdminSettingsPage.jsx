import React, { useState } from 'react';
import EmptyState from '../components/shared/EmptyState';
import Toast from '../components/shared/Toast';

function AdminSettingsPage() {
  // Untuk animasi statistik cards
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);


  const [loading, setLoading] = useState(false);
  // const [message, setMessage] = useState('');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  // State untuk tambah user
  const [addUserLoading, setAddUserLoading] = useState(false);

  const [toast, setToast] = useState(null);
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
    } catch (err) {
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  // Hapus user
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
        setToast({ message: 'User berhasil dihapus!', type: 'success' });
        setUsers(users.filter(u => u.id !== id));
        if (typeof fetchUsers === 'function') fetchUsers();
      } else {
        setToast({ message: data.message || 'Gagal menghapus user!', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Terjadi kesalahan: ' + err.message, type: 'error' });
    }
    setLoading(false);
  };

  // Reset password user
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
        setToast({ message: 'Password berhasil direset!', type: 'success' });
        await fetchUsers();
      } else {
        setToast({ message: data.message || 'Gagal reset password!', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Terjadi kesalahan: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // Update role user
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
        setToast({ message: 'Role user berhasil diubah!', type: 'success' });
        await fetchUsers();
      } else {
        setToast({ message: data.message || 'Gagal mengubah role!', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Terjadi kesalahan: ' + err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };
  ;

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('/api/admin/users/stats', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          // intentionally left blank
        }
      } catch (err) {
        // intentionally left blank
      }
    };

    fetchStats();
  }, []);

  // Hapus semua user
  const handleDeleteAllUsers = async () => {
    if (!window.confirm('Yakin ingin menghapus SEMUA user? Tindakan ini tidak bisa dibatalkan!')) return;
    setLoading(true);
    // setMessage('');
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/admin/users', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok) {
        setToast({ message: 'Semua user berhasil dihapus!', type: 'success' });
        setTimeout(() => setToast({ message: '', type: null }), 2000);
        setUsers([]); // Kosongkan tabel user setelah dihapus
        await fetchUsers();
      } else {
        setToast({ message: data.message || 'Gagal menghapus user!', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Terjadi kesalahan: ' + err.message, type: 'error' });
    }
    setLoading(false);
  };

  // Handler tambah user
  const handleAddUser = async (e) => {
    e.preventDefault();
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
        setToast({ message: 'User berhasil ditambahkan!', type: 'success' });
        setTimeout(() => setToast(null), 2000);
        setNewUser({ username: '', email: '', password: '' });
        // Refresh user list dari server agar data up-to-date
        await fetchUsers();
      } else {
        setToast({ message: data.message || 'Gagal menambah user!', type: 'error' });
      }
    } catch (err) {
      setToast({ message: 'Terjadi kesalahan: ' + err.message, type: 'error' });
    } finally {
      setAddUserLoading(false);
    }
    setAddUserLoading(false);
  };

return (
  <div className="flex min-h-screen bg-gray-100">
    {/* Sidebar */}
    <aside className="w-64 bg-blue-600 text-white flex-col hidden md:flex">
      <div className="p-6 font-bold text-2xl tracking-wide border-b border-blue-800">Waskita</div>
      <nav className="flex-1 space-y-2 p-4">
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-700 font-medium transition-colors">Dashboard</a>
        <a href="#" className="block px-4 py-2 rounded bg-blue-700 font-bold">User Management</a>
        <a href="#" className="block px-4 py-2 rounded hover:bg-blue-700 font-medium transition-colors">Settings</a>
      </nav>
      <div className="p-4 border-t border-blue-800 text-xs text-blue-100">&copy; 2025 Waskita</div>
    </aside>
    {/* Main Area */}
    <div className="flex-1 flex flex-col min-w-0">
      {/* Topbar */}
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-800 tracking-wide">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700">Admin</span>
          <img src="/avatar.png" alt="avatar" className="w-9 h-9 rounded-full border-2 border-blue-600 shadow-sm" />
        </div>
      </header>
      {/* Toast Notification */}
      {toast && toast.message && (
        <div className={`fixed left-1/2 bottom-8 -translate-x-1/2 z-50 px-6 py-3 rounded shadow-lg animate-fade-in-out transition-all duration-300 text-center text-base min-w-[220px] ${toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.message}
        </div>
      )}
      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        {/* Statistik Cards */}
        {/* Statistik Cards dengan animasi fade-in */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-2">
          {[{
            color: 'blue',
            value: users.length,
            label: 'Total Users',
            icon: (
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m13-6.13a4 4 0 11-8 0 4 4 0 018 0zM9 8a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            )
          }, {
            color: 'green',
            value: users.filter(u => u.is_admin).length,
            label: 'Admin',
            icon: (
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 11c0-1.104-.896-2-2-2s-2 .896-2 2 .896 2 2 2 2-.896 2-2zm0 0v6m0-6h6m-6 0H6" /></svg>
            )
          }, {
            color: 'yellow',
            value: users.length - users.filter(u => u.is_admin).length,
            label: 'Regular Users',
            icon: (
              <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m4 4h-1v-4h-1m-4 4h-1v-4H7" /></svg>
            )
          }].map((card, idx) => (
            <div
              key={card.label}
              className={`bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-5 flex items-center gap-5 border border-${card.color}-100 dark:border-gray-700 transition-all duration-700 ease-out
                ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className={`bg-${card.color}-100 p-3 rounded-full`}>{card.icon}</div>
              <div>
                <div className={`text-3xl font-bold text-${card.color}-700`}>{card.value}</div>
                <div className="text-gray-500 text-sm mt-1">{card.label}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Form Tambah User */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-8 mb-2 border border-blue-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-blue-700 mb-6">Tambah User Baru</h3>
          <form onSubmit={handleAddUser} className="flex flex-col md:flex-row gap-6 items-end">
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Username</label>
              <input type="text" className="border border-gray-300 focus:ring-2 focus:ring-blue-600 px-4 py-2 rounded-lg w-full outline-none transition" placeholder="Username" value={newUser.username} onChange={e => setNewUser(u => ({ ...u, username: e.target.value }))} required autoComplete="username" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
              <input type="email" className="border border-gray-300 focus:ring-2 focus:ring-blue-600 px-4 py-2 rounded-lg w-full outline-none transition" placeholder="Email" value={newUser.email} onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))} required autoComplete="email" />
            </div>
            <div className="flex-1 w-full">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
              <input type="password" className="border border-gray-300 focus:ring-2 focus:ring-blue-600 px-4 py-2 rounded-lg w-full outline-none transition" placeholder="Password" value={newUser.password} onChange={e => setNewUser(u => ({ ...u, password: e.target.value }))} required autoComplete="new-password" />
            </div>
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center text-base gap-2 min-w-[150px] shadow" disabled={addUserLoading}>
              {addUserLoading && (
                <svg className="animate-spin h-5 w-5 mr-1 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              )}
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Tambah User
            </button>
          </form>
        </div>
        {/* Data Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md dark:shadow-lg p-8 border border-blue-100 dark:border-gray-700 overflow-x-auto">
          <h3 className="text-lg font-bold text-blue-700 mb-6">Daftar User</h3>
          {loadingUsers ? (
            <div className="text-center text-gray-400 py-12">Memuat data user...</div>
          ) : users.length === 0 ? (
            <EmptyState message="Belum ada user terdaftar. Silakan tambah user baru." />
          ) : (
            <>
              <table className="min-w-full text-sm text-left rounded-lg overflow-hidden dark:bg-gray-800 dark:text-gray-100">
                <thead className="text-xs text-blue-300 uppercase bg-blue-50 dark:bg-gray-900">
                  <tr>
                    <th scope="col" className="py-3 px-6">Username</th>
                    <th scope="col" className="py-3 px-6">Email</th>
                    <th scope="col" className="py-3 px-6 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="bg-white dark:bg-gray-800 border-b border-blue-100 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-gray-700 transition">
                      <td className="py-2 px-4">
                        <span className="font-semibold text-gray-700">{user.username}</span>
                        {user.is_admin && (
                          <span className="ml-2 px-2 py-0.5 rounded text-xs font-bold bg-yellow-300 text-yellow-900 align-middle">Admin</span>
                        )}
                      </td>
                      <td className="py-2 px-4">{user.email}</td>
                      <td className="py-2 px-4 text-center align-middle">
                        <div className="inline-flex flex-row justify-center items-center gap-2">
                          <button onClick={() => handleResetPassword(user.id)} className="bg-yellow-400 hover:bg-yellow-500 text-yellow-900 px-3 py-1 rounded font-semibold transition flex items-center text-xs gap-1 shadow-sm dark:bg-yellow-600 dark:hover:bg-yellow-700 dark:text-yellow-100" title="Reset Password">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                            Reset
                          </button>
                          <button onClick={() => handleDeleteUser(user.id)} className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded font-semibold transition flex items-center text-xs gap-1 shadow-sm dark:bg-red-700 dark:hover:bg-red-800" title="Hapus User">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={handleDeleteAllUsers} className="mt-6 bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition flex items-center text-base gap-2 shadow dark:bg-red-700 dark:hover:bg-red-800" disabled={loading}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                {loading ? 'Menghapus...' : 'Hapus Semua User'}
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  </div>
);

}

export default AdminSettingsPage;