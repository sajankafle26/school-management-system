import React, { useMemo } from 'react';
import type { LedgerAccount, Transaction } from '../types';

interface LedgerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  account: LedgerAccount;
  transactions: Transaction[];
  accountsMap: Map<number, LedgerAccount>;
}

const LedgerDetailsModal: React.FC<LedgerDetailsModalProps> = ({ isOpen, onClose, account, transactions, accountsMap }) => {
  const ledgerEntries = useMemo(() => {
    const relatedTransactions = transactions
      .filter(t => t.debitAccountId === account.id || t.creditAccountId === account.id)
      .sort((a, b) => a.date.localeCompare(b.date));

    let balance = 0;
    const debitAccounts = ['Asset', 'Expense'];
    const isDebitAccount = debitAccounts.includes(account.type);

    return relatedTransactions.map(t => {
      const isDebit = t.debitAccountId === account.id;
      const amount = t.amount;
      const change = isDebit ? amount : -amount;
      
      if (isDebitAccount) {
        balance += change;
      } else { // Credit accounts (Liability, Income, Capital)
        balance -= change;
      }

      return {
        ...t,
        debit: isDebit ? amount : 0,
        credit: !isDebit ? amount : 0,
        balance: balance,
        contraAccountName: accountsMap.get(isDebit ? t.creditAccountId : t.debitAccountId)?.name || 'Unknown',
      };
    });
  }, [account, transactions, accountsMap]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-4xl max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">Ledger: {account.name}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <div className="overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Particulars</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Debit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Credit</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Balance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
              {ledgerEntries.map(entry => (
                <tr key={entry.id}>
                  <td className="px-4 py-2 whitespace-nowrap text-sm">{entry.date}</td>
                  <td className="px-4 py-2 text-sm">{entry.description} (vs {entry.contraAccountName})</td>
                  <td className="px-4 py-2 text-right text-sm text-green-600">{entry.debit > 0 ? entry.debit.toLocaleString() : '-'}</td>
                  <td className="px-4 py-2 text-right text-sm text-red-600">{entry.credit > 0 ? entry.credit.toLocaleString() : '-'}</td>
                  <td className="px-4 py-2 text-right text-sm font-semibold text-gray-900">{entry.balance.toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td colSpan={4} className="px-4 py-3 text-right font-bold text-gray-900">Closing Balance</td>
                <td className="px-4 py-3 text-right font-bold text-lg text-gray-900">{ledgerEntries.length > 0 ? ledgerEntries[ledgerEntries.length-1].balance.toLocaleString() : 0}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LedgerDetailsModal;