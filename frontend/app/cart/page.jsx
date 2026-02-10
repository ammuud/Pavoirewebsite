'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '../../lib/api';
import CheckoutModal from '../../components/CheckoutModal';

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);

  const fetchCart = async () => {
    const result = await api.get('/cart');
    setCart(result);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = useMemo(() => cart.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0), [cart]);

  return (
    <div className="space-y-6">
      <h1 className="luxury-title text-4xl">Your Cart</h1>
      <div className="space-y-4">
        {cart.map((item) => (
          <div key={item.id} className="glass-card p-4 flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-sm">Qty: {item.quantity}</p>
            </div>
            <p className="font-semibold text-rosegold">₹{Number(item.price) * item.quantity}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-5 flex items-center justify-between">
        <p className="text-xl">Total: <strong>₹{total}</strong></p>
        <button className="glass-btn" onClick={() => setShowCheckout(true)}>Checkout</button>
      </div>
      {showCheckout && <CheckoutModal onClose={() => setShowCheckout(false)} onSuccess={() => { setShowCheckout(false); fetchCart(); }} />}
    </div>
  );
}
