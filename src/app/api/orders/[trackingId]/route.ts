import { NextResponse } from 'next/server';
import { getOrderTracking } from '@/lib/orders';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const { trackingId } = await params;
    const tracking = await getOrderTracking(trackingId);
    if (!tracking) {
      return NextResponse.json(
        { error: 'Order ID not found. Please check your confirmation message.' },
        { status: 404 }
      );
    }
    return NextResponse.json({ tracking });
  } catch (error) {
    console.error('GET /api/orders/[trackingId] failed:', error);
    return NextResponse.json(
      { error: 'Failed to track order.' },
      { status: 500 }
    );
  }
}
