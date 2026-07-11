import mongoose, { Schema, Document } from 'mongoose';

export interface ISalaryTemplate extends Document {
  name: string;
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  transportAllowance: number;
  otherAllowance: number;
  total: number;
  academicYear: string;
}

const SalaryTemplateSchema = new Schema<ISalaryTemplate>({
  name: { type: String, required: true },
  basicSalary: { type: Number, default: 0 },
  houseRent: { type: Number, default: 0 },
  medicalAllowance: { type: Number, default: 0 },
  transportAllowance: { type: Number, default: 0 },
  otherAllowance: { type: Number, default: 0 },
  total: { type: Number, default: 0 },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.SalaryTemplate || mongoose.model<ISalaryTemplate>('SalaryTemplate', SalaryTemplateSchema);
