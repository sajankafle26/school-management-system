import mongoose, { Schema, Document } from 'mongoose';

export interface INotice extends Document {
  title: string;
  date: string;
  content: string;
  author: string;
  targetClass: string;
  targetSection: string;
  academicYear: string;
}

const NoticeSchema = new Schema<INotice>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, default: '' },
  targetClass: { type: String, default: 'All' },
  targetSection: { type: String, default: 'All' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Notice || mongoose.model<INotice>('Notice', NoticeSchema);
