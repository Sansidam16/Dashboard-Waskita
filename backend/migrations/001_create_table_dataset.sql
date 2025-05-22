-- SQL Migrasi: Membuat tabel dataset untuk Neon DB PostgreSQL
CREATE TABLE IF NOT EXISTS dataset (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
