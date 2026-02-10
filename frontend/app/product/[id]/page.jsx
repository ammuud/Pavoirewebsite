'use client';

import { useEffect, useState } from 'react';
import { api } from '../../../lib/api';

export default function ProductDetailPage({ params }) {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    api.get(`/products/${params.id}`).then(setProduct);
  }, [params.id]);

  const addToCart = async () => {
    await api.post('/cart', { productId: product.id, quantity: 1 });
  };

  const addToWishlist = async () => {
    await api.post('/wishlist', { productId: product.id });
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="glass-card p-4">
        <img src={product.image_url} alt={product.name} className="w-full h-[420px] object-cover rounded-2xl" />
      </div>
      <div className="glass-card p-6 space-y-4">
        <h1 className="luxury-title text-4xl">{product.name}</h1>
        <p className="text-rose-900/80">{product.description}</p>
        <p className="text-3xl text-rosegold font-semibold">₹{product.price}</p>
        <div className="flex gap-3">
          <button className="glass-btn" onClick={addToCart}>Add to Cart</button>
          <button className="px-5 py-3 rounded-full bg-white/70" onClick={addToWishlist}>Add to Wishlist</button>
        </div>
      </div>
    </div>
  );
}
