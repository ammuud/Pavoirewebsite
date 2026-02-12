'use client';

import { useEffect, useMemo, useState } from 'react';
import ProductCard from '../components/ProductCard';
import { api } from '../lib/api';

const categories = ['All', 'Vintage', 'Trending', 'New Arrivals', 'Earrings', 'Rings', 'Neckpieces', 'Anklets'];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');

  const fetchProducts = async () => {
    const query = new URLSearchParams();
    if (category !== 'All') query.set('category', category);
    if (search) query.set('search', search);
    const result = await api.get(`/products?${query.toString()}`);
    setProducts(result);
  };

  useEffect(() => {
    fetchProducts();
  }, [category]);

  const filtered = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  return (
    <div className="space-y-8">
      <section className="glass-card p-8 text-center">
        <h1 className="luxury-title text-5xl mb-4 text-rosegold">Luxury Crafted for Her Glow</h1>
        <p className="text-rose-900/70 max-w-2xl mx-auto">Discover premium, feminine jewellery in rose-gold palettes with contemporary elegance.</p>
      </section>

      <div className="glass-card p-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
        <input className="glass-input md:max-w-sm" placeholder="Search jewellery" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              className={category === cat ? 'glass-btn !py-2 !px-4 text-xs' : 'px-4 py-2 rounded-full bg-white/70 text-xs'}
              onClick={() => setCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((product) => <ProductCard key={product.id} product={product} onRefresh={fetchProducts} />)}
      </section>
    </div>
  );
}
