import express from 'express';
import { verifyToken, requireUser } from '../controllers/authController.js';
const router = express.Router();
import { ApifyClient } from 'apify-client';
import { saveTweetsToDB } from '../db/tweetService.js';
import { body, validationResult } from 'express-validator';

const APIFY_TOKEN = process.env.APIFY_API_TOKEN;
const ACTOR_ID = process.env.APIFY_ACTOR_ID || 'kaitoeasyapi~twitter-x-data-tweet-scraper-pay-per-result-cheapest';
const apifyClient = new ApifyClient({ token: APIFY_TOKEN });

// Validate and sanitize input for /twitter
// Semua endpoint crawling hanya untuk user login
router.post('/twitter', verifyToken, requireUser, [
  body('keyword').trim().notEmpty().withMessage('Keyword wajib diisi').escape(),
  body('limit').isInt({ min: 1, max: 100 }).withMessage('Limit harus antara 1-100')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
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
// Validate and sanitize input for /twitter/save
router.post('/twitter/save', verifyToken, requireUser, [
  body('tweets').isArray({ min: 1 }).withMessage('tweets harus berupa array dan tidak kosong')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ error: errors.array().map(e => e.msg).join(', ') });
  }
  try {
    const tweets = req.body.tweets;
    let keyword = req.body.keyword;
    if (!Array.isArray(tweets)) {
      return res.status(400).json({ error: 'Data tweets tidak valid' });
    }
    if (!keyword && tweets.length > 0) {
      keyword = tweets[0]?.keyword || tweets[0]?.author_username || '-';
    }
    // Simpan tweets ke DB
    await saveTweetsToDB(tweets, keyword);

    // Hitung jumlah tweet unik yang benar-benar berhasil disimpan
    const pool = (await import('../db/connect.js')).default;
    const recordCountRes = await pool.query('SELECT COUNT(*) FROM tweets WHERE keyword = $1', [keyword]);
    const recordCount = parseInt(recordCountRes.rows[0]?.count || '0', 10);

    // Tambahkan/ubah metadata di tabel datasets
    await pool.query(`
      INSERT INTO datasets (name, source, record_count, created_at)
      VALUES ($1, $2, $3, NOW())
      ON CONFLICT (name, source) DO UPDATE SET record_count = $3, created_at = NOW()
    `, [keyword, 'crawling', recordCount]);

    res.json({ success: true, message: `Data berhasil disimpan ke database (${recordCount} tweet)`, recordCount });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Gagal menyimpan data' });
  }
});

// Endpoint: Get list of actors from Apify account (referensi docs Apify)
router.get('/actors', verifyToken, requireUser, async (req, res) => {
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

// Endpoint: Ambil tweet berdasarkan nama dataset (keyword)
router.get('/tweets', verifyToken, requireUser, async (req, res) => {
  try {
    const { dataset } = req.query;
    if (!dataset) return res.status(400).json({ error: 'Parameter dataset wajib diisi' });
    const pool = (await import('../db/connect.js')).default;
    // Ambil tweet berdasarkan keyword (nama dataset) dari author_username atau keyword tweet
    const tweetsRes = await pool.query(
      `SELECT * FROM tweets WHERE keyword = $1 ORDER BY created_at DESC LIMIT 500`,
      [dataset]
    );
    // Mapping snake_case ke camelCase agar sinkron dengan frontend
    const tweets = tweetsRes.rows.map(item => ({
      // Flat fields from DB
      id: item.id,
      text: item.text,
      url: item.url,
      createdAt: item.created_at,
      likeCount: item.like_count,
      retweetCount: item.retweet_count,
      authorUsername: item.author_username,
      // Nested structure for frontend compatibility
      author: {
        userName: item.author_username || null,
        name: item.author_name || null,
        id: item.author_id || null,
        description: item.author_description || null,
        profilePicture: item.profile_picture || item.profilePicture || '',
        coverPicture: item.cover_picture || null,
        location: item.location || '-',
        createdAt: item.author_created_at || null,
        isVerified: item.is_verified ?? null,
        isBlueVerified: item.is_blue_verified ?? null,
        followers: item.followers ?? 0,
        following: item.following ?? 0,
        fastFollowersCount: item.fast_followers_count ?? null,
        mediaCount: item.media_count ?? null,
        statusesCount: item.statuses_count ?? item.statusesCount ?? 0,
        favouritesCount: item.favourites_count ?? null,
        canDm: item.can_dm ?? null,
        canMediaTag: item.can_media_tag ?? null,
        hasCustomTimelines: item.has_custom_timelines ?? null,
        isTranslator: item.is_translator ?? null,
        isAutomated: item.is_automated ?? null,
        automatedBy: item.automated_by ?? null,
        pinnedTweetIds: item.pinned_tweet_ids ? JSON.parse(item.pinned_tweet_ids) : [],
        profile_bio: item.profile_bio ?? null,
      },
      entities: {
        hashtags: item.hashtags ? JSON.parse(item.hashtags) : [],
      },
      extendedEntities: {
        media: item.media ? JSON.parse(item.media) : [],
      },
      card: item.card ?? null,
      source: item.source ?? null,
      lang: item.lang ?? null,
      isReply: item.is_reply ?? null,
      inReplyToId: item.in_reply_to_id ?? null,
      inReplyToUserId: item.in_reply_to_user_id ?? null,
      inReplyToUsername: item.in_reply_to_username ?? null,
      conversationId: item.conversation_id ?? null,
      retweeted_tweet: item.retweeted_tweet ? JSON.parse(item.retweeted_tweet) : null,
      quoted_tweet: item.quoted_tweet ? JSON.parse(item.quoted_tweet) : null,
      isPinned: item.is_pinned ?? null,
      isConversationControlled: item.is_conversation_controlled ?? null,
      replyCount: item.reply_count ?? null,
      quoteCount: item.quote_count ?? null,
      viewCount: item.view_count ?? null,
      bookmarkCount: item.bookmark_count ?? null,
      tweetTime: item.created_at,
      place: item.place ?? null,
    }));
    res.json({ success: true, tweets });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Gagal mengambil tweet' });
  }
});

export default router;
