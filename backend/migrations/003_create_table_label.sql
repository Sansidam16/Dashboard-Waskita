-- SQL Migrasi: Membuat tabel label
CREATE TABLE IF NOT EXISTS label (
    id SERIAL PRIMARY KEY,
    data_item_id INTEGER NOT NULL REFERENCES data_item(id) ON DELETE CASCADE,
    value VARCHAR(255) NOT NULL
);
