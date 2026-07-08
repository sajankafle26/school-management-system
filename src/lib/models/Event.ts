import mongoose, { Schema, Document } from 'mongoose';

export interface IEvent extends Document {
  title: string;
  date: string;
  description: string;
  type: 'Holiday' | 'Event' | 'Exam';
  academicYear: string;
}

const EventSchema = new Schema<IEvent>({
  title: { type: String, required: true },
  date: { type: String, required: true },
  description: { type: String, default: '' },
  type: { type: String, enum: ['Holiday', 'Event', 'Exam'], required: true },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Event || mongoose.model<IEvent>('Event', EventSchema);
