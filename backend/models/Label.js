// Label model structure for Neon DB (PostgreSQL)
export const LabelModel = {
  id: 'SERIAL PRIMARY KEY',
  data_item_id: 'INTEGER REFERENCES data_item(id)',
  value: 'VARCHAR(255) NOT NULL'
};
