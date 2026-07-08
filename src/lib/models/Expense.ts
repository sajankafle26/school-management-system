import mongoose, { Schema, Document } from 'mongoose';

export interface IExpense extends Document {
  date: string;
  category: 'Salaries' | 'Utilities' | 'Supplies' | 'Maintenance' | 'Other';
  description: string;
  amount: number;
}

const ExpenseSchema = new Schema<IExpense>({
  date: { type: String, required: true },
  category: { type: String, enum: ['Salaries', 'Utilities', 'Supplies', 'Maintenance', 'Other'], required: true },
  description: { type: String, default: '' },
  amount: { type: Number, required: true },
}, { timestamps: true });

export default mongoose.models.Expense || mongoose.model<IExpense>('Expense', ExpenseSchema);
