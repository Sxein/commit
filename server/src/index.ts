import express, { Request, Response } from 'express';
import cors from 'cors';
import commitRoutes from './routes/commitRoutes.js';
import commitLogRoutes from './routes/commitLogRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Backend is up and running!');
});

app.use('/api/commits', commitRoutes);
app.use('/api/commits', commitLogRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});