import mongoose, { Schema, Document } from 'mongoose';

export interface IComplaint extends Document {
  title: string;
  description: string;
  date: string;
  complainantName: string;
  contact: string;
  status: 'Pending' | 'Resolved' | 'Rejected';
  academicYear: string;
}

const ComplaintSchema = new Schema<IComplaint>({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  date: { type: String, required: true },
  complainantName: { type: String, required: true },
  contact: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Resolved', 'Rejected'], default: 'Pending' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Complaint || mongoose.model<IComplaint>('Complaint', ComplaintSchema);
