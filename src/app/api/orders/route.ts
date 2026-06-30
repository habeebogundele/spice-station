import { NextResponse } from 'next/server';
import { createOrder, type CreateOrderInput } from '@/lib/orders';
import { buildWhatsAppUrl } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateOrderInput>;

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json({ error: 'Your cart is empty.' }, { status: 400 });
    }
    if (!body.customer?.name || !body.customer?.phone) {
      return NextResponse.json(
        { error: 'Customer name and phone number are required.' },
        { status: 400 }
      );
    }

    const order = await createOrder({
      items: body.items,
      customer: body.customer,
      note: body.note,
    });

    return NextResponse.json(
      { order, whatsappUrl: buildWhatsAppUrl(order) },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Failed to create order.';
    console.error('POST /api/orders failed:', error);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
