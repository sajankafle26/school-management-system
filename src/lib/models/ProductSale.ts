import mongoose, { Schema, Document } from 'mongoose';

export interface IProductSale extends Document {
  invoiceNo: string;
  date: string;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  academicYear: string;
}

const ProductSaleSchema = new Schema<IProductSale>({
  invoiceNo: { type: String, required: true },
  date: { type: String, required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ProductSale || mongoose.model<IProductSale>('ProductSale', ProductSaleSchema);
