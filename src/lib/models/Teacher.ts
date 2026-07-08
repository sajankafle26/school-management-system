import mongoose, { Schema, Document } from 'mongoose';

export interface ITeacher extends Document {
  name: string;
  nepaliName: string;
  subject: string;
  contact: string;
  email: string;
  profilePic: string;
  classTeacherOf: string;
}

const TeacherSchema = new Schema<ITeacher>({
  name: { type: String, required: true },
  nepaliName: { type: String, default: '' },
  subject: { type: String, required: true },
  contact: { type: String, default: '' },
  email: { type: String, default: '' },
  profilePic: { type: String, default: '' },
  classTeacherOf: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Teacher || mongoose.model<ITeacher>('Teacher', TeacherSchema);
