import mongoose, { Schema, Document } from 'mongoose';

export interface IOnlineAdmission extends Document {
  name: string;
  dateOfBirth: string;
  className: string;
  gender: string;
  fatherName: string;
  motherName: string;
  contact: string;
  email: string;
  address: string;
  previousSchool: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  academicYear: string;
}

const OnlineAdmissionSchema = new Schema<IOnlineAdmission>({
  name: { type: String, required: true },
  dateOfBirth: { type: String, required: true },
  className: { type: String, required: true },
  gender: { type: String, required: true },
  fatherName: { type: String, default: '' },
  motherName: { type: String, default: '' },
  contact: { type: String, required: true },
  email: { type: String, default: '' },
  address: { type: String, default: '' },
  previousSchool: { type: String, default: '' },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.OnlineAdmission || mongoose.model<IOnlineAdmission>('OnlineAdmission', OnlineAdmissionSchema);
