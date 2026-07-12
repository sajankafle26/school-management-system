import mongoose, { Schema, Document } from 'mongoose';

export interface IAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface IHomework extends Document {
  className: string;
  section: string;
  subject: string;
  title: string;
  description: string;
  assignedByTeacherId: number;
  dueDate: string;
  attachments: IAttachment[];
  academicYear: string;
  status: string;
  priority: string;
}

const AttachmentSchema = new Schema<IAttachment>({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: '' },
  size: { type: Number, default: 0 },
}, { _id: false });

const HomeworkSchema = new Schema<IHomework>({
  className: { type: String, required: true },
  section: { type: String, default: '' },
  subject: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  assignedByTeacherId: { type: Number, default: 0 },
  dueDate: { type: String, default: '' },
  attachments: { type: [AttachmentSchema], default: [] },
  academicYear: { type: String, required: true },
  status: { type: String, default: 'Pending' },
  priority: { type: String, default: 'Medium' },
}, { timestamps: true });

export default mongoose.models.Homework || mongoose.model<IHomework>('Homework', HomeworkSchema);
