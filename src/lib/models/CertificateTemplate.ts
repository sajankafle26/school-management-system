import mongoose, { Schema, Document } from 'mongoose';

export interface ICertificateTemplate extends Document {
  name: string;
  type: 'Transfer' | 'Character' | 'Bonafide' | 'Completion';
  content: string;
  academicYear: string;
}

const CertificateTemplateSchema = new Schema<ICertificateTemplate>({
  name: { type: String, required: true },
  type: { type: String, enum: ['Transfer', 'Character', 'Bonafide', 'Completion'], required: true },
  content: { type: String, default: '' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.CertificateTemplate || mongoose.model<ICertificateTemplate>('CertificateTemplate', CertificateTemplateSchema);
