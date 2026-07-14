import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { ProductModel } from '@/models/Product';
import { PRODUCTS } from '@/constants';

export const dynamic = 'force-dynamic';

/**
 * One-time (or repeatable) product seed for production.
 *
 * POST /api/seed
 * Header: Authorization: Bearer <SEED_SECRET>
 *
 * Set SEED_SECRET in Vercel Environment Variables, then call this once after deploy.
 */
export async function POST(request: Request) {
  try {
    const secret = process.env.SEED_SECRET;
    if (!secret) {
      return NextResponse.json(
        { error: 'SEED_SECRET is not configured on this deployment.' },
        { status: 503 }
      );
    }

    const auth = request.headers.get('authorization') || '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
    if (token !== secret) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }

    await connectToDatabase();
    await ProductModel.deleteMany({});
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

    return NextResponse.json({
      ok: true,
      seeded: PRODUCTS.length,
      message: 'Product catalogue seeded successfully.',
    });
  } catch (error) {
    console.error('POST /api/seed failed:', error);
    const message =
      error instanceof Error ? error.message : 'Failed to seed products.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
