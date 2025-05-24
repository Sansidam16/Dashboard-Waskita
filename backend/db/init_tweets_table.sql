CREATE TABLE IF NOT EXISTS tweets (
  id SERIAL PRIMARY KEY,
  text TEXT,
  url TEXT UNIQUE,
  created_at TIMESTAMP,
  like_count INT,
  retweet_count INT,
  author_username VARCHAR(255)
);
