import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);

router.get('/', async (req, res) => {
  const result = await pool.query(
    `SELECT c.id, c.quantity, p.*
     FROM cart c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = $1`,
    [req.user.userId]
  );
  res.json(result.rows);
});

router.post('/', async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  await pool.query(
    `INSERT INTO cart(user_id, product_id, quantity)
     VALUES($1, $2, $3)
     ON CONFLICT(user_id, product_id) DO UPDATE SET quantity = cart.quantity + EXCLUDED.quantity, updated_at = NOW()`,
    [req.user.userId, productId, quantity]
  );
  res.json({ message: 'Added to cart' });
});

router.patch('/:productId', async (req, res) => {
  const { quantity } = req.body;
  await pool.query('UPDATE cart SET quantity = $1 WHERE user_id = $2 AND product_id = $3', [quantity, req.user.userId, req.params.productId]);
  res.json({ message: 'Cart updated' });
});

router.delete('/:productId', async (req, res) => {
  await pool.query('DELETE FROM cart WHERE user_id = $1 AND product_id = $2', [req.user.userId, req.params.productId]);
  res.json({ message: 'Removed from cart' });
});

export default router;
