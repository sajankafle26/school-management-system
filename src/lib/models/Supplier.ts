import mongoose, { Schema, Document } from 'mongoose';

export interface ISupplier extends Document {
  name: string;
  contact: string;
  email: string;
  address: string;
}

const SupplierSchema = new Schema<ISupplier>({
  name: { type: String, required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Supplier || mongoose.model<ISupplier>('Supplier', SupplierSchema);
