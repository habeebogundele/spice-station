import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const OrderItemSchema = new Schema(
  {
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    variantId: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const CustomerSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String },
  },
  { _id: false }
);

const ORDER_STATUSES = [
  'pending',
  'confirmed',
  'preparing',
  'out_for_delivery',
  'delivered',
  'cancelled',
] as const;

const OrderSchema = new Schema(
  {
    trackingId: { type: String, required: true, unique: true, index: true },
    items: { type: [OrderItemSchema], required: true },
    total: { type: Number, required: true, min: 0 },
    customer: { type: CustomerSchema, required: true },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: 'pending',
    },
    location: { type: String },
    note: { type: String },
  },
  { timestamps: true }
);

export type OrderDocument = InferSchemaType<typeof OrderSchema>;

export const OrderModel =
  (models.Order as mongoose.Model<OrderDocument>) ||
  model<OrderDocument>('Order', OrderSchema);
