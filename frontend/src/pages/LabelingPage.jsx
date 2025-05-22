import React from 'react';
import LabelList from '../components/labeling/LabelList';
import LabelForm from '../components/labeling/LabelForm';

const LabelingPage = () => {
  // Dummy selected dataset state
  const [selectedDataset, setSelectedDataset] = React.useState(null);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-primary">Labelling</h2>
        {/* Dummy dataset selector */}
        <select className="border rounded px-2 py-1" onChange={e => setSelectedDataset(e.target.value)}>
          <option value="">Pilih Dataset</option>
          <option value="dataset1">Dataset 1</option>
          <option value="dataset2">Dataset 2</option>
        </select>
      </div>
      <LabelForm dataset={selectedDataset} />
      <LabelList dataset={selectedDataset} />
    </div>
  );
};

export default LabelingPage;
