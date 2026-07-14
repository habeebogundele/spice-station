import type { Product } from '@/types';
import { PRODUCTS } from '@/constants';

function serializeProduct(doc: {
  slug: string;
  name: string;
  description: string;
  category: string;
  images?: string[];
  variants?: { id: string; size: string; price: number }[];
}): Product {
  return {
    id: doc.slug,
    name: doc.name,
    description: doc.description,
    category: doc.category as Product['category'],
    images: doc.images ?? [],
    variants: (doc.variants ?? []).map((v) => ({
      id: v.id,
      size: v.size,
      price: v.price,
    })),
  };
}

/**
 * Load products from MongoDB when available.
 * Falls back to the built-in catalogue so the storefront never goes blank
 * if MongoDB is unreachable or unseeded (common on first Vercel deploy).
 */
export async function getAllProducts(): Promise<Product[]> {
  try {
    const { connectToDatabase } = await import('./mongodb');
    const { ProductModel } = await import('@/models/Product');
    await connectToDatabase();
    const docs = await ProductModel.find().sort({ createdAt: 1 }).lean();
    if (docs.length > 0) {
      return docs.map((doc) => serializeProduct(doc as Parameters<typeof serializeProduct>[0]));
    }
  } catch (error) {
    console.error('MongoDB product load failed; using built-in catalogue.', error);
  }

  return PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { connectToDatabase } = await import('./mongodb');
    const { ProductModel } = await import('@/models/Product');
    await connectToDatabase();
    const doc = await ProductModel.findOne({ slug }).lean();
    if (doc) {
      return serializeProduct(doc as Parameters<typeof serializeProduct>[0]);
    }
  } catch (error) {
    console.error('MongoDB product lookup failed; checking built-in catalogue.', error);
  }

  return PRODUCTS.find((p) => p.id === slug) ?? null;
}
