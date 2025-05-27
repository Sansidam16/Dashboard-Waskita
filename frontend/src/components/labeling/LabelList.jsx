import React from 'react';
import LabelActions from './LabelActions';

const LabelList = ({ labels, onDeleteLabel }) => (
  <div className="mt-4">
    {(!labels || labels.length === 0) ? (
      <div className="text-center text-gray-500 py-12 bg-white rounded shadow">
        <div className="text-2xl mb-2">😴</div>
        <div className="font-semibold">Belum ada data untuk dilabeli</div>
        <div className="text-sm text-gray-400">Silakan pilih dataset atau tambahkan data terlebih dahulu.</div>
      </div>
    ) : (
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
            {labels.map(label => (
              <tr key={label.id} className="border-b">
                <td className="px-4 py-2">{label.item}</td>
                <td className="px-4 py-2">{label.value}</td>
                <td className="px-4 py-2">
                  <LabelActions label={label} onDelete={onDeleteLabel} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

export default LabelList;
