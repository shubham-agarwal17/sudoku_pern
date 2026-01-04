import express from 'express';
import dbPool from '../db.js';
import e from 'express';

const router = express.Router();

router.get('/puzzles', async (req, res) => {
    try {
        const { difficulty } = req.query;

        let query = 'SELECT id, difficulty, initial_grid, solution_grid FROM puzzles';
        let params = [];

        console.log('🔍 Query params:', req.query);  // Add
        console.log('🔍 SQL:', query, params);  

        if (difficulty) {
            query += ' WHERE difficulty = $1';
            params = [difficulty];
        }

        const result = await dbPool.query(query, params);
        console.log('📊 Rows found:', result.rows.length);  // Add

        res.json(result.rows);
    } catch (err) {
        console.error('❌ Error:', err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/puzzles/:id', async (req, res) => {
    try {
        const result = await dbPool.query(
            'SELECT id, difficulty, initial_grid, solution_grid FROM puzzles WHERE id = $1', 
            [req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Puzzle not found' });
        }

        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });x
    }
});

export default router;