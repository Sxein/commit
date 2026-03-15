import express, { Request, Response } from 'express';
import cors from 'cors';
import commitRoutes from './routes/commitRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
    res.send('Backend is up and running!');
});

app.use('/commits', commitRoutes);


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});