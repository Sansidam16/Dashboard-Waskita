import express from 'express';
import { body, param, validationResult } from 'express-validator';
import { verifyToken, requireUser } from '../controllers/authController.js';
import {
  getAllDatasets,
  createDataset,
  updateDataset,
  deleteDataset,
  crawlData,
  getApifyDatasetItems
} from '../controllers/datasetController.js';

const router = express.Router();

// Semua endpoint dataset hanya untuk user login
// GET /datasets - fetch all datasets (for Data Saved)
router.get('/datasets', verifyToken, requireUser, async (req, res) => {
  try {
    const pool = (await import('../db/connect.js')).default;
    const result = await pool.query('SELECT * FROM datasets ORDER BY created_at DESC');
    res.json({ success: true, datasets: result.rows });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Gagal mengambil datasets' });
  }
});

router.get('/', verifyToken, requireUser, getAllDatasets);
// Validate and sanitize input for create dataset
router.post('/', verifyToken, requireUser, [
  body('name').trim().isString().isLength({ min: 3 }).withMessage('Nama dataset minimal 3 karakter').escape()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, createDataset);
// Validate and sanitize input for update dataset
router.put('/:id', verifyToken, requireUser, [
  param('id').notEmpty().withMessage('ID dataset wajib diisi'),
  body('name').trim().isString().isLength({ min: 3 }).withMessage('Nama dataset minimal 3 karakter').escape()
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, updateDataset);
// Validate param for delete dataset
router.delete('/:id', verifyToken, requireUser, [
  param('id').notEmpty().withMessage('ID dataset wajib diisi')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, deleteDataset);

// Endpoint crawling data dari X (Twitter)
// Validate input for crawlData
router.post('/crawl', verifyToken, requireUser, [
  body('keyword').trim().notEmpty().withMessage('Keyword wajib diisi').escape(),
  body('limit').isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, crawlData);

// Endpoint crawling data dari Apify Dataset Items
// Validate input for getApifyDatasetItems
router.post('/apify-dataset-items', verifyToken, requireUser, [
  body('keyword').trim().notEmpty().withMessage('Keyword wajib diisi').escape(),
  body('limit').isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100')
], (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  next();
}, getApifyDatasetItems);

export default router;
