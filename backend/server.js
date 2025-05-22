import app from './app.js';
import dataItemController from './controllers/dataItemController.js';

const PORT = process.env.PORT || 5000;

// DATA ITEM
app.get('/api/data-item', dataItemController.getAllDataItems);
app.post('/api/data-item', dataItemController.createDataItem);
app.put('/api/data-item/:id', dataItemController.updateDataItem);
app.delete('/api/data-item/:id', dataItemController.deleteDataItem);

// LABEL
app.get('/api/label', dataItemController.getLabelsByDataItem);
app.post('/api/label', dataItemController.createLabel);
app.put('/api/label/:id', dataItemController.updateLabel);
app.delete('/api/label/:id', dataItemController.deleteLabel);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

