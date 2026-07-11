import mongoose, { Schema, Document } from 'mongoose';

export interface IOnlineExam extends Document {
  name: string;
  className: string;
  section: string;
  subject: string;
  questions: string[];
  duration: number;
  startDate: string;
  endDate: string;
  attempt: number;
  passingMarks: number;
  academicYear: string;
}

const OnlineExamSchema = new Schema<IOnlineExam>({
  name: { type: String, required: true },
  className: { type: String, required: true },
  section: { type: String, default: '' },
  subject: { type: String, required: true },
  questions: { type: [String], default: [] },
  duration: { type: Number, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  attempt: { type: Number, default: 1 },
  passingMarks: { type: Number, required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.OnlineExam || mongoose.model<IOnlineExam>('OnlineExam', OnlineExamSchema);
