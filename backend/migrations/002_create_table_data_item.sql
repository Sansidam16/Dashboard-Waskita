-- SQL Migrasi: Membuat tabel data_item
CREATE TABLE IF NOT EXISTS data_item (
    id SERIAL PRIMARY KEY,
    dataset_id INTEGER NOT NULL REFERENCES dataset(id) ON DELETE CASCADE,
    value TEXT NOT NULL
);
