import type { Order } from '@/types';

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2347013323029';

const naira = (value: number) => `\u20A6${value.toLocaleString()}`;

/**
 * Builds the prefilled WhatsApp message a customer sends to complete checkout.
 */
export function buildOrderMessage(order: Order): string {
  const lines: string[] = [];
  lines.push("Hello Temmy's Spice Station! I'd like to complete my order.");
  lines.push('');
  lines.push(`*Order ID:* ${order.trackingId}`);
  lines.push(`*Name:* ${order.customer.name}`);
  lines.push(`*Phone:* ${order.customer.phone}`);
  if (order.customer.address) {
    lines.push(`*Delivery Address:* ${order.customer.address}`);
  }
  lines.push('');
  lines.push('*Items:*');
  order.items.forEach((item) => {
    lines.push(
      `- ${item.quantity}x ${item.productName} (${item.size}) — ${naira(
        item.price * item.quantity
      )}`
    );
  });
  lines.push('');
  lines.push(`*Total:* ${naira(order.total)}`);
  if (order.note) {
    lines.push('');
    lines.push(`*Note:* ${order.note}`);
  }
  lines.push('');
  lines.push('Please confirm availability and delivery details. Thank you!');
  return lines.join('\n');
}

export function buildWhatsAppUrl(order: Order, phoneNumber: string = WHATSAPP_NUMBER): string {
  const text = encodeURIComponent(buildOrderMessage(order));
  return `https://wa.me/${phoneNumber}?text=${text}`;
}
