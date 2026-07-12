import mongoose, { Schema, Document } from 'mongoose';

export interface IRoutine extends Document {
  className: string;
  section: string;
  day: string;
  periods: { period: number; subject: string; teacherId: number | null }[];
  academicYear: string;
}

const RoutineSchema = new Schema<IRoutine>({
  className: { type: String, required: true },
  section: { type: String, required: true },
  day: { type: String, required: true },
  periods: [{
    period: { type: Number, required: true },
    subject: { type: String, required: true },
    teacherId: { type: Number, default: null },
  }],
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Routine || mongoose.model<IRoutine>('Routine', RoutineSchema);
