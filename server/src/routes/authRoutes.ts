import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
const authRoutes = Router();

authRoutes.post('/register', register);
authRoutes.post('/login', login);
authRoutes.get('/me', authenticate, getMe);
authRoutes.post('/logout', authenticate, logout);
export default authRoutes;