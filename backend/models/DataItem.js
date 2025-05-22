// DataItem model structure for Neon DB (PostgreSQL)
export const DataItemModel = {
  id: 'SERIAL PRIMARY KEY',
  dataset_id: 'INTEGER REFERENCES dataset(id)',
  value: 'TEXT NOT NULL'
};
