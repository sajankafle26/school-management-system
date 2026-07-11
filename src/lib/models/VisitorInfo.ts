import mongoose, { Schema, Document } from 'mongoose';

export interface IVisitorInfo extends Document {
  name: string;
  contact: string;
  email: string;
  purpose: string;
  whomToMeet: string;
  date: string;
  inTime: string;
  outTime: string;
}

const VisitorInfoSchema = new Schema<IVisitorInfo>({
  name: { type: String, required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
  purpose: { type: String, default: '' },
  whomToMeet: { type: String, default: '' },
  date: { type: String, required: true },
  inTime: { type: String, default: '' },
  outTime: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.VisitorInfo || mongoose.model<IVisitorInfo>('VisitorInfo', VisitorInfoSchema);
