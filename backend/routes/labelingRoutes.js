import express from 'express';
import {
  getLabels,
  createLabel,
  deleteLabel
} from '../controllers/labelingController.js';

const router = express.Router();

router.get('/', getLabels);
router.post('/', createLabel);
router.delete('/:id', deleteLabel);

export default router;
