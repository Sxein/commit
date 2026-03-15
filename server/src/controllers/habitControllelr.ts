// create commit
import { Request, Response } from 'express';
import { prisma } from "../../lib/prisma.js";

export const createCommit = async (req: Request, res: Response) => {
    try {
        const { title, userId} = req.body;
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


export const getAllCommits = async (req: Request, res: Response) => {
    // use req.params to get the userId
    const { userId } = req.params;
    try {
        if (typeof userId !== 'string') {
            return res.status(400).json({error: 'Invalid userId parameter.'})
        }
        const commits = await prisma.commit.findMany({
            where: {
                userId: parseInt(userId)
            }
        })
        res.status(200).json(commits);
    } catch (error) {
        console.error('Error fetching commits:', error);
        res.status(500).json({ error: 'An error occurred while fetching the commits.' });
    }
}