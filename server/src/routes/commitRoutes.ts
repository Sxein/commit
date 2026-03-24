import {Router} from 'express';
import { createCommit, getAllCommits } from '../controllers/commitController.js';

const commitRoutes = Router();

commitRoutes.post('/', createCommit);
commitRoutes.get('/:userId', getAllCommits);

export default commitRoutes;