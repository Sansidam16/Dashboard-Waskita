import express from 'express';
import {
  getAllDatasets,
  createDataset,
  updateDataset,
  deleteDataset,
  crawlData,
  getApifyDatasetItems
} from '../controllers/datasetController.js';

const router = express.Router();

router.get('/', getAllDatasets);
router.post('/', createDataset);
router.put('/:id', updateDataset);
router.delete('/:id', deleteDataset);

// Endpoint crawling data dari X (Twitter)
router.post('/crawl', crawlData);

// Endpoint crawling data dari Apify Dataset Items
router.post('/apify-dataset-items', getApifyDatasetItems);

export default router;
