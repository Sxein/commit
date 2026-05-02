import {Router} from 'express';
import { createCommit, getAllCommits, deleteCommit, updateCommit } from '../controllers/commitController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const commitRoutes = Router();

commitRoutes.post('/', authenticate, createCommit);
commitRoutes.put('/:commitId', authenticate, updateCommit);
commitRoutes.delete('/:commitId', authenticate, deleteCommit);
commitRoutes.get('/', authenticate, getAllCommits);

export default commitRoutes;