import mongoose, { Schema, model, models, type InferSchemaType } from 'mongoose';

const VariantSchema = new Schema(
  {
    id: { type: String, required: true },
    size: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const ProductSchema = new Schema(
  {
    // Human-friendly stable identifier used by the frontend (e.g. "tigernut-drink").
    slug: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Drinks', 'Delicacies'],
    },
    images: { type: [String], default: [] },
    variants: { type: [VariantSchema], default: [] },
  },
  { timestamps: true }
);

export type ProductDocument = InferSchemaType<typeof ProductSchema>;

export const ProductModel =
  (models.Product as mongoose.Model<ProductDocument>) ||
  model<ProductDocument>('Product', ProductSchema);
