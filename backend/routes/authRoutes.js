import express from 'express';
import { registerUser, loginUser, getMe, verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);

export default router;
