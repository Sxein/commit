import { Request, Response } from 'express';
import { AuthRequest } from '../types/index.js';
import { prisma } from "../../lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const register = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required.'});
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({error: 'Email is already registered.'});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
            }
        })
        res.status(201).json({ message: 'User registered successfully.', user: { userId: newUser.id, email: newUser.email } });
    }
    catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'An error occurred during registration.' });
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({error: 'Email and password are required.'});
        }

        const user = await prisma.user.findUnique( { where: { email } });
        if (!user) {
            return res.status(400).json({error: 'Invalid email or password.'});
        }

        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) {
            return res.status(400).json({error: 'Invalid email or password.'});
        }

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            console.error('JWT_SECRET is not defined in environment variables.');
            return res.status(500).json({ error: 'Server configuration error.' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email },
            secret,
            { expiresIn: '7d' }
        );

        res.cookie('jwt', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: 'Login successful.', user: { userId: user.id, email: user.email } });
    }
    catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'An error occurred during login.' });
    }
}

export const getMe = async (req: AuthRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized: No user information found.' });
    }

    return res.status(200).json(req.user);

}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
    });
    res.status(200).json({ message: 'Logout successful.' });
}