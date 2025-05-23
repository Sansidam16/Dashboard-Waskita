import pool from '../db/connect.js';
import fetch from 'node-fetch'; // pastikan sudah install node-fetch

// Handler untuk crawling data dari X (Twitter)
export const getApifyDatasetItems = async (req, res) => {
  const { datasetId, apifyToken, keyword, limit = 100, offset = 0, desc = false } = req.body;
  if (!datasetId || !apifyToken || !keyword) {
    return res.status(400).json({ error: 'Dataset ID, Apify Token, dan keyword wajib diisi' });
  }
  try {
    // Set keyword dengan bahasa Indonesia
    const searchKeyword = `${keyword} bahasa:indonesia`;
    // Bangun URL sesuai dok Apify: https://docs.apify.com/api/v2#/reference/datasets/item-collection/get-items
    const params = new URLSearchParams({
      token: apifyToken,
      clean: 'true',
      format: 'json',
      limit: limit.toString(),
      offset: offset.toString(),
      desc: desc ? 'true' : 'false'
    });
    const url = `https://api.apify.com/v2/datasets/${datasetId}/items?${params.toString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      const errText = await response.text();
      return res.status(response.status).json({ error: 'Gagal ambil data dari Apify', detail: errText });
    }
    const data = await response.json();

    // Filter hasil sesuai keyword (case-insensitive, bahasa Indonesia)
    // TANPA FILTER: return semua data dari Apify
    if (Array.isArray(data) && data.length === 0) {
      return res.json({ data: [], message: 'Data dari Apify kosong.' });
    }
    res.json({ data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const crawlData = async (req, res) => {
  const { keyword, maxCount, bearerToken } = req.body;
  if (!keyword) return res.status(400).json({ error: 'Keyword wajib diisi' });
  try {
    // Token bisa dari frontend (input user) atau fallback ke .env
    const BEARER_TOKEN_X = bearerToken && bearerToken.trim() !== '' ? bearerToken : process.env.X_BEARER_TOKEN;
    if (!BEARER_TOKEN_X) return res.status(400).json({ error: 'Bearer Token X API wajib diisi (input atau .env)' });

    // Endpoint X API v2 search recent
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(keyword)}&max_results=${Math.min(maxCount || 10, 100)}`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN_X}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ error: data.error || data.title || 'Gagal mengambil data dari X API', detail: data });
    }
    // Ambil array data tweet
    res.json({ data: data.data || [], meta: data.meta });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllDatasets = async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, created_at FROM dataset ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {

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
