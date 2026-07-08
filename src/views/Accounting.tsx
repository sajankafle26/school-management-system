import React, { useState, useMemo, useEffect } from 'react';
import type { FeeStructure, FeeInvoice, LedgerAccount, Transaction, Student } from '../types';
import DashboardCard from '../components/DashboardCard';
import { FinancialsIcon, EditIcon, ScaleIcon } from '../components/icons';
import FeeStructureModal from '../components/FeeStructureModal';
import AddTransactionModal from '../components/AddTransactionModal';
import LedgerDetailsModal from '../components/LedgerDetailsModal';

type AccountingTab = 'Dashboard' | 'Transactions' | 'Ledgers' | 'Trial Balance' | 'Profit & Loss' | 'Invoices' | 'Fee Structure';

interface AccountingProps {
    selectedAcademicYear: string;
    invoices: FeeInvoice[];
    setInvoices: React.Dispatch<React.SetStateAction<FeeInvoice[]>>;
}

const Accounting: React.FC<AccountingProps> = ({ selectedAcademicYear, invoices, setInvoices }) => {
    const [activeTab, setActiveTab] = useState<AccountingTab>('Dashboard');
    const [feeStructures, setFeeStructures] = useState<FeeStructure[]>([]);
    const [accounts, setAccounts] = useState<LedgerAccount[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    const [isFeeModalOpen, setIsFeeModalOpen] = useState(false);
    const [editingFeeStructure, setEditingFeeStructure] = useState<FeeStructure | null>(null);
    
    const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
    const [isLedgerModalOpen, setIsLedgerModalOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState<LedgerAccount | null>(null);

    useEffect(() => {
        fetch('/api/ledger-accounts')
            .then(res => res.json())
            .then(setAccounts)
            .catch(console.error);
        fetch('/api/transactions')
            .then(res => res.json())
            .then(setTransactions)
            .catch(console.error);
        fetch('/api/fee-structures')
            .then(res => res.json())
            .then(setFeeStructures)
            .catch(console.error);
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
    }, []);

    // Filter data by academic year
    const invoicesThisYear = useMemo(() => invoices.filter(i => i.academicYear === selectedAcademicYear), [invoices, selectedAcademicYear]);
    const transactionsThisYear = useMemo(() => transactions.filter(t => t.academicYear === selectedAcademicYear), [transactions, selectedAcademicYear]);

    // P&L State
    const [plStartDate, setPlStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0]);
    const [plEndDate, setPlEndDate] = useState(new Date().toISOString().split('T')[0]);

    // Invoice Filter State
    const [selectedClass, setSelectedClass] = useState<string>('All');
    const [selectedSection, setSelectedSection] = useState<string>('All');
    
    const studentsMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
    const accountsMap = useMemo(() => new Map(accounts.map(a => [a.id, a])), [accounts]);

    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);
    const availableClasses = useMemo(() => ['All', ...[...new Set(studentsThisYear.map(s => s.className))].sort((a,b) => Number(a)-Number(b))], [studentsThisYear]);
    const availableSections = useMemo(() => {
        if (selectedClass === 'All') return ['All'];
        return ['All', ...[...new Set(studentsThisYear.filter(s => s.className === selectedClass).map(s => s.section))].sort()];
    }, [selectedClass, studentsThisYear]);

    useEffect(() => {
        setSelectedClass('All');
        setSelectedSection('All');
    }, [selectedAcademicYear]);

    useEffect(() => {
        setSelectedSection('All');
    }, [selectedClass]);
    
    const filteredInvoices = useMemo(() => {
        if (selectedClass === 'All') return invoicesThisYear;
        return invoicesThisYear.filter(invoice => {
            const student = studentsMap.get(invoice.studentId);
            if (!student) return false;
            const classMatch = student.className === selectedClass;
            const sectionMatch = selectedSection === 'All' || student.section === selectedSection;
            return classMatch && sectionMatch;
        });
    }, [invoicesThisYear, selectedClass, selectedSection, studentsMap]);

    const accountBalances = useMemo(() => {
        const balances = new Map<number, number>();
        accounts.forEach(acc => balances.set(acc.id, 0));

        transactionsThisYear.forEach(t => {
            const debitAcc = accountsMap.get(t.debitAccountId);
            const creditAcc = accountsMap.get(t.creditAccountId);
            const debitIsAssetOrExpense = debitAcc?.type === 'Asset' || debitAcc?.type === 'Expense';
            const creditIsAssetOrExpense = creditAcc?.type === 'Asset' || creditAcc?.type === 'Expense';

            const currentDebitBalance = balances.get(t.debitAccountId) || 0;
            balances.set(t.debitAccountId, currentDebitBalance + (debitIsAssetOrExpense ? t.amount : -t.amount));
            
            const currentCreditBalance = balances.get(t.creditAccountId) || 0;
            balances.set(t.creditAccountId, currentCreditBalance + (creditIsAssetOrExpense ? -t.amount : t.amount));
        });
        return balances;
    }, [transactionsThisYear, accounts, accountsMap]);

    const trialBalance = useMemo(() => {
        const debitAccounts: { name: string; balance: number }[] = [];
        const creditAccounts: { name: string; balance: number }[] = [];
        let totalDebits = 0;
        let totalCredits = 0;

        accounts.forEach(acc => {
            const balance = accountBalances.get(acc.id) || 0;
            if (balance > 0) {
                 if (acc.type === 'Asset' || acc.type === 'Expense') {
                    debitAccounts.push({ name: acc.name, balance });
                    totalDebits += balance;
                } else {
                    creditAccounts.push({ name: acc.name, balance });
                    totalCredits += balance;
                }
            } else if (balance < 0) {
                if (acc.type === 'Asset' || acc.type === 'Expense') {
                    creditAccounts.push({ name: acc.name, balance: -balance });
                    totalCredits += -balance;
                } else {
                    debitAccounts.push({ name: acc.name, balance: -balance });
                    totalDebits += -balance;
                }
            }
        });
        return { debitAccounts, creditAccounts, totalDebits, totalCredits };
    }, [accounts, accountBalances]);

    const profitAndLoss = useMemo(() => {
        let totalIncome = 0;
        let totalExpenses = 0;
        const incomeBreakdown: { name: string; total: number }[] = [];
        const expenseBreakdown: { name: string; total: number }[] = [];

        const filteredTransactions = transactionsThisYear.filter(t => t.date >= plStartDate && t.date <= plEndDate);

        const incomeAccounts = accounts.filter(a => a.type === 'Income');
        const expenseAccounts = accounts.filter(a => a.type === 'Expense');

        incomeAccounts.forEach(acc => {
            const income = filteredTransactions
                .filter(t => t.creditAccountId === acc.id)
                .reduce((sum, t) => sum + t.amount, 0);
            if (income > 0) {
                totalIncome += income;
                incomeBreakdown.push({ name: acc.name, total: income });
            }
        });

        expenseAccounts.forEach(acc => {
            const expense = filteredTransactions
                .filter(t => t.debitAccountId === acc.id)
                .reduce((sum, t) => sum + t.amount, 0);
            if (expense > 0) {
                totalExpenses += expense;
                expenseBreakdown.push({ name: acc.name, total: expense });
            }
        });

        return { totalIncome, totalExpenses, incomeBreakdown, expenseBreakdown, net: totalIncome - totalExpenses };
    }, [accounts, transactionsThisYear, plStartDate, plEndDate]);
    
    const handleSaveFeeStructure = async (feeData: FeeStructure) => {
        try {
            const res = await fetch('/api/fee-structures', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feeData),
            });
            const saved = await res.json();
            const isEditing = !!editingFeeStructure;
            if (isEditing) {
                setFeeStructures(prev => prev.map(fs => fs.className === saved.className ? saved : fs));
            } else {
                setFeeStructures(prev => [...prev, saved].sort((a, b) => a.className.localeCompare(b.className)));
            }
            setIsFeeModalOpen(false);
            setEditingFeeStructure(null);
        } catch (error) {
            console.error('Failed to save fee structure:', error);
        }
    };

    const handleAddTransaction = async (newTransactionData: Omit<Transaction, 'id' | 'academicYear'>) => {
        try {
            const res = await fetch('/api/transactions', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newTransactionData, academicYear: selectedAcademicYear }),
            });
            const created = await res.json();
            setTransactions(prev => [created, ...prev].sort((a,b) => b.date.localeCompare(a.date)));
        } catch (error) {
            console.error('Failed to add transaction:', error);
        }
    };

    const handleViewLedger = (account: LedgerAccount) => {
        setSelectedAccount(account);
        setIsLedgerModalOpen(true);
    };
    
    const renderTabContent = () => {
        switch (activeTab) {
            case 'Dashboard':
                 return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <DashboardCard title="Total Income" value={`NPR ${profitAndLoss.totalIncome.toLocaleString()}`} icon={<FinancialsIcon className="w-8 h-8 text-white" />} color="bg-green-500" />
                        <DashboardCard title="Total Expenses" value={`NPR ${profitAndLoss.totalExpenses.toLocaleString()}`} icon={<FinancialsIcon className="w-8 h-8 text-white" />} color="bg-red-500" />
                        <DashboardCard title="Net Profit/Loss" value={`NPR ${profitAndLoss.net.toLocaleString()}`} icon={<ScaleIcon className="w-8 h-8 text-white" />} color={profitAndLoss.net >= 0 ? "bg-blue-500" : "bg-orange-500"} />
                    </div>
                );
            case 'Transactions':
                return (
                    <div>
                        <div className="text-right mb-4">
                            <button onClick={() => setIsTransactionModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add Transaction</button>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Debit A/C</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Credit A/C</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                                    {transactionsThisYear.map(t => (
                                        <tr key={t.id}>
                                            <td className="px-6 py-4">{t.date}</td>
                                            <td className="px-6 py-4">{t.description}</td>
                                            <td className="px-6 py-4">{accountsMap.get(t.debitAccountId)?.name}</td>
                                            <td className="px-6 py-4">{accountsMap.get(t.creditAccountId)?.name}</td>
                                            <td className="px-6 py-4 text-right font-medium text-gray-900">{t.amount.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Ledgers':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accounts.map(acc => (
                             <div key={acc.id} className="bg-white p-4 rounded-xl shadow-lg flex justify-between items-center">
                                <div>
                                    <h3 className="font-bold text-gray-800">{acc.name}</h3>
                                    <p className="text-sm text-gray-500">{acc.type}</p>
                                </div>
                                <button onClick={() => handleViewLedger(acc)} className="text-blue-600 hover:text-blue-800 text-sm font-semibold">View Ledger</button>
                             </div>
                        ))}
                    </div>
                );
            case 'Trial Balance':
                const { debitAccounts, creditAccounts, totalDebits, totalCredits } = trialBalance;
                const isBalanced = Math.round(totalDebits) === Math.round(totalCredits);
                return (
                     <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Trial Balance</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <table className="min-w-full">
                                <thead className="border-b-2"><tr><th className="py-2 text-left font-semibold text-gray-800">Debit Accounts (Dr.)</th><th className="py-2 text-right font-semibold text-gray-800">Amount</th></tr></thead>
                                <tbody>
                                    {debitAccounts.map(acc => <tr key={acc.name}><td className="py-1 text-gray-700">{acc.name}</td><td className="py-1 text-right text-gray-700">{acc.balance.toLocaleString()}</td></tr>)}
                                </tbody>
                            </table>
                             <table className="min-w-full">
                                <thead className="border-b-2"><tr><th className="py-2 text-left font-semibold text-gray-800">Credit Accounts (Cr.)</th><th className="py-2 text-right font-semibold text-gray-800">Amount</th></tr></thead>
                                <tbody>
                                    {creditAccounts.map(acc => <tr key={acc.name}><td className="py-1 text-gray-700">{acc.name}</td><td className="py-1 text-right text-gray-700">{acc.balance.toLocaleString()}</td></tr>)}
                                </tbody>
                            </table>
                        </div>
                        <div className={`grid grid-cols-2 gap-4 mt-4 pt-4 border-t-4 font-bold text-lg ${isBalanced ? 'border-green-500 text-gray-800' : 'border-red-500 text-red-700'}`}>
                            <div className="flex justify-between"><span>Total Debits:</span><span>{totalDebits.toLocaleString()}</span></div>
                            <div className="flex justify-between"><span>Total Credits:</span><span>{totalCredits.toLocaleString()}</span></div>
                        </div>
                     </div>
                );
            case 'Profit & Loss':
                 return (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Profit & Loss Statement</h2>
                        <div className="flex items-center space-x-4 mb-6 bg-gray-50 p-3 rounded-lg">
                             <div>
                                <label className="text-sm font-medium text-gray-700">From:</label>
                                <input type="date" value={plStartDate} onChange={e => setPlStartDate(e.target.value)} className="p-1 border rounded-md ml-2"/>
                             </div>
                             <div>
                                <label className="text-sm font-medium text-gray-700">To:</label>
                                <input type="date" value={plEndDate} onChange={e => setPlEndDate(e.target.value)} className="p-1 border rounded-md ml-2"/>
                             </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                             <div>
                                <h3 className="text-xl font-semibold text-green-700 border-b-2 border-green-200 pb-2 mb-2">Income</h3>
                                {profitAndLoss.incomeBreakdown.map(item => <div key={item.name} className="flex justify-between py-1 text-gray-700"><p>{item.name}</p><p>{item.total.toLocaleString()}</p></div>)}
                                <div className="flex justify-between pt-2 mt-2 border-t-2 font-bold text-gray-800"><p>Total Income</p><p>{profitAndLoss.totalIncome.toLocaleString()}</p></div>
                             </div>
                             <div>
                                <h3 className="text-xl font-semibold text-red-700 border-b-2 border-red-200 pb-2 mb-2">Expenses</h3>
                                {profitAndLoss.expenseBreakdown.map(item => <div key={item.name} className="flex justify-between py-1 text-gray-700"><p>{item.name}</p><p>{item.total.toLocaleString()}</p></div>)}
                                <div className="flex justify-between pt-2 mt-2 border-t-2 font-bold text-gray-800"><p>Total Expenses</p><p>{profitAndLoss.totalExpenses.toLocaleString()}</p></div>
                             </div>
                        </div>
                        <div className={`mt-6 pt-4 border-t-4 text-xl font-bold flex justify-between ${profitAndLoss.net >= 0 ? 'text-green-800 border-green-500' : 'text-red-800 border-red-500'}`}>
                           <span>{profitAndLoss.net >= 0 ? 'Net Profit' : 'Net Loss'}</span>
                           <span>NPR {profitAndLoss.net.toLocaleString()}</span>
                        </div>
                    </div>
                );
            case 'Invoices':
                const getStatusPill = (status: FeeInvoice['status']) => {
                    switch (status) {
                        case 'Paid': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
                        case 'Unpaid': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Unpaid</span>;
                        case 'Overdue': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>;
                    }
                };
                return (
                    <div>
                         <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex items-center space-x-4">
                            <div>
                                <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700">Filter by Class</label>
                                <select 
                                    id="class-filter"
                                    value={selectedClass} 
                                    onChange={(e) => setSelectedClass(e.target.value)}
                                    className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                >
                                    {availableClasses.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="section-filter" className="block text-sm font-medium text-gray-700">Filter by Section</label>
                                <select 
                                    id="section-filter"
                                    value={selectedSection} 
                                    onChange={(e) => setSelectedSection(e.target.value)}
                                    disabled={selectedClass === 'All'}
                                    className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                                >
                                    {availableSections.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sections' : s}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                               <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                                    </tr>
                               </thead>
                               <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                                    {filteredInvoices.map(invoice => {
                                        const student = studentsMap.get(invoice.studentId);
                                        return (
                                            <tr key={invoice.id}>
                                                <td className="px-6 py-4 whitespace-nowrap">{student?.name || 'Unknown Student'} ({student?.className}-{student?.section})</td>
                                                <td className="px-6 py-4 whitespace-nowrap">NPR {invoice.amount.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">{invoice.dueDate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusPill(invoice.status)}</td>
                                            </tr>
                                        );
                                    })}
                               </tbody>
                            </table>
                        </div>
                    </div>
                );
            case 'Fee Structure':
                return (
                    <div>
                        <div className="text-right mb-4">
                            <button onClick={() => { setEditingFeeStructure(null); setIsFeeModalOpen(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add New Fee Structure</button>
                        </div>
                        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                               <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Tuition</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Library</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Lab</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Other</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Total</th>
                                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                               </thead>
                               <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                                    {feeStructures.map(fs => {
                                        const total = fs.tuition + fs.library + fs.lab + fs.other;
                                        return(
                                            <tr key={fs.className}>
                                                <td className="px-6 py-4 font-medium text-gray-900">Class {fs.className}</td>
                                                <td className="px-6 py-4 text-right">{fs.tuition.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">{fs.library.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">{fs.lab.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right">{fs.other.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-right font-semibold text-gray-900">NPR {total.toLocaleString()}</td>
                                                <td className="px-6 py-4 text-center">
                                                    <button onClick={() => { setEditingFeeStructure(fs); setIsFeeModalOpen(true); }} className="text-blue-600 hover:text-blue-800 p-1 rounded-full"><EditIcon className="w-5 h-5"/></button>
                                                </td>
                                            </tr>
                                        )
                                    })}
                               </tbody>
                            </table>
                        </div>
                    </div>
                );
        }
    };

    const tabs: AccountingTab[] = ['Dashboard', 'Transactions', 'Ledgers', 'Trial Balance', 'Profit & Loss', 'Invoices', 'Fee Structure'];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Accounting</h1>
            
            <div className="mb-6 border-b border-gray-200 overflow-x-auto">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${
                                activeTab === tab
                                ? 'border-blue-600 text-blue-700'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            {tab}
                        </button>
                    ))}
                </nav>
            </div>
            
            <div>{renderTabContent()}</div>

            <FeeStructureModal 
                isOpen={isFeeModalOpen} 
                onClose={() => setIsFeeModalOpen(false)} 
                onSave={handleSaveFeeStructure} 
                existingFeeStructure={editingFeeStructure}
                existingClasses={feeStructures.map(fs => fs.className)}
            />
            <AddTransactionModal
                isOpen={isTransactionModalOpen}
                onClose={() => setIsTransactionModalOpen(false)}
                onAddTransaction={handleAddTransaction}
                accounts={accounts}
            />
            {selectedAccount && <LedgerDetailsModal
                isOpen={isLedgerModalOpen}
                onClose={() => setIsLedgerModalOpen(false)}
                account={selectedAccount}
                transactions={transactionsThisYear}
                accountsMap={accountsMap}
            />}
        </div>
    );
};

export default Accounting;
