import router from 'express';
import { createCommit, getAllCommits } from '../controllers/commitController.js';

const commitRoutes = router();

commitRoutes.post('/', createCommit);
commitRoutes.get('/:userId', getAllCommits);

export default commitRoutes;