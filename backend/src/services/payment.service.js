import Razorpay from 'razorpay';
import { env } from '../config/env.js';
import { hmacSignature } from '../utils/crypto.js';

const razorpayEnabled = Boolean(env.razorpayKeyId && env.razorpayKeySecret);

export const razorpay = razorpayEnabled
  ? new Razorpay({
      key_id: env.razorpayKeyId,
      key_secret: env.razorpayKeySecret
    })
  : null;

export const createRazorpayOrder = async ({ amountInPaise, receipt }) => {
  if (!razorpay) {
    return {
      id: `mock_order_${Date.now()}`,
      amount: amountInPaise,
      currency: 'INR',
      receipt
    };
  }

  return razorpay.orders.create({
    amount: amountInPaise,
    currency: 'INR',
    receipt
  });
};

export const verifyRazorpaySignature = ({ razorpayOrderId, razorpayPaymentId, razorpaySignature }) => {
  if (!env.razorpayKeySecret) return true;
  const generated = hmacSignature(`${razorpayOrderId}|${razorpayPaymentId}`, env.razorpayKeySecret);
  return generated === razorpaySignature;
};

export const getPublicRazorpayConfig = () => ({
  key: env.razorpayKeyId,
  enabled: razorpayEnabled
});
