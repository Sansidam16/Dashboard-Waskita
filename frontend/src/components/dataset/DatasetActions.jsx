import React from 'react';
import Button from '../shared/Button';

const DatasetActions = ({ dataset, onEdit, onDelete }) => (
  <div className="flex space-x-2">
    <Button color="accent" size="sm" onClick={() => onEdit(dataset)}>Edit</Button>
    <Button color="secondary" size="sm" onClick={() => onDelete(dataset)}>Hapus</Button>
  </div>
);

export default DatasetActions;
