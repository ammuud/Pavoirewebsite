'use client';

import Link from 'next/link';
import { Gem, Heart, ShoppingBag } from 'lucide-react';

export default function Navbar() {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-xl bg-white/55 border-b border-white/70">
      <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-rosegold font-semibold">
          <Gem size={20} />
          <span className="luxury-title text-2xl">Pavoire</span>
        </Link>
        <div className="flex items-center gap-5 text-sm font-medium">
          <Link href="/wishlist" className="hover:text-rosegold transition"><Heart size={18} /></Link>
          <Link href="/cart" className="hover:text-rosegold transition"><ShoppingBag size={18} /></Link>
          <Link href="/admin" className="glass-btn text-xs px-4 py-2">Admin</Link>
        </div>
      </nav>
    </header>
  );
}
