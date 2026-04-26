import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AuthRequest, JwtPayload } from '../types/index.js';


export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
        console.error('JWT_SECRET is not defined in environment variables.');
        return res.status(500).json({ error: 'Server configuration error.' });
    }

    try {
        const decodedPayload : JwtPayload = jwt.verify(token, secret) as JwtPayload;
        req.user = decodedPayload;
        next();
        
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token.' });
    }
}