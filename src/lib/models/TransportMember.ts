import mongoose, { Schema, Document } from 'mongoose';

export interface ITransportMember extends Document {
  studentId: mongoose.Types.ObjectId;
  routeId: mongoose.Types.ObjectId;
  pickupPoint: string;
  academicYear: string;
}

const TransportMemberSchema = new Schema<ITransportMember>({
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  routeId: { type: Schema.Types.ObjectId, ref: 'TransportRoute', required: true },
  pickupPoint: { type: String, default: '' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.TransportMember || mongoose.model<ITransportMember>('TransportMember', TransportMemberSchema);
