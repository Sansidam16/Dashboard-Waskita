import express from 'express';
import { body, validationResult } from 'express-validator';
import { registerUser, loginUser, getMe, verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Validate and sanitize input for register
router.post('/register', [
  body('username').trim().isLength({ min: 3 }).withMessage('Username minimal 3 karakter').escape(),
  body('email').isEmail().withMessage('Email tidak valid').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password minimal 6 karakter')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, registerUser);

// Validate and sanitize input for login
// Konsisten: validasi hanya field username dan password
router.post('/login', [
  body('username').trim().notEmpty().withMessage('Username/email wajib diisi').escape(),
  body('password').notEmpty().withMessage('Password wajib diisi')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, loginUser);

router.get('/me', verifyToken, getMe);

export default router;
