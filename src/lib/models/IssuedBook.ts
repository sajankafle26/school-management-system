import mongoose, { Schema, Document } from 'mongoose';

export interface IIssuedBook extends Document {
  bookId: mongoose.Types.ObjectId;
  studentId: mongoose.Types.ObjectId;
  issueDate: string;
  returnDate: string | null;
  dueDate: string;
  status: 'Issued' | 'Returned';
  academicYear: string;
}

const IssuedBookSchema = new Schema<IIssuedBook>({
  bookId: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
  issueDate: { type: String, required: true },
  returnDate: { type: String, default: null },
  dueDate: { type: String, required: true },
  status: { type: String, enum: ['Issued', 'Returned'], default: 'Issued' },
  academicYear: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.IssuedBook || mongoose.model<IIssuedBook>('IssuedBook', IssuedBookSchema);
