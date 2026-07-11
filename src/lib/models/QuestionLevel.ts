import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionLevel extends Document {
  name: string;
  academicYear: string;
}

const QuestionLevelSchema = new Schema<IQuestionLevel>({
  name: { type: String, required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.QuestionLevel || mongoose.model<IQuestionLevel>('QuestionLevel', QuestionLevelSchema);
