import mongoose, { Schema, Document } from 'mongoose';

export interface IClassSection extends Document {
  className: string;
  section: string;
  classTeacherId: string;
  capacity: number;
  academicYear: string;
  description?: string;
}

const ClassSectionSchema = new Schema<IClassSection>({
  className: { type: String, required: true },
  section: { type: String, required: true },
  classTeacherId: { type: String },
  capacity: { type: Number, default: 40 },
  academicYear: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

ClassSectionSchema.index({ className: 1, section: 1, academicYear: 1 }, { unique: true });

export default mongoose.models.ClassSection || mongoose.model<IClassSection>('ClassSection', ClassSectionSchema);