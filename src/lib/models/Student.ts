import mongoose, { Schema, Document } from 'mongoose';

export interface IStudent extends Document {
  name: string;
  nepaliName: string;
  className: string;
  section: string;
  roll: number;
  dob: string;
  guardianName: string;
  contact: string;
  address: string;
  profilePic: string;
  parentId: number | null;
  busId: number | null;
  rfidCardId: string;
  academicYear: string;
}

const StudentSchema = new Schema<IStudent>({
  name: { type: String, required: true },
  nepaliName: { type: String, default: '' },
  className: { type: String, required: true },
  section: { type: String, required: true },
  roll: { type: Number, required: true },
  dob: { type: String, default: '' },
  guardianName: { type: String, default: '' },
  contact: { type: String, default: '' },
  address: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  parentId: { type: Number, default: null },
  busId: { type: Number, default: null },
  rfidCardId: { type: String, default: '' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);
