import { Router } from 'express';
import QRCode from 'qrcode';
import { pool } from '../db/pool.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { createRazorpayOrder, verifyRazorpaySignature } from '../services/payment.service.js';
import { generateInvoiceHtml } from '../services/invoice.service.js';
import { sendEmail } from '../services/email.service.js';
import { env } from '../config/env.js';

const router = Router();
router.use(requireAuth);

router.post('/checkout/create-order', async (req, res) => {
  const { address } = req.body;

  const cartResult = await pool.query(
    `SELECT c.quantity, p.id, p.name, p.price
     FROM cart c
     JOIN products p ON p.id = c.product_id
     WHERE c.user_id = $1`,
    [req.user.userId]
  );

  if (!cartResult.rowCount) return res.status(400).json({ message: 'Cart is empty' });

  const items = cartResult.rows;
  const total = items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);

  const orderInsert = await pool.query(
    `INSERT INTO orders(user_id, total_amount, status, address)
     VALUES($1, $2, 'PENDING', $3)
     RETURNING *`,
    [req.user.userId, total, address]
  );

  const order = orderInsert.rows[0];
  for (const item of items) {
    await pool.query(
      `INSERT INTO order_items(order_id, product_id, quantity, price)
       VALUES($1, $2, $3, $4)`,
      [order.id, item.id, item.quantity, item.price]
    );
  }

  const razorpayOrder = await createRazorpayOrder({
    amountInPaise: total * 100,
    receipt: `ord_${order.id}`
  });

  await pool.query('UPDATE orders SET razorpay_order_id = $1 WHERE id = $2', [razorpayOrder.id, order.id]);

  return res.json({
    orderId: order.id,
    razorpayOrder,
    amount: total,
    email: req.user.email
  });
});

router.post('/checkout/verify-payment', async (req, res) => {
  const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

  const verified = verifyRazorpaySignature({ razorpayOrderId, razorpayPaymentId, razorpaySignature });
  if (!verified) return res.status(400).json({ message: 'Invalid payment signature' });

  const orderResult = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [orderId, req.user.userId]);
  const order = orderResult.rows[0];
  if (!order) return res.status(404).json({ message: 'Order not found' });

  await pool.query(
    `UPDATE orders
     SET status = 'PAID', payment_id = $1, paid_at = NOW()
     WHERE id = $2`,
    [razorpayPaymentId || 'mock_payment_success', orderId]
  );

  const orderItemsResult = await pool.query(
    `SELECT oi.quantity, oi.price, p.name
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = $1`,
    [orderId]
  );

  const qrCode = await QRCode.toDataURL(`Pavoire Order ${orderId} | Payment ${razorpayPaymentId}`);
  await pool.query('UPDATE orders SET qr_code = $1 WHERE id = $2', [qrCode, orderId]);

  const invoiceHtml = generateInvoiceHtml({
    orderId,
    customerEmail: req.user.email,
    address: order.address,
    items: orderItemsResult.rows,
    total: order.total_amount,
    paymentId: razorpayPaymentId
  });

  await sendEmail({
    to: req.user.email,
    subject: `Order Confirmed #${orderId}`,
    html: `${invoiceHtml}<p><img src="${qrCode}" width="140" /></p>`
  });

  await sendEmail({
    to: env.adminEmail,
    subject: `New Paid Order #${orderId}`,
    html: `<p>Customer: ${req.user.email}</p><p>Address: ${order.address}</p><p>Payment ID: ${razorpayPaymentId}</p><p>Total: ₹${order.total_amount}</p>`
  });

  await pool.query('DELETE FROM cart WHERE user_id = $1', [req.user.userId]);

  return res.json({ message: 'Payment verified and order confirmed', orderId, qrCode });
});

router.get('/my-orders', async (req, res) => {
  const result = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.userId]);
  res.json(result.rows);
});

export default router;
