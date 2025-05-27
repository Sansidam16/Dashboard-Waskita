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
import { verifyToken, requireAdmin } from '../controllers/authController.js';

const router = express.Router();

// Semua endpoint admin harus login dan admin
// Reset seluruh database
router.post('/reset-db', verifyToken, requireAdmin, resetDatabase);
// Statistik user
router.get('/users/stats', verifyToken, requireAdmin, getUserStats);
// Endpoint untuk ambil semua user (khusus admin)
router.get('/users', verifyToken, requireAdmin, getAllUsers);
// Endpoint untuk hapus user tertentu
router.delete('/users/:id', verifyToken, requireAdmin, deleteUserById);
// Endpoint untuk reset password user tertentu
router.post('/users/:id/reset-password', verifyToken, requireAdmin, resetUserPassword);
// Endpoint untuk update role user tertentu
router.post('/users/:id/update-role', verifyToken, requireAdmin, updateUserRole);
// Endpoint untuk hapus semua user (khusus admin)
router.delete('/users', verifyToken, requireAdmin, deleteAllUsers);

export default router;
