import { pool } from './pool.js';

const products = [
  ['Rose Halo Ring', 'Rings', 3299, 'Vintage rose-gold halo ring with cubic zirconia sparkle.', 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=900'],
  ['Pearl Drop Earrings', 'Earrings', 2199, 'Elegant freshwater pearl drops for evening glam.', 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=900'],
  ['Moonlit Neckpiece', 'Neckpieces', 4599, 'Layered moon motif neckpiece with blush stones.', 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=900'],
  ['Velvet Anklet', 'Anklets', 1899, 'Minimal rose-gold anklet for daily luxury wear.', 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900'],
  ['Trending Floral Studs', 'Trending', 1599, 'Floral studs in soft enamel finish.', 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=900'],
  ['New Arrival Charm Ring', 'New Arrivals', 2799, 'New season charm ring with dainty petals.', 'https://images.unsplash.com/photo-1603974372039-adc49044b6bd?w=900'],
  ['Vintage Royal Set', 'Vintage', 6599, 'Heritage-inspired necklace and earrings set.', 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=900']
];

for (const [name, category, price, description, imageUrl] of products) {
  await pool.query(
    `INSERT INTO products(name, category, price, description, image_url)
     VALUES($1, $2, $3, $4, $5)
     ON CONFLICT(name) DO NOTHING`,
    [name, category, price, description, imageUrl]
  );
}

await pool.query(
  `INSERT INTO users(email, role)
   VALUES('admin@pavoire.com', 'admin')
   ON CONFLICT(email) DO NOTHING`
);

console.log('Seed complete.');
await pool.end();
