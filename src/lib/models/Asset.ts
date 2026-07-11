import mongoose, { Schema, Document } from 'mongoose';

export interface IAsset extends Document {
  name: string;
  categoryId: mongoose.Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  purchaseDate: string;
  condition: 'New' | 'Good' | 'Fair' | 'Damaged';
  description: string;
  academicYear: string;
}

const AssetSchema = new Schema<IAsset>({
  name: { type: String, required: true },
  categoryId: { type: Schema.Types.ObjectId, ref: 'AssetCategory', default: null },
  quantity: { type: Number, default: 1 },
  unitPrice: { type: Number, default: 0 },
  totalPrice: { type: Number, default: 0 },
  purchaseDate: { type: String, default: '' },
  condition: { type: String, enum: ['New', 'Good', 'Fair', 'Damaged'], default: 'New' },
  description: { type: String, default: '' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Asset || mongoose.model<IAsset>('Asset', AssetSchema);
