import { Router } from 'express';
import { pool } from '../db/pool.js';
import { requireAuth, requireAdmin } from '../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth, requireAdmin);

router.get('/orders', async (_req, res) => {
  const result = await pool.query(
    `SELECT o.*, u.email
     FROM orders o
     JOIN users u ON u.id = o.user_id
     ORDER BY o.created_at DESC`
  );
  res.json(result.rows);
});

router.get('/orders/:id', async (req, res) => {
  const orderResult = await pool.query(
    `SELECT o.*, u.email
     FROM orders o JOIN users u ON u.id = o.user_id
     WHERE o.id = $1`,
    [req.params.id]
  );
  if (!orderResult.rowCount) return res.status(404).json({ message: 'Order not found' });

  const itemsResult = await pool.query(
    `SELECT oi.*, p.name, p.image_url
     FROM order_items oi JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [req.params.id]
  );

  return res.json({ order: orderResult.rows[0], items: itemsResult.rows });
});

export default router;
