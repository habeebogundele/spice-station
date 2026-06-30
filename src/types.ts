export interface ProductVariant {
  id: string;
  size: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Drinks' | 'Delicacies';
  variants: ProductVariant[];
  images: string[];
}

export interface CartItem {
  id: string; // unique cart item id (productId + variantId)
  productId: string;
  variantId: string;
  quantity: number;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  variantId: string;
  size: string;
  price: number;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  phone: string;
  address?: string;
}

export interface Order {
  trackingId: string;
  items: OrderItem[];
  total: number;
  customer: CustomerInfo;
  status: OrderStatus;
  location?: string;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingStep {
  label: string;
  date: string;
  status: 'completed' | 'active' | 'pending';
}

export interface TrackingResult {
  id: string;
  status: string;
  lastUpdate: string;
  location: string;
  steps: TrackingStep[];
}
