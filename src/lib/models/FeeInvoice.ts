import mongoose, { Schema, Document } from 'mongoose';

export interface IFeeInvoice extends Document {
  studentId: number;
  amount: number;
  dueDate: string;
  status: 'Paid' | 'Unpaid' | 'Overdue';
  academicYear: string;
}

const FeeInvoiceSchema = new Schema<IFeeInvoice>({
  studentId: { type: Number, required: true },
  amount: { type: Number, required: true },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['Paid', 'Unpaid', 'Overdue', 'Partial'], default: 'Unpaid' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.FeeInvoice || mongoose.model<IFeeInvoice>('FeeInvoice', FeeInvoiceSchema);
