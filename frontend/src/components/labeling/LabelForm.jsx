import React from 'react';

const LabelForm = ({ dataset }) => {
  if (!dataset) return null;
  return (
    <form className="flex items-center space-x-4 mb-4">
      <input className="border rounded px-3 py-2" placeholder="Item" />
      <input className="border rounded px-3 py-2" placeholder="Label" />
      <button type="submit" className="bg-accent text-white px-4 py-2 rounded">Simpan Label</button>
    </form>
  );
};

export default LabelForm;
