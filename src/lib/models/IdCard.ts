import mongoose, { Schema, Document } from 'mongoose';

export interface IIdCard extends Document {
  title: string;
  description: string;
  layout: 'vertical' | 'horizontal';
  fields: string[];
  academicYear: string;
}

const IdCardSchema = new Schema<IIdCard>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  layout: { type: String, enum: ['vertical', 'horizontal'], default: 'vertical' },
  fields: { type: [String], default: [] },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.IdCard || mongoose.model<IIdCard>('IdCard', IdCardSchema);
