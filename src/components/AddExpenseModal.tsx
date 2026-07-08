import React, { useState } from 'react';
import type { Expense } from '../types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExpense: (expense: Omit<Expense, 'id'>) => void;
}

const AddExpenseModal: React.FC<AddExpenseModalProps> = ({ isOpen, onClose, onAddExpense }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<'Salaries' | 'Utilities' | 'Supplies' | 'Maintenance' | 'Other'>('Supplies');
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0) {
      alert("Please fill all fields correctly.");
      return;
    }
    onAddExpense({
      date,
      category,
      description,
      amount: Number(amount)
    });
    // Reset form
    setDescription('');
    setAmount('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Expense</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
                <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
              </div>
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
                <select id="category" value={category} onChange={e => setCategory(e.target.value as any)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                  <option>Salaries</option>
                  <option>Utilities</option>
                  <option>Supplies</option>
                  <option>Maintenance</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="e.g., Monthly electricity bill" />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (NPR)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required min="1" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" placeholder="e.g., 5000" />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Expense</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;