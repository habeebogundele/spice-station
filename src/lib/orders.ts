import { connectToDatabase } from './mongodb';
import { OrderModel, type OrderDocument } from '@/models/Order';
import { ProductModel, type ProductDocument } from '@/models/Product';
import type {
  CustomerInfo,
  Order,
  OrderItem,
  OrderStatus,
  TrackingResult,
  TrackingStep,
} from '@/types';

export interface CreateOrderInput {
  items: { productId: string; variantId: string; quantity: number }[];
  customer: CustomerInfo;
  note?: string;
}

function serializeOrder(doc: OrderDocument): Order {
  return {
    trackingId: doc.trackingId,
    items: (doc.items ?? []).map((item) => ({
      productId: item.productId,
      productName: item.productName,
      variantId: item.variantId,
      size: item.size,
      price: item.price,
      quantity: item.quantity,
    })),
    total: doc.total,
    customer: {
      name: doc.customer.name,
      phone: doc.customer.phone,
      address: doc.customer.address ?? undefined,
    },
    status: doc.status as OrderStatus,
    location: doc.location ?? undefined,
    note: doc.note ?? undefined,
    // timestamps are added by mongoose; cast since they aren't in InferSchemaType
    createdAt: (doc as unknown as { createdAt: Date }).createdAt?.toISOString() ?? '',
    updatedAt: (doc as unknown as { updatedAt: Date }).updatedAt?.toISOString() ?? '',
  };
}

async function generateTrackingId(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const candidate = `TM-${Math.floor(10000 + Math.random() * 90000)}`;
    const existing = await OrderModel.exists({ trackingId: candidate });
    if (!existing) return candidate;
  }
  // Fallback that is effectively collision-proof.
  return `TM-${Date.now().toString().slice(-6)}`;
}

export async function createOrder(input: CreateOrderInput): Promise<Order> {
  await connectToDatabase();

  if (!input.items || input.items.length === 0) {
    throw new Error('Your cart is empty.');
  }
  if (!input.customer?.name?.trim() || !input.customer?.phone?.trim()) {
    throw new Error('Customer name and phone number are required.');
  }

  const slugs = [...new Set(input.items.map((i) => i.productId))];
  const products = await ProductModel.find({ slug: { $in: slugs } }).lean<
    ProductDocument[]
  >();
  const productMap = new Map(products.map((p) => [p.slug, p]));

  const orderItems: OrderItem[] = [];
  for (const line of input.items) {
    const product = productMap.get(line.productId);
    if (!product) {
      throw new Error(`Product not found: ${line.productId}`);
    }
    const variant = (product.variants ?? []).find((v) => v.id === line.variantId);
    if (!variant) {
      throw new Error(`Variant not found for ${product.name}: ${line.variantId}`);
    }
    const quantity = Math.max(1, Math.floor(line.quantity));
    orderItems.push({
      productId: product.slug,
      productName: product.name,
      variantId: variant.id,
      size: variant.size,
      price: variant.price,
      quantity,
    });
  }

  const total = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const trackingId = await generateTrackingId();

  const created = await OrderModel.create({
    trackingId,
    items: orderItems,
    total,
    customer: {
      name: input.customer.name.trim(),
      phone: input.customer.phone.trim(),
      address: input.customer.address?.trim() || undefined,
    },
    note: input.note?.trim() || undefined,
    status: 'pending',
  });

  return serializeOrder(created.toObject() as OrderDocument);
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Awaiting Confirmation',
  confirmed: 'Order Confirmed',
  preparing: 'Being Prepared',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

/** Ordered pipeline used to build the visual tracking timeline. */
const STEP_PIPELINE: { key: OrderStatus; label: string }[] = [
  { key: 'confirmed', label: 'Order Received' },
  { key: 'preparing', label: 'Hygienic Prep' },
  { key: 'out_for_delivery', label: 'Out for Delivery' },
  { key: 'delivered', label: 'Delivered' },
];

function formatDate(value: string): string {
  if (!value) return '';
  return new Date(value).toLocaleString('en-GB', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function buildSteps(order: Order): TrackingStep[] {
  // pending is treated as the first pipeline stage being active.
  const statusRank: Record<OrderStatus, number> = {
    pending: 0,
    confirmed: 1,
    preparing: 2,
    out_for_delivery: 3,
    delivered: 4,
    cancelled: -1,
  };
  const currentRank = statusRank[order.status];

  return STEP_PIPELINE.map((step, index) => {
    const stepRank = index + 1;
    let status: TrackingStep['status'] = 'pending';
    if (order.status === 'cancelled') {
      status = 'pending';
    } else if (currentRank > stepRank) {
      status = 'completed';
    } else if (currentRank >= stepRank || (order.status === 'pending' && index === 0)) {
      status = currentRank > stepRank ? 'completed' : 'active';
    }
    return {
      label: step.label,
      date: index === 0 ? formatDate(order.createdAt) : '',
      status,
    };
  });
}

export async function getOrderTracking(
  trackingId: string
): Promise<TrackingResult | null> {
  await connectToDatabase();
  const normalized = trackingId.trim().toUpperCase();
  const doc = await OrderModel.findOne({ trackingId: normalized }).lean<
    OrderDocument | null
  >();
  if (!doc) return null;

  const order = serializeOrder(doc as OrderDocument);
  const lastUpdate =
    order.status === 'delivered'
      ? 'Your order has been delivered. Enjoy!'
      : order.status === 'cancelled'
        ? 'This order was cancelled.'
        : `Your order is currently: ${STATUS_LABELS[order.status]}.`;

  return {
    id: order.trackingId,
    status: STATUS_LABELS[order.status],
    lastUpdate,
    location: order.location || 'Lagos, Nigeria',
    steps: buildSteps(order),
  };
}
