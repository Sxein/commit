import { Router } from 'express';
import { createCommitLog, getCommitLogs } from '../controllers/commitLogController.js';

const commitLogRoutes = Router();

commitLogRoutes.post('/:commitId/logs', createCommitLog)
commitLogRoutes.get('/:commitId/logs', getCommitLogs)

export default commitLogRoutes;