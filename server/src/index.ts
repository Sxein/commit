import express, { Request, Response } from 'express';
import cors from 'cors';
import commitRoutes from './routes/commitRoutes.js';
import commitLogRoutes from './routes/commitLogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors(
    {
        origin: 'http://localhost:5173',
        credentials: true,
    }
));

app.use(express.json());
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
    res.send('Backend is up and running!');
});

app.use('/api/commits', commitRoutes);
app.use('/api/commits', commitLogRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});