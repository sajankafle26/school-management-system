import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionGroup extends Document {
  name: string;
  academicYear: string;
}

const QuestionGroupSchema = new Schema<IQuestionGroup>({
  name: { type: String, required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.QuestionGroup || mongoose.model<IQuestionGroup>('QuestionGroup', QuestionGroupSchema);
