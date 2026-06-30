import { config } from 'dotenv';
// Load .env.local first (Next.js convention), then fall back to .env.
config({ path: '.env.local' });
config();

import mongoose from 'mongoose';
import { ProductModel } from '../models/Product';
import { PRODUCTS } from '../constants';

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Missing MONGODB_URI. Set it in .env.local before seeding.');
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);

  console.log('Clearing existing products...');
  await ProductModel.deleteMany({});

  console.log(`Seeding ${PRODUCTS.length} products...`);
  await ProductModel.insertMany(
    PRODUCTS.map((p) => ({
      slug: p.id,
      name: p.name,
      description: p.description,
      category: p.category,
      images: p.images,
      variants: p.variants,
    }))
  );

  console.log('Seed complete.');
  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error('Seed failed:', error);
  process.exit(1);
});
