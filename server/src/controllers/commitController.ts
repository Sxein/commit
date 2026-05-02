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
        const { title } = req.body;
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

export const deleteCommit = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(500).json({ error: 'User information is missing in the request.' });
    }

    try {
        const { commitId } = req.params;
        const deletedCommit = await prisma.commit.deleteMany({
            where: {
                id: Number(commitId),
                userId: userId
            }
        })
        if (deletedCommit.count === 0) {
            return res.status(404).json({ error: 'Commit not found or you are not the owner.' });
        }
        res.status(200).json({ message: 'Commit deleted successfully.', deletedCount: deletedCommit.count });
    }
    catch (error) {
        console.error('Error deleting commit:', error);
        res.status(500).json({ error: 'An error occurred while deleting the commit.' });
    }
}

export const updateCommit = async (req: AuthRequest, res: Response) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(500).json({ error: 'User information is missing in the request.' });
    }

    try {
        const { commitId } = req.params;
        const { title } = req.body;

        const updatedCommit = await prisma.commit.updateMany({
            where: {
                id: Number(commitId),
                userId: userId
            },
            data: {
                title
            }
        })
        if (updatedCommit.count === 0) {
            return res.status(404).json({ error: 'Commit not found or you are not the owner.' });
        }
        res.status(200).json({ message: 'Commit updated successfully.', updatedCount: updatedCommit.count });
    } catch (error) {
        console.error('Error updating commit:', error);
        res.status(500).json({ error: 'An error occurred while updating the commit.' });
    }
}