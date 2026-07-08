import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  password: string;
  role: 'admin' | 'teacher' | 'student' | 'parent' | 'staff' | 'driver';
  name: string;
  profilePic: string;
  referenceId: number | null;
}

const UserSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'teacher', 'student', 'parent', 'staff', 'driver'], required: true },
  name: { type: String, required: true },
  profilePic: { type: String, default: '' },
  referenceId: { type: Number, default: null },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
