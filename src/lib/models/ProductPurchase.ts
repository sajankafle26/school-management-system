import mongoose, { Schema, Document } from 'mongoose';

export interface IProductPurchase extends Document {
  invoiceNo: string;
  date: string;
  supplierId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  academicYear: string;
}

const ProductPurchaseSchema = new Schema<IProductPurchase>({
  invoiceNo: { type: String, required: true },
  date: { type: String, required: true },
  supplierId: { type: Schema.Types.ObjectId, ref: 'Supplier', required: true },
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: Number, required: true },
  totalAmount: { type: Number, required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ProductPurchase || mongoose.model<IProductPurchase>('ProductPurchase', ProductPurchaseSchema);
