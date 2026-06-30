import HomeClient from '@/components/HomeClient';
import { getAllProducts } from '@/lib/products';
import type { Product } from '@/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let products: Product[] = [];
  try {
    products = await getAllProducts();
  } catch (error) {
    console.error('Failed to load products for home page:', error);
  }

  return <HomeClient products={products} />;
}
