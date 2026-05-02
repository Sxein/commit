import { Request, Response } from 'express';
import { prisma } from "../../lib/prisma.js";

export const createCommitLog = async (req: Request, res: Response) => {
    const {commitId} = req.params;

    const { date } = req.body;

    try {
        if ( typeof commitId !== 'string' || isNaN(Number(commitId))) {
            return res.status(400).json({error: 'Invalid commitId or date parameter.'})
        }

        if (typeof date !== 'string' || isNaN(Date.parse(date))) {
            return res.status(400).json({error: 'Invalid date parameter.'})
        }
        const commitLog = await prisma.commitLog.create({
            data: {
                commitId: parseInt(commitId),
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

export const getCommitLogs = async (req: Request, res: Response) => {
    try {
        const {commitId} = req.params;
        if ( typeof commitId !== 'string' || isNaN(Number(commitId))) {
            return res.status(400).json({error: 'Invalid commitId parameter.'})
        }
        const commitLogs = await prisma.commitLog.findMany({
            where: {
                commitId : parseInt(commitId)
            }
        })
        res.status(200).json(commitLogs);
    }
    catch (error) {
        console.error('Error fetching commit logs:', error);
        res.status(500).json({ error: 'An error occurred while fetching the commit logs.' });
    }
}