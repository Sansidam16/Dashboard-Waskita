import db from '../db/connect.js';
import bcrypt from 'bcryptjs';

export async function resetDatabase(req, res) {
  if (!req.user || req.user.email !== 'beritamasuk2020@gmail.com') {
    return res.status(403).json({ message: 'Akses hanya untuk admin!' });
  }
  try {
    // Hapus semua data dari tabel utama, kecuali admin
    await db.query("DELETE FROM labeling");
    await db.query("DELETE FROM dataset");
    await db.query("DELETE FROM users WHERE is_admin = false");
    // (tambahkan tabel lain jika ada)
    res.json({ message: 'Seluruh database berhasil direset, kecuali akun admin.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function getUserStats(req, res) {
  if (!req.user || req.user.email !== 'beritamasuk2020@gmail.com') {
    return res.status(403).json({ message: 'Akses hanya untuk admin!' });
  }
  try {
    const total = await db.query('SELECT COUNT(*) FROM users');
    const admin = await db.query("SELECT COUNT(*) FROM users WHERE is_admin = true");
    const user = await db.query("SELECT COUNT(*) FROM users WHERE is_admin = false");
    res.json({ total: Number(total.rows[0].count), admin: Number(admin.rows[0].count), user: Number(user.rows[0].count) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function getAllUsers(req, res) {
  if (!req.user || req.user.email !== 'beritamasuk2020@gmail.com') {
    return res.status(403).json({ message: 'Akses hanya untuk admin!' });
  }
  try {
    const users = await db.query("SELECT id, username, email, created_at, is_admin FROM users ORDER BY created_at DESC");
    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function deleteUserById(req, res) {
  if (!req.user || req.user.email !== 'beritamasuk2020@gmail.com') {
    return res.status(403).json({ message: 'Akses hanya untuk admin!' });
  }
  const { id } = req.params;
  try {
    await db.query('DELETE FROM users WHERE id = $1', [id]);
    res.json({ message: 'User berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function resetUserPassword(req, res) {
  if (!req.user || req.user.email !== 'beritamasuk2020@gmail.com') {
    return res.status(403).json({ message: 'Akses hanya untuk admin!' });
  }
  const { id } = req.params;
  const { newPassword } = req.body;
  if (!newPassword) return res.status(400).json({ message: 'Password baru wajib diisi!' });
  try {
    const hashed = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE id = $2', [hashed, id]);
    res.json({ message: 'Password berhasil direset!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function updateUserRole(req, res) {
  if (!req.user || req.user.email !== 'beritamasuk2020@gmail.com') {
    return res.status(403).json({ message: 'Akses hanya untuk admin!' });
  }
  const { id } = req.params;
  const { isAdmin } = req.body;
  try {
    // Update kolom is_admin sesuai permintaan
    await db.query('UPDATE users SET is_admin = $1 WHERE id = $2', [isAdmin === true, id]);
    res.json({ message: 'Role user berhasil diubah!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export async function deleteAllUsers(req, res) {
  // Cek apakah user login adalah admin (misal username 'admin')
  if (!req.user || req.user.email !== 'beritamasuk2020@gmail.com') {
    return res.status(403).json({ message: 'Akses hanya untuk admin!' });
  }
  try {
    await db.query('DELETE FROM users WHERE is_admin = false');
    res.json({ message: 'Semua user berhasil dihapus!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
