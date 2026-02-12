import { Router } from 'express';
import { pool } from '../db/pool.js';

const router = Router();

router.get('/', async (req, res) => {
  const { category, search } = req.query;
  const clauses = [];
  const values = [];

  if (category) {
    values.push(category);
    clauses.push(`category = $${values.length}`);
  }

  if (search) {
    values.push(`%${search}%`);
    clauses.push(`(name ILIKE $${values.length} OR description ILIKE $${values.length})`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
  const query = `SELECT * FROM products ${where} ORDER BY created_at DESC`;
  const result = await pool.query(query, values);
  res.json(result.rows);
});

router.get('/:id', async (req, res) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id]);
  const product = result.rows[0];
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json(product);
});

export default router;
