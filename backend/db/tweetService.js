import pool from './connect.js';
import { extractUsernameFromUrl } from '../extractUsernameFromUrl.js';

export async function saveTweetsToDB(tweets, keyword = null) {
  const query = `
    INSERT INTO tweets (
      tweet_id, text, url, created_at, author_username, mentions, profile_picture,
      retweet_count, reply_count, like_count, quote_count, view_count, bookmark_count,
      source, lang, is_reply, is_retweet, is_quote, is_pinned, keyword
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7,
      $8, $9, $10, $11, $12, $13,
      $14, $15, $16, $17, $18, $19, $20
    )
  `;
  for (const t of tweets) {
  try {
    await pool.query(query, [
      t.id || t.tweet_id || null,
      t.text || null,
      t.url || null,
      t.createdAt ? new Date(t.createdAt) : null,
      t.author?.username || t.author_username || extractUsernameFromUrl(t.url) || null,
      Array.isArray(t.entities?.user_mentions) ? t.entities.user_mentions.map(m => m.screen_name || m.name || '').filter(Boolean).join(', ') : (t.mentions || null),
      t.author?.profilePicture || t.profile_picture || null,
      t.retweetCount ?? null,
      t.replyCount ?? null,
      t.likeCount ?? null,
      t.quoteCount ?? null,
      t.viewCount ?? null,
      t.bookmarkCount ?? null,
      t.source || null,
      t.lang || null,
      t.isReply ?? null,
      t.isRetweet ?? null,
      t.isQuote ?? null,
      t.isPinned ?? null,
      t.keyword || keyword || null
    ]);
  } catch (err) {
    console.error('[DB INSERT ERROR]', err.message, {tweet: t});
  }
}
}
