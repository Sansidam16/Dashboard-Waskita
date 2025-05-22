-- Dummy data for dataset, data_item, and label

INSERT INTO dataset (name, description) VALUES
  ('Dataset A', 'Deskripsi dataset A'),
  ('Dataset B', 'Deskripsi dataset B');

-- Assume the ids are 1 and 2 for Dataset A and B
INSERT INTO data_item (dataset_id, value) VALUES
  (1, 'Data Item 1 for Dataset A'),
  (1, 'Data Item 2 for Dataset A'),
  (2, 'Data Item 1 for Dataset B');

-- Assume the ids for data_item are 1, 2, 3
INSERT INTO label (data_item_id, value) VALUES
  (1, 'Label 1 for Data Item 1'),
  (1, 'Label 2 for Data Item 1'),
  (2, 'Label 1 for Data Item 2'),
  (3, 'Label 1 for Data Item 1 (B)');
