import express from 'express';
import {
  deleteAllUsers,
  getAllUsers,
  deleteUserById,
  resetUserPassword,
  updateUserRole,
  getUserStats,
  resetDatabase
} from '../controllers/adminController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

// Reset seluruh database
router.post('/reset-db', verifyToken, resetDatabase);
// Statistik user
router.get('/users/stats', verifyToken, getUserStats);
// Endpoint untuk ambil semua user (khusus admin)
router.get('/users', verifyToken, getAllUsers);
// Endpoint untuk hapus user tertentu
router.delete('/users/:id', verifyToken, deleteUserById);
// Endpoint untuk reset password user tertentu
router.post('/users/:id/reset-password', verifyToken, resetUserPassword);
// Endpoint untuk update role user tertentu
router.post('/users/:id/update-role', verifyToken, updateUserRole);
// Endpoint untuk hapus semua user (khusus admin)
router.delete('/users', verifyToken, deleteAllUsers);

export default router;
