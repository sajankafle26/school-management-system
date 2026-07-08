import mongoose, { Schema, Document } from 'mongoose';

export interface ISubjectMark {
  subject: string;
  marksObtained: number;
  fullMarks: number;
}

export interface IResult extends Document {
  studentId: number;
  examType: 'First Terminal' | 'Mid Terminal' | 'Final Terminal';
  className: string;
  section: string;
  marks: ISubjectMark[];
  totalMarks: number;
  percentage: number;
  grade: string;
  remarks: string;
  rank: number | null;
  academicYear: string;
}

const SubjectMarkSchema = new Schema<ISubjectMark>({
  subject: { type: String, required: true },
  marksObtained: { type: Number, required: true },
  fullMarks: { type: Number, required: true },
}, { _id: false });

const ResultSchema = new Schema<IResult>({
  studentId: { type: Number, required: true },
  examType: { type: String, enum: ['First Terminal', 'Mid Terminal', 'Final Terminal'], required: true },
  className: { type: String, required: true },
  section: { type: String, required: true },
  marks: [SubjectMarkSchema],
  totalMarks: { type: Number, default: 0 },
  percentage: { type: Number, default: 0 },
  grade: { type: String, default: '' },
  remarks: { type: String, default: '' },
  rank: { type: Number, default: null },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
