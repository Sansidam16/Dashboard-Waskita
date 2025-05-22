import React from 'react';
import LabelActions from './LabelActions';

// Dummy label data
const dummyLabels = [
  { id: 1, value: 'Label A', item: 'Item 1' },
  { id: 2, value: 'Label B', item: 'Item 2' },
];

const LabelList = ({ dataset }) => (
  <div className="mt-4">
    <div className="overflow-x-auto rounded shadow bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-secondary text-white">
          <tr>
            <th className="px-4 py-2">Item</th>
            <th className="px-4 py-2">Label</th>
            <th className="px-4 py-2">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {dummyLabels.map(label => (
            <tr key={label.id} className="border-b">
              <td className="px-4 py-2">{label.item}</td>
              <td className="px-4 py-2">{label.value}</td>
              <td className="px-4 py-2">
                <LabelActions label={label} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default LabelList;
