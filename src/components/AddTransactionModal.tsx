import React, { useState } from 'react';
import type { Transaction, LedgerAccount } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Update prop type to reflect that academicYear is handled by the parent.
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'academicYear'>) => void;
  accounts: LedgerAccount[];
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ isOpen, onClose, onAddTransaction, accounts }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [debitAccountId, setDebitAccountId] = useState('');
  const [creditAccountId, setCreditAccountId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || Number(amount) <= 0 || !debitAccountId || !creditAccountId || debitAccountId === creditAccountId) {
      alert("Please fill all fields correctly. Debit and credit accounts must be different.");
      return;
    }
    onAddTransaction({
      date,
      description,
      amount: Number(amount),
      debitAccountId: Number(debitAccountId),
      creditAccountId: Number(creditAccountId)
    });
    // Reset form
    setDescription('');
    setAmount('');
    setDebitAccountId('');
    setCreditAccountId('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Transaction</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date</label>
              <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description / Particulars</label>
              <input type="text" id="description" value={description} onChange={e => setDescription(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700">Amount (NPR)</label>
              <input type="number" id="amount" value={amount} onChange={e => setAmount(e.target.value)} required min="0.01" step="0.01" className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
            <div>
              <label htmlFor="debitAccountId" className="block text-sm font-medium text-gray-700">Debit Account (Dr.)</label>
              <select id="debitAccountId" value={debitAccountId} onChange={e => setDebitAccountId(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option value="" disabled>-- Select account --</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.type})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="creditAccountId" className="block text-sm font-medium text-gray-700">Credit Account (Cr.)</label>
              <select id="creditAccountId" value={creditAccountId} onChange={e => setCreditAccountId(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option value="" disabled>-- Select account --</option>
                {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.type})</option>)}
              </select>
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Add Transaction</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTransactionModal;