import mongoose, { Schema, Document } from 'mongoose';

export interface IAssetCategory extends Document {
  name: string;
  description: string;
}

const AssetCategorySchema = new Schema<IAssetCategory>({
  name: { type: String, required: true },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.AssetCategory || mongoose.model<IAssetCategory>('AssetCategory', AssetCategorySchema);
