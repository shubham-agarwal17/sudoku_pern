import express from 'express';
import cors from 'cors';
import dbPool from './db.js';
import router from './routes/puzzles.js';

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/api/db-health', async (req, res) => {
    try {
        const result = await dbPool.query('SELECT NOW()');
        res.json({ status: 'ok', db_time: result.rows[0].now });
    } catch (err) {
        res.status(500).json({ dbStatus: 'error', error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});