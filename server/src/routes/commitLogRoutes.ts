import { Router } from 'express';
import { createCommitLog, getCommitLogs } from '../controllers/commitLogController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const commitLogRoutes = Router();

commitLogRoutes.post('/:commitId/logs', authenticate, createCommitLog)
commitLogRoutes.get('/:commitId/logs', authenticate, getCommitLogs)

export default commitLogRoutes;