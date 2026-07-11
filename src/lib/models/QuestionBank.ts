import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionBank extends Document {
  question: string;
  type: 'Single Choice' | 'Multiple Choice' | 'True/False' | 'Descriptive';
  options: string[];
  correctAnswer: string;
  groupId: mongoose.Types.ObjectId;
  levelId: mongoose.Types.ObjectId;
  className: string;
  subject: string;
  mark: number;
  academicYear: string;
}

const QuestionBankSchema = new Schema<IQuestionBank>({
  question: { type: String, required: true },
  type: { type: String, enum: ['Single Choice', 'Multiple Choice', 'True/False', 'Descriptive'], required: true },
  options: { type: [String], default: [] },
  correctAnswer: { type: String, default: '' },
  groupId: { type: Schema.Types.ObjectId, ref: 'QuestionGroup', default: null },
  levelId: { type: Schema.Types.ObjectId, ref: 'QuestionLevel', default: null },
  className: { type: String, required: true },
  subject: { type: String, required: true },
  mark: { type: Number, default: 0 },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.QuestionBank || mongoose.model<IQuestionBank>('QuestionBank', QuestionBankSchema);
