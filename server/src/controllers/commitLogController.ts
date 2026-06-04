import { Request, Response } from 'express';
import { prisma } from "../../lib/prisma.js";
import { AuthRequest } from '../types/index.js';

export const createCommitLog = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(500).json({ error: 'User information is missing in the request.' });
    }

    const { commitId } = req.params;
    const { date } = req.body;
    const parsedId = Number(commitId);

    try {
        if (Number.isNaN(parsedId)) {
            return res.status(400).json({error: 'Invalid commitId parameter.'})
        }

        if (typeof date !== 'string' || Number.isNaN(Date.parse(date))) {
            return res.status(400).json({error: 'Invalid date parameter.'})
        }

        // Check if the commit exists and belongs to the user
        const commit = await prisma.commit.findFirst({
            where: {
                id: parsedId,
                userId: userId
            }
        });

        if (!commit) {
            return res.status(404).json({ error: 'Commit not found or you are not the owner.' });
        }

        const commitLog = await prisma.commitLog.create({
            data: {
                commitId: parsedId,
                date: date,
                isCompleted: true
            }
        })
        res.status(201).json(commitLog);
    }
    catch (error) {
        console.error('Error creating commit log:', error);
        res.status(500).json({ error: 'An error occurred while creating the commit log.' });
    }
}

export const getCommitLogs = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(500).json({ error: 'User information is missing in the request.' });
    }

    try {
        const { commitId } = req.params;
        const parsedId = Number(commitId);

        if (Number.isNaN(parsedId)) {
            return res.status(400).json({error: 'Invalid commitId parameter.'})
        }

        // Check if the commit exists and belongs to the user
        const commit = await prisma.commit.findFirst({
            where: {
                id: parsedId,
                userId: userId
            }
        });

        if (!commit) {
            return res.status(404).json({ error: 'Commit not found or you are not the owner.' });
        }

        const commitLogs = await prisma.commitLog.findMany({
            where: {
                commitId : parsedId
            }
        })
        res.status(200).json(commitLogs);
    }
    catch (error) {
        console.error('Error fetching commit logs:', error);
        res.status(500).json({ error: 'An error occurred while fetching the commit logs.' });
    }
}