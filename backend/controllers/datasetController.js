// Dummy controller, ready for Neon DB integration
import pool from '../db/connect.js';

export const getAllDatasets = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, created_at FROM dataset ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error('ERROR getAllDatasets:', err);
    res.status(500).json({ error: err.message });
  }
};

export const createDataset = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nama dataset wajib diisi' });
  try {
    const result = await pool.query(
      'INSERT INTO dataset (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDataset = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Nama dataset wajib diisi' });
  try {
    const result = await pool.query(
      'UPDATE dataset SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dataset tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDataset = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM dataset WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Dataset tidak ditemukan' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
