import { Router } from 'express';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { rateLimit } from "express-rate-limit"

const authRoutes = Router();
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 50,
    message: "Too many requests, please try again later.",
    statusCode: 429,     
})

authRoutes.post('/register', limiter, register);
authRoutes.post('/login', limiter, login);
authRoutes.get('/me', authenticate, getMe);
authRoutes.post('/logout', authenticate, logout);

export default authRoutes;