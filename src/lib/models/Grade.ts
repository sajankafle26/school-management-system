import mongoose, { Schema, Document } from 'mongoose';

export interface IGrade extends Document {
  name: string;
  gradePoint: number;
  markFrom: number;
  markTo: number;
  academicYear: string;
}

const GradeSchema = new Schema<IGrade>({
  name: { type: String, required: true },
  gradePoint: { type: Number, required: true },
  markFrom: { type: Number, required: true },
  markTo: { type: Number, required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Grade || mongoose.model<IGrade>('Grade', GradeSchema);
