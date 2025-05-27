import React from 'react';
import Button from '../shared/Button';

const LabelActions = ({ onDelete, label }) => (
  <div className="flex space-x-2">
    <Button color="accent" size="sm">Edit</Button>
    <Button color="secondary" size="sm" onClick={() => onDelete && onDelete(label.id)}>Hapus</Button>
  </div>
);

export default LabelActions;
