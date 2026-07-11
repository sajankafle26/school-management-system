import mongoose, { Schema, Document } from 'mongoose';

export interface IProductCategory extends Document {
  name: string;
  description: string;
}

const ProductCategorySchema = new Schema<IProductCategory>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.ProductCategory || mongoose.model<IProductCategory>('ProductCategory', ProductCategorySchema);
