'use client';

import { useEffect, useState } from 'react';
import { api } from '../lib/api';

export default function CheckoutModal({ onClose, onSuccess }) {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [address, setAddress] = useState('');
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [orderPayload, setOrderPayload] = useState(null);
  const [razorpayConfig, setRazorpayConfig] = useState({ enabled: false, key: '' });

  useEffect(() => {
    api.get('/config/public').then((c) => setRazorpayConfig(c.razorpay));
  }, []);

  const requestOtp = async () => {
    setLoading(true);
    await api.post('/auth/request-otp', { email });
    setStep(2);
    setLoading(false);
  };

  const verifyOtp = async () => {
    setLoading(true);
    const result = await api.post('/auth/verify-otp', { email, otp });
    localStorage.setItem('pavoire_token', result.token);
    setStep(3);
    setLoading(false);
  };

  const preparePayment = async () => {
    setLoading(true);
    const order = await api.post('/orders/checkout/create-order', { address });
    setOrderPayload(order);
    setStep(4);
    setLoading(false);
  };

  const payNow = async () => {
    if (!orderPayload) return;
    if (!razorpayConfig.enabled) {
      await api.post('/orders/checkout/verify-payment', {
        orderId: orderPayload.orderId,
        razorpayOrderId: orderPayload.razorpayOrder.id,
        razorpayPaymentId: `mock_pay_${Date.now()}`,
        razorpaySignature: 'mock_signature'
      });
      onSuccess();
      return;
    }

    const rzp = new window.Razorpay({
      key: razorpayConfig.key,
      amount: orderPayload.razorpayOrder.amount,
      order_id: orderPayload.razorpayOrder.id,
      name: 'Pavoire Jewellery',
      description: `Order #${orderPayload.orderId}`,
      handler: async (resp) => {
        await api.post('/orders/checkout/verify-payment', {
          orderId: orderPayload.orderId,
          razorpayOrderId: resp.razorpay_order_id,
          razorpayPaymentId: resp.razorpay_payment_id,
          razorpaySignature: resp.razorpay_signature
        });
        onSuccess();
      },
      prefill: { email }
    });
    rzp.open();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm grid place-items-center p-4 z-40">
      <div className="glass-card w-full max-w-lg p-6">
        <h3 className="luxury-title text-2xl mb-4">Secure Checkout</h3>
        {step === 1 && (
          <div className="space-y-3">
            <p className="text-sm">Step 1: Enter your email to receive OTP.</p>
            <input className="glass-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            <button className="glass-btn w-full" onClick={requestOtp} disabled={loading}>Send OTP</button>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-3">
            <p className="text-sm">Step 2: Verify OTP.</p>
            <input className="glass-input" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit OTP" />
            <button className="glass-btn w-full" onClick={verifyOtp} disabled={loading}>Verify OTP</button>
          </div>
        )}
        {step === 3 && (
          <div className="space-y-3">
            <p className="text-sm">Step 3: Add delivery address (Google Places ready input).</p>
            <input className="glass-input" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Search & select address" />
            <button className="glass-btn w-full" onClick={preparePayment} disabled={loading}>Continue to Payment</button>
          </div>
        )}
        {step === 4 && (
          <div className="space-y-3">
            <p className="text-sm">Step 4: OTP verified — Pay Now enabled.</p>
            <button className="glass-btn w-full" onClick={payNow}>Pay Now</button>
          </div>
        )}
        <button className="mt-4 text-xs underline" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
