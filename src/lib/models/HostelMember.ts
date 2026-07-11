import mongoose, { Schema, Document } from 'mongoose';

export interface IHostelMember extends Document {
  studentId: mongoose.Types.ObjectId;
  hostelId: mongoose.Types.ObjectId;
  roomNumber: string;
  academicYear: string;
}

const HostelMemberSchema = new Schema<IHostelMember>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  hostelId: { type: Schema.Types.ObjectId, ref: 'Hostel', required: true },
  roomNumber: { type: String, default: '' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.HostelMember || mongoose.model<IHostelMember>('HostelMember', HostelMemberSchema);
