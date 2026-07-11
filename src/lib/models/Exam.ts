import mongoose, { Schema, Document } from 'mongoose';

export interface IExam extends Document {
  name: string;
  type: 'First Terminal' | 'Mid Terminal' | 'Final Terminal' | 'Pre-Board';
  startDate: string;
  endDate: string;
  className: string;
  section: string;
  academicYear: string;
}

const ExamSchema = new Schema<IExam>({
  name: { type: String, required: true },
  type: { type: String, enum: ['First Terminal', 'Mid Terminal', 'Final Terminal', 'Pre-Board'], required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, default: '' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Exam || mongoose.model<IExam>('Exam', ExamSchema);
