import mongoose, { Schema, Document } from 'mongoose';

export interface IDriver extends Document {
  name: string;
  contact: string;
  licenseNumber: string;
  profilePic: string;
  busId: number | null;
}

const DriverSchema = new Schema<IDriver>({
  name: { type: String, required: true },
  contact: { type: String, default: '' },
  licenseNumber: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  busId: { type: Number, default: null },
}, { timestamps: true });

export default mongoose.models.Driver || mongoose.model<IDriver>('Driver', DriverSchema);
