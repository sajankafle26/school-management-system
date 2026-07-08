import mongoose, { Schema, Document } from 'mongoose';

export interface IStaff extends Document {
  name: string;
  nepaliName: string;
  jobTitle: string;
  contact: string;
  email: string;
  profilePic: string;
}

const StaffSchema = new Schema<IStaff>({
  name: { type: String, required: true },
  nepaliName: { type: String, default: '' },
  jobTitle: { type: String, required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
  profilePic: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Staff || mongoose.model<IStaff>('Staff', StaffSchema);
