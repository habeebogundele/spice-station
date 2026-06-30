import { NextResponse } from 'next/server';
import { getProductBySlug } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const product = await getProductBySlug(id);
    if (!product) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }
    return NextResponse.json({ product });
  } catch (error) {
    console.error('GET /api/products/[id] failed:', error);
    return NextResponse.json(
      { error: 'Failed to load product.' },
      { status: 500 }
    );
  }
}
