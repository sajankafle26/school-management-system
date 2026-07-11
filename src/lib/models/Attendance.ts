import mongoose, { Schema, Document } from 'mongoose';

export interface IAttendance extends Document {
  studentId: mongoose.Types.ObjectId;
  date: string;
  status: 'present' | 'absent' | 'late';
  className: string;
  section: string;
  academicYear: string;
}

const AttendanceSchema = new Schema<IAttendance>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: String, required: true },
  status: { type: String, enum: ['present', 'absent', 'late'], required: true },
  className: { type: String, required: true },
  section: { type: String, default: '' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Attendance || mongoose.model<IAttendance>('Attendance', AttendanceSchema);
