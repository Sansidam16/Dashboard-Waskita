// Controller CRUD untuk data_item dan label
import db from '../db/connect.js';

// DATA ITEM
const getAllDataItems = async (req, res) => {
  try {
    const { dataset_id } = req.query;
    const result = await db.query(
      'SELECT * FROM data_item WHERE dataset_id = $1 ORDER BY id DESC',
      [dataset_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createDataItem = async (req, res) => {
  try {
    const { dataset_id, value } = req.body;
    const result = await db.query(
      'INSERT INTO data_item (dataset_id, value) VALUES ($1, $2) RETURNING *',
      [dataset_id, value]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateDataItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const result = await db.query(
      'UPDATE data_item SET value = $1 WHERE id = $2 RETURNING *',
      [value, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Data item tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteDataItem = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM data_item WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Data item tidak ditemukan' });
    res.json({ message: 'Data item berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LABEL
const getLabelsByDataItem = async (req, res) => {

  try {
    const { data_item_id } = req.query;
    const result = await db.query(
      'SELECT * FROM label WHERE data_item_id = $1 ORDER BY id DESC',
      [data_item_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const createLabel = async (req, res) => {
  try {
    const { data_item_id, value } = req.body;
    const result = await db.query(
      'INSERT INTO label (data_item_id, value) VALUES ($1, $2) RETURNING *',
      [data_item_id, value]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateLabel = async (req, res) => {
  try {
    const { id } = req.params;
    const { value } = req.body;
    const result = await db.query(
      'UPDATE label SET value = $1 WHERE id = $2 RETURNING *',
      [value, id]
    );
    if (result.rowCount === 0) return res.status(404).json({ error: 'Label tidak ditemukan' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteLabel = async (req, res) => {


  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM label WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ error: 'Label tidak ditemukan' });
    res.json({ message: 'Label berhasil dihapus' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export default {
  getAllDataItems,
  createDataItem,
  updateDataItem,
  deleteDataItem,
  getLabelsByDataItem,
  createLabel,
  updateLabel,
  deleteLabel
};
