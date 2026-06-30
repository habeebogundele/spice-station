import { connectToDatabase } from './mongodb';
import { ProductModel, type ProductDocument } from '@/models/Product';
import type { Product } from '@/types';

function serializeProduct(doc: ProductDocument): Product {
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

export async function getAllProducts(): Promise<Product[]> {
  await connectToDatabase();
  const docs = await ProductModel.find().sort({ createdAt: 1 }).lean<ProductDocument[]>();
  return docs.map(serializeProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await connectToDatabase();
  const doc = await ProductModel.findOne({ slug }).lean<ProductDocument | null>();
  return doc ? serializeProduct(doc) : null;
}
