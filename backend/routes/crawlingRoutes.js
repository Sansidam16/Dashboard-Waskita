import express from 'express';
const router = express.Router();
import { ApifyClient } from 'apify-client';
import { saveTweetsToDB } from '../db/tweetService.js';

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const ACTOR_ID = process.env.APIFY_ACTOR_ID || 'kaitoeasyapi~twitter-x-data-tweet-scraper-pay-per-result-cheapest';
const apifyClient = new ApifyClient({ token: APIFY_TOKEN });

router.post('/twitter', async (req, res) => {
  try {
    console.log('[Crawling] Menerima request:', req.body);
    if (!APIFY_TOKEN) {
      return res.status(500).json({ error: 'APIFY_API_TOKEN is missing' });
    }
    const { keyword, limit } = req.body;
    if (!keyword || !limit) {
      return res.status(400).json({ error: 'Keyword dan limit wajib diisi' });
    }

    // Kirim field langsung di root (tanpa objek input), mengikuti contoh dashboard
    const apifyInput = {
      "filter:blue_verified": false,
      "filter:consumer_video": false,
      "filter:has_engagement": false,
      "filter:hashtags": false,
      "filter:images": false,
      "filter:links": false,
      "filter:media": false,
      "filter:mentions": false,
      "filter:native_video": false,
      "filter:nativeretweets": false,
      "filter:news": false,
      "filter:pro_video": false,
      "filter:quote": false,
      "filter:replies": false,
      "filter:safe": false,
      "filter:spaces": false,
      "filter:twimg": false,
      "filter:verified": false,
      "filter:videos": false,
      "filter:vine": false,
      maxItems: limit,
      twitterContent: keyword
    };
    // DEBUG: Log JSON input ke Apify
    console.log('[DEBUG] Input ke Apify:', JSON.stringify(apifyInput, null, 2));
    // Fetch langsung ke REST API Apify
    const fetch = (await import('node-fetch')).default;
    const apiUrl = `https://api.apify.com/v2/acts/${ACTOR_ID}/run-sync-get-dataset-items?token=${APIFY_TOKEN}`;
    const apifyRes = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(apifyInput)
    });
    if (!apifyRes.ok) {
      const errText = await apifyRes.text();
      return res.status(500).json({ error: 'Gagal crawling di Apify', detail: errText });
    }
    // Ambil hasil (bisa array of tweets langsung)
    const tweets = await apifyRes.json();
    // Log hasil mentah dari Apify untuk debugging
    console.log('[Apify RAW items]', tweets);
    // Kirim seluruh field tweet asli (type === 'tweet') ke frontend, urutan dan jumlah sesuai actor
    const filteredTweets = Array.isArray(tweets) ? tweets.filter(t => t.type === 'tweet') : [];
    // Output dan urutan tweet sama persis dengan actor, tanpa modifikasi
    res.json({ success: true, tweets: filteredTweets });
  } catch (err) {
    console.error('[Crawling ERROR]', err);
    res.status(500).json({ error: 'Terjadi kesalahan pada server', detail: err.message });
  }
});

// Endpoint: Simpan hasil crawling ke database
router.post('/twitter/save', async (req, res) => {
  try {
    const tweets = req.body.tweets;
    if (!Array.isArray(tweets)) {
      return res.status(400).json({ error: 'Data tweets tidak valid' });
    }
    await saveTweetsToDB(tweets);
    res.json({ success: true, message: 'Data berhasil disimpan ke database' });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Gagal menyimpan data' });
  }
});

// Endpoint: Get list of actors from Apify account (referensi docs Apify)
router.get('/actors', async (req, res) => {
  try {
    const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
    if (!APIFY_TOKEN) {
      return res.status(500).json({ error: 'APIFY_API_TOKEN is missing' });
    }
    const url = `https://api.apify.com/v2/acts?token=${APIFY_TOKEN}`;
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error('[Crawling] ERROR:', err);
    res.status(500).json({ error: err.message || 'Gagal melakukan crawling' });
  }
});

export default router;
