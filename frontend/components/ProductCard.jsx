'use client';

import Link from 'next/link';
import { Heart } from 'lucide-react';
import { api } from '../lib/api';

export default function ProductCard({ product, onRefresh }) {
  const addToCart = async () => {
    await api.post('/cart', { productId: product.id, quantity: 1 });
    onRefresh?.();
  };

  const addToWishlist = async () => {
    await api.post('/wishlist', { productId: product.id });
  };

  return (
    <div className="glass-card p-4 group transition hover:-translate-y-1">
      <Link href={`/product/${product.id}`}>
        <img src={product.image_url} alt={product.name} className="h-56 w-full rounded-2xl object-cover" />
      </Link>
      <div className="mt-4 space-y-2">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold">{product.name}</h3>
          <button onClick={addToWishlist} className="p-2 rounded-full bg-white/70 hover:bg-white">
            <Heart size={16} />
          </button>
        </div>
        <p className="text-sm text-rose-900/70">{product.category}</p>
        <p className="font-semibold text-rosegold">₹{product.price}</p>
        <button className="glass-btn w-full" onClick={addToCart}>Add to Cart</button>
      </div>
    </div>
  );
}
