import React from 'react';
import LabelList from '../components/labeling/LabelList';
import LabelForm from '../components/labeling/LabelForm';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LabelingPage = () => {
  // State for selected dataset and label data
  const [selectedDataset, setSelectedDataset] = React.useState(null);
  const [labels, setLabels] = React.useState([]);

  // Dummy addLabel function (to be connected to LabelForm)
  const addLabel = (item, value) => {
    setLabels(prev => [
      ...prev,
      { id: Date.now(), item, value }
    ]);
    toast.success('Label berhasil ditambahkan!');
  };

  // Function to show error toast from LabelForm
  const showToast = (msg, type = 'error') => {
    if (type === 'error') toast.error(msg);
    else toast(msg);
  };

  const handleDeleteLabel = (id) => {
    setLabels(prev => prev.filter(label => label.id !== id));
    toast.success('Label berhasil dihapus!');
  };

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
      <LabelForm dataset={selectedDataset} onAddLabel={addLabel} showToast={showToast} />
      <LabelList labels={labels} onDeleteLabel={handleDeleteLabel} />
      <ToastContainer position="top-right" autoClose={2500} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="colored" />
    </div>
  );
}

export default LabelingPage;
