import mongoose, { Schema, Document } from 'mongoose';

export interface IHostel extends Document {
  name: string;
  type: 'Boys' | 'Girls' | 'Combined';
  address: string;
  wardenName: string;
  wardenContact: string;
  rooms: number;
  capacity: number;
  academicYear: string;
}

const HostelSchema = new Schema<IHostel>({
  name: { type: String, required: true },
  type: { type: String, enum: ['Boys', 'Girls', 'Combined'], required: true },
  address: { type: String, default: '' },
  wardenName: { type: String, default: '' },
  wardenContact: { type: String, default: '' },
  rooms: { type: Number, default: 0 },
  capacity: { type: Number, default: 0 },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Hostel || mongoose.model<IHostel>('Hostel', HostelSchema);
