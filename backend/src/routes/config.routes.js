import { Router } from 'express';
import { getPublicRazorpayConfig } from '../services/payment.service.js';
import { env } from '../config/env.js';

const router = Router();

router.get('/public', (_req, res) => {
  res.json({
    razorpay: getPublicRazorpayConfig(),
    googlePlacesApiKey: env.googlePlacesApiKey
  });
});

export default router;
