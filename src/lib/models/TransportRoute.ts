import mongoose, { Schema, Document } from 'mongoose';

export interface ITransportRoute extends Document {
  name: string;
  route: string;
  fare: number;
  vehicleNo: string;
  driverId: mongoose.Types.ObjectId;
  academicYear: string;
}

const TransportRouteSchema = new Schema<ITransportRoute>({
  name: { type: String, required: true },
  route: { type: String, required: true },
  fare: { type: Number, default: 0 },
  vehicleNo: { type: String, default: '' },
  driverId: { type: Schema.Types.ObjectId, ref: 'Driver', default: null },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.TransportRoute || mongoose.model<ITransportRoute>('TransportRoute', TransportRouteSchema);
