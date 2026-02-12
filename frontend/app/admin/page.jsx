'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/admin/orders').then(setOrders).catch(() => setError('Admin access required. Login as admin email with OTP.'));
  }, []);

  return (
    <div className="space-y-4">
      <h1 className="luxury-title text-4xl">Admin Dashboard</h1>
      {error && <p className="text-red-500">{error}</p>}
      {orders.map((order) => (
        <div key={order.id} className="glass-card p-4 grid md:grid-cols-5 gap-3 text-sm">
          <p><strong>Order</strong> #{order.id}</p>
          <p><strong>Email</strong> {order.email}</p>
          <p><strong>Status</strong> {order.status}</p>
          <p><strong>Total</strong> ₹{order.total_amount}</p>
          <p><strong>Date</strong> {new Date(order.created_at).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}
