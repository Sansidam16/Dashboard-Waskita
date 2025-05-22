// Dummy controller, ready for Neon DB integration
export const getLabels = (req, res) => {
  res.json([
    { id: 1, value: 'Label A', item: 'Item 1' },
    { id: 2, value: 'Label B', item: 'Item 2' },
  ]);
};

export const createLabel = (req, res) => {
  res.status(201).json({ ...req.body, id: Date.now() });
};

export const deleteLabel = (req, res) => {
  res.json({ success: true });
};
