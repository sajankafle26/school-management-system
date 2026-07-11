import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  shelfNo: string;
  description: string;
}

const BookSchema = new Schema<IBook>({
  title: { type: String, required: true },
  author: { type: String, required: true },
  isbn: { type: String, default: '' },
  totalCopies: { type: Number, default: 1 },
  availableCopies: { type: Number, default: 1 },
  shelfNo: { type: String, default: '' },
  description: { type: String, default: '' },
}, { timestamps: true });

export default mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
