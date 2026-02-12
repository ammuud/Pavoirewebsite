'use client';

import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function WishlistPage() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.get('/wishlist').then(setItems);
  }, []);

  return (
    <div className="space-y-5">
      <h1 className="luxury-title text-4xl">Wishlist</h1>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item.id} className="glass-card p-4">
            <img src={item.image_url} alt={item.name} className="h-40 w-full object-cover rounded-2xl" />
            <p className="mt-2 font-medium">{item.name}</p>
            <p className="text-rosegold">₹{item.price}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
