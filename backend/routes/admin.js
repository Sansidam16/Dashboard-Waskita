import express from 'express';
const router = express.Router();
import {
  deleteAllUsers,
  getAllUsers,
  deleteUserById,
  resetUserPassword,
  updateUserRole,
  getUserStats,
  resetDatabase
} from '../controllers/adminController.js';
import { verifyAdmin } from '../middleware/authMiddleware.js';

// GET all users
router.get('/users', verifyAdmin, adminController.getAllUsers);
// DELETE a user
router.delete('/users/:id', verifyAdmin, adminController.deleteUserById);
// POST reset password
router.post('/users/:id/reset-password', verifyAdmin, adminController.resetUserPassword);
// POST update role
router.post('/users/:id/update-role', verifyAdmin, adminController.updateUserRole);
// GET user stats
router.get('/users/stats', verifyAdmin, adminController.getUserStats);
// DELETE all users (except admin)
router.delete('/users', verifyAdmin, adminController.deleteAllUsers);
// POST reset database
router.post('/reset-db', verifyAdmin, adminController.resetDatabase);

export default router;
