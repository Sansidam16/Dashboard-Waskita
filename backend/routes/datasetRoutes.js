import express from 'express';
import {
  getAllDatasets,
  createDataset,
  updateDataset,
  deleteDataset
} from '../controllers/datasetController.js';

const router = express.Router();

router.get('/', getAllDatasets);
router.post('/', createDataset);
router.put('/:id', updateDataset);
router.delete('/:id', deleteDataset);

export default router;
