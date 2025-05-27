import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import datasetRoutes from './routes/datasetRoutes.js';
import labelingRoutes from './routes/labelingRoutes.js';
import dataItemController from './controllers/dataItemController.js';
import authRoutes from './routes/authRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import dotenv from 'dotenv';
import crawlingRoutes from './routes/crawlingRoutes.js';

dotenv.config();

const app = express();

// Security headers
app.use(helmet());

// Content Security Policy (CSP) - adjust as needed
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; img-src 'self' data:; script-src 'self'; style-src 'self' 'unsafe-inline'"
  );
  next();
});

// Rate limiting (all API endpoints)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // limit each IP to 200 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api', datasetRoutes);
app.use('/api/labeling', labelingRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/crawling', crawlingRoutes);

// DATA ITEM
app.get('/api/data-item', dataItemController.getAllDataItems);
app.post('/api/data-item', dataItemController.createDataItem);
app.put('/api/data-item/:id', dataItemController.updateDataItem);
app.delete('/api/data-item/:id', dataItemController.deleteDataItem);
// LABEL
app.get('/api/label', dataItemController.getLabelsByDataItem);
app.post('/api/label', dataItemController.createLabel);
app.put('/api/label/:id', dataItemController.updateLabel);
app.delete('/api/label/:id', dataItemController.deleteLabel);

app.get('/', (req, res) => {
  res.send('AdminLTE Dashboard Backend is running');
});

// Global error handler (hide stack traces in production)
app.use((err, req, res, next) => {
  if (res.headersSent) return next(err);
  const status = err.status || 500;
  const message = process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message;
  res.status(status).json({ error: message });
});

// Endpoint untuk cek koneksi database
import db from './db/connect.js';
app.get('/api/db-check', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'success', message: 'Koneksi database berhasil!' });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
});

export default app;
