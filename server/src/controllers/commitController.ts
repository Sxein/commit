// create commit
import { Request, Response } from 'express';
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from '../types/index.js';

export const createCommit = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(500).json({ error: 'User information is missing in the request.' });
    }

    try {
        const { title} = req.body;
        const newCommit = await prisma.commit.create({
            data: {
                title,
                userId,
            }
        })
        res.status(201).json(newCommit);
    } catch (error) {
        console.error('Error creating commit:', error);
        res.status(500).json({ error: 'An error occurred while creating the commit.' });
    }
}


export const getAllCommits = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(500).json({ error: 'User information is missing in the request.' });
    }

    try {
        const commits = await prisma.commit.findMany({
            where: {
                userId: userId
            }
        })
        res.status(200).json(commits);
    } catch (error) {
        console.error('Error fetching commits:', error);
        res.status(500).json({ error: 'An error occurred while fetching the commits.' });
    }
}