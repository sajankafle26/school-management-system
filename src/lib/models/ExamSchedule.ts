import mongoose, { Schema, Document } from 'mongoose';

export interface IExamSchedule extends Document {
  examId: mongoose.Types.ObjectId;
  subject: string;
  date: string;
  startTime: string;
  endTime: string;
  fullMarks: number;
  passMarks: number;
  academicYear: string;
}

const ExamScheduleSchema = new Schema<IExamSchedule>({
  examId: { type: Schema.Types.ObjectId, ref: 'Exam', required: true },
  subject: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  fullMarks: { type: Number, required: true },
  passMarks: { type: Number, required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.ExamSchedule || mongoose.model<IExamSchedule>('ExamSchedule', ExamScheduleSchema);
