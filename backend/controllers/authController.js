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

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'Email dan password wajib diisi!' });
  }
  try {
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Email tidak ditemukan!' });
    }
    const valid = await bcrypt.compare(password, user.rows[0].password);
    if (!valid) {
      return res.status(400).json({ message: 'Password salah!' });
    }
    // Generate token
    const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, JWT_SECRET, { expiresIn: '1d' });
    res.json({ token, username: user.rows[0].username });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
