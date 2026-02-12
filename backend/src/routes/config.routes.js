import { Router } from 'express';
import { getPublicRazorpayConfig } from '../services/payment.service.js';

const router = Router();

router.get('/public', (_req, res) => {
  res.json({
    razorpay: getPublicRazorpayConfig(),
    addressProvider: 'openstreetmap'
  });
});

export default router;
