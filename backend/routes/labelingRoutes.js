import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { verifyToken, requireUser } from '../controllers/authController.js';
import {
  getLabels,
  createLabel,
  deleteLabel
} from '../controllers/labelingController.js';

const router = express.Router();

// Semua endpoint labeling hanya untuk user login
router.get('/', verifyToken, requireUser, getLabels);
// Validate and sanitize input for create label
router.post('/', verifyToken, requireUser, [
  body('name').trim().isString().isLength({ min: 2 }).withMessage('Nama label minimal 2 karakter').escape()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, createLabel);
// Validate param for delete label
router.delete('/:id', verifyToken, requireUser, [
  param('id').notEmpty().withMessage('ID label wajib diisi')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, deleteLabel);

export default router;
