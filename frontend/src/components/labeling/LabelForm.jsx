import React from 'react';

const LabelForm = ({ dataset, onAddLabel, showToast }) => {
  const [item, setItem] = React.useState("");
  const [value, setValue] = React.useState("");

  if (!dataset) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!item.trim() || !value.trim()) {
      if (showToast) showToast("Item dan Label wajib diisi.", "error");
      return;
    }
    if (onAddLabel) onAddLabel(item, value);
    setItem("");
    setValue("");
  };

  return (
    <form className="flex items-center space-x-4 mb-4" onSubmit={handleSubmit}>
      <input
        className="border rounded px-3 py-2"
        placeholder="Item"
        value={item}
        onChange={e => setItem(e.target.value)}
      />
      <input
        className="border rounded px-3 py-2"
        placeholder="Label"
        value={value}
        onChange={e => setValue(e.target.value)}
      />
      <button type="submit" className="bg-accent text-white px-4 py-2 rounded">Simpan Label</button>
    </form>
  );
};

export default LabelForm;
