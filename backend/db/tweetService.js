import pool from './connect.js';

export async function saveTweetsToDB(tweets) {
  const query = `
    INSERT INTO tweets (text, url, created_at, like_count, retweet_count, author_username)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (url) DO NOTHING
  `;
  for (const t of tweets) {
    await pool.query(query, [
      t.text,
      t.url,
      t.createdAt,
      t.likeCount,
      t.retweetCount,
      t.authorUserName
    ]);
  }
}
