// Dataset model structure for Neon DB (PostgreSQL)
export const DatasetModel = {
  id: 'SERIAL PRIMARY KEY',
  name: 'VARCHAR(255) NOT NULL',
  created_at: 'TIMESTAMP DEFAULT CURRENT_TIMESTAMP'
};
