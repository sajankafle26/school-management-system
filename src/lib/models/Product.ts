import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  unit: string;
  price: number;
  stock: number;
  description: string;
}

const ProductSchema = new Schema<IProduct>({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'ProductCategory', default: null },
  unit: { type: String, default: '' },
  price: { type: Number, default: 0 },
  stock: { type: Number, default: 0 },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);
