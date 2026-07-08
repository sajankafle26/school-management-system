import mongoose, { Schema, Document } from 'mongoose';

export interface IAcademicYear extends Document {
  year: string;
  isCurrent: boolean;
}

const AcademicYearSchema = new Schema<IAcademicYear>({
  year: { type: String, required: true },
  isCurrent: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.AcademicYear || mongoose.model<IAcademicYear>('AcademicYear', AcademicYearSchema);
