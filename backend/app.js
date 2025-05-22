import express from 'express';
import cors from 'cors';
import datasetRoutes from './routes/datasetRoutes.js';
import labelingRoutes from './routes/labelingRoutes.js';
import dataItemController from './controllers/dataItemController.js';
import authRoutes from './routes/authRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/dataset', datasetRoutes);
app.use('/api/labeling', labelingRoutes);
app.use('/api/auth', authRoutes);

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
