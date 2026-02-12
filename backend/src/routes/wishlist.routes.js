import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const result = await pool.query(
    `SELECT w.id, p.*
     FROM wishlist w
     JOIN products p ON w.product_id = p.id
     WHERE w.user_id = $1`,
    [req.user.userId]
  );
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { productId } = req.body;
  await pool.query(
    `INSERT INTO wishlist(user_id, product_id)
     VALUES($1, $2)
     ON CONFLICT(user_id, product_id) DO NOTHING`,
    [req.user.userId, productId]
  );
  res.json({ message: 'Added to wishlist' });
});

router.delete('/:productId', async (req, res) => {
  await pool.query('DELETE FROM wishlist WHERE user_id = $1 AND product_id = $2', [req.user.userId, req.params.productId]);
  res.json({ message: 'Removed from wishlist' });
});

export default router;
