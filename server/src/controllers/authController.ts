import { Request, Response } from 'express';
import { AuthRequest } from '../types/index.js';
import { prisma } from "../../lib/prisma.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import z from "zod";

// Register Zod Schema
const registerSchema = z.object({
    email: z.email({message: "Please enter a valid email."}),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long." })
        .max(100, { message: "Password must not exceed 100 characters long."})
        .regex(/[A-Z]/, { message: "Must contain at least one uppercase letter." })
        .regex(/[a-z]/, { message: "Must contain at least one lowercase letter." })
        .regex(/[0-9]/, { message: "Must contain at least one number." })
        .regex(/[^A-Za-z0-9]/, { message: "Must contain at least one special character." }),
    confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"], 
})

// Log in Zod Schema
const LoginSchema =  z.object({
    email: z.email({message: "Enter a valid email"}),
    password: z.string().min(1, {message:"Please enter your password"} )
})

export const register = async (req: Request, res: Response) => {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({ error: validation.error})
    };

    const { email, password } = validation.data;

    try {
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
    const validation = LoginSchema.safeParse(req.body)

    if (!validation.success) {
        return res.status(400).json({error: validation.error})
    };

    const {email, password} = validation.data;
    try {
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