import mongoose, { Schema, Document } from 'mongoose';

export interface IHomework extends Document {
  className: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  assignedByTeacherId: number;
  dueDate: string;
  imageUrl: string;
  academicYear: string;
  status: string;
  priority: string;
}

const HomeworkSchema = new Schema<IHomework>({
  className: { type: String, required: true },
  section: { type: String, default: '' },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedByTeacherId: { type: Number, default: 0 },
  dueDate: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  academicYear: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  priority: { type: String, default: 'Medium' },
}, { timestamps: true });

export default mongoose.models.Homework || mongoose.model<IHomework>('Homework', HomeworkSchema);
