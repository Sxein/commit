import {Router} from 'express';
import { createCommit, getAllCommits } from '../controllers/commitController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const commitRoutes = Router();

commitRoutes.post('/', authenticate, createCommit);
commitRoutes.get('/:userId', authenticate, getAllCommits);

export default commitRoutes;