import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db/connect.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretkey';

// Middleware untuk verifikasi JWT dan expired
export function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).json({ message: 'Session expired, please login again' });
      }
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
}

export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Semua field wajib diisi!' });
  }
  try {
    // Cek apakah user sudah ada
    const exist = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (exist.rows.length > 0) {
      return res.status(400).json({ message: 'Email sudah terdaftar!' });
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Insert user baru
    await db.query('INSERT INTO users (username, email, password) VALUES ($1, $2, $3)', [username, email, hashedPassword]);
    res.status(201).json({ message: 'Registrasi berhasil!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  if (!req.user || !req.user.email) return res.status(401).json({ message: 'Unauthorized' });
  try {
    const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [req.user.email]);
    if (userQuery.rows.length === 0) return res.status(404).json({ message: 'User not found' });
    const user = userQuery.rows[0];
    const isAdmin = user.is_admin === true;
    res.json({ username: user.username, email: user.email, isAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Middleware untuk cek user login
export function requireUser(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ message: 'User access only' });
  }
  next();
}

// Middleware untuk cek admin
export function requireAdmin(req, res, next) {
  if (!req.user || req.user.is_admin !== true) {
    return res.status(403).json({ message: 'Admin access only' });
  }
  next();
}

// POST /api/auth/login
export const loginUser = async (req, res) => {

  // Konsisten: gunakan field username dan password
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Email/username dan password wajib diisi!' });
  }
  try {
    // Query: cari berdasarkan email atau username
    const userQuery = await db.query('SELECT * FROM users WHERE email = $1 OR username = $1', [username]);
    if (userQuery.rows.length === 0) {
      return res.status(400).json({ message: 'Email atau username tidak ditemukan!' });
    }
    const user = userQuery.rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Password salah!' });
    }
    // Generate token dengan is_admin
    const token = jwt.sign({ id: user.id, email: user.email, is_admin: user.is_admin === true }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.username, email: user.email, is_admin: user.is_admin === true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
