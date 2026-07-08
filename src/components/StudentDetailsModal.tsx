import React, { useMemo, useState } from 'react';
import type { Student, Result, FeeInvoice, Book, IssuedBook } from '../types';
import { ViewIcon } from './icons';

interface StudentDetailsModalProps {
  student: Student | null;
  results: Result[];
  invoices: FeeInvoice[];
  books: Book[];
  issuedBooks: IssuedBook[];
  onClose: () => void;
}

type ModalTab = 'Profile' | 'Academics' | 'Financials' | 'Library';

const TabButton: React.FC<{ label: string, isActive: boolean, onClick: () => void }> = ({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 font-semibold rounded-md text-sm transition-all duration-200 ${
      isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'
    }`}
  >
    {label}
  </button>
);


const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({ student, results: allResults, invoices, books, issuedBooks, onClose }) => {
  const [activeTab, setActiveTab] = useState<ModalTab>('Profile');
  
  if (!student) return null;

  const renderContent = () => {
    switch(activeTab) {
        case 'Profile': return <ProfileTab student={student} />;
        case 'Academics': return <AcademicsTab student={student} allResults={allResults} />;
        case 'Financials': return <FinancialsTab invoices={invoices} />;
        case 'Library': return <LibraryTab student={student} books={books} issuedBooks={issuedBooks} />;
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-4xl max-h-[95vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4 pb-4 border-b">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <ViewIcon className="w-7 h-7 mr-3 text-blue-600" />
            Student Profile: {student.name}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <div className="flex space-x-2 p-2 mb-4 bg-gray-50 rounded-lg">
            <TabButton label="Profile" isActive={activeTab === 'Profile'} onClick={() => setActiveTab('Profile')} />
            <TabButton label="Academics" isActive={activeTab === 'Academics'} onClick={() => setActiveTab('Academics')} />
            <TabButton label="Financials" isActive={activeTab === 'Financials'} onClick={() => setActiveTab('Financials')} />
            <TabButton label="Library" isActive={activeTab === 'Library'} onClick={() => setActiveTab('Library')} />
        </div>

        <div className="overflow-y-auto flex-grow pr-2">
            {renderContent()}
        </div>

        <div className="mt-8 flex justify-end">
            <button onClick={onClose} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Close
            </button>
        </div>
      </div>
    </div>
  );
};

// Sub-components for Tabs
const DetailItem: React.FC<{ label: string, value: string | number, isNepali?: boolean }> = ({ label, value, isNepali = false }) => (
    <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className={`text-md text-gray-800 font-medium ${isNepali ? 'font-nepali' : ''}`}>{value}</p>
    </div>
);

const ProfileTab: React.FC<{ student: Student }> = ({ student }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 flex flex-col items-center text-center">
            <img src={student.profilePic} alt={student.name} className="w-32 h-32 rounded-full object-cover mb-4 border-4 border-blue-200" />
            <h3 className="text-xl font-bold text-gray-900">{student.name}</h3>
            <p className="text-lg text-gray-600 font-nepali">{student.nepaliName}</p>
            <p className="text-md text-gray-500 mt-2">Class: <span className="font-semibold">{student.className} {student.section}</span></p>
            <p className="text-md text-gray-500">Roll No: <span className="font-semibold">{student.roll}</span></p>
        </div>
        <div className="md:col-span-2">
            <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Personal Information</h4>
            <div className="grid grid-cols-2 gap-4">
                <DetailItem label="Date of Birth" value={student.dob} />
                <DetailItem label="Guardian's Name" value={student.guardianName} />
                <DetailItem label="Contact Number" value={student.contact} />
                <DetailItem label="Address" value={student.address} />
            </div>
        </div>
    </div>
);

const AcademicsTab: React.FC<{ student: Student, allResults: Result[] }> = ({ student, allResults }) => {
    const academicHistory = useMemo(() => {
        const studentResults = allResults.filter(r => r.studentId === student.id);
        return studentResults.map(result => {
            const classExamResults = allResults.filter(r => r.className === result.className && r.section === result.section && r.examType === result.examType);
            const rank = classExamResults.filter(r => r.totalMarks > result.totalMarks).length + 1;
            return { ...result, rank };
        }).sort((a,b) => a.examType.localeCompare(b.examType));
    }, [student.id, allResults]);

    return (
         <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Academic History</h4>
            {academicHistory.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Exam</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Total Marks</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Percentage</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Grade</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Rank</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {academicHistory.map(result => (
                                <tr key={result.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">{result.examType}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{result.totalMarks}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{result.percentage.toFixed(2)}%</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${result.grade.startsWith('A') ? 'bg-green-100 text-green-800' : result.grade.startsWith('B') ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'}`}>{result.grade}</span></td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm font-bold text-gray-800">{result.rank}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <div className="text-center p-6 bg-gray-50 rounded-lg"><p className="text-gray-500">No academic records found.</p></div>}
        </div>
    )
};

const FinancialsTab: React.FC<{ invoices: FeeInvoice[] }> = ({ invoices }) => {
    const getStatusPill = (status: FeeInvoice['status']) => {
        switch (status) {
            case 'Paid': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
            case 'Unpaid': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Unpaid</span>;
            case 'Overdue': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>;
        }
    };
    return (
        <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Financial Statement</h4>
            {invoices.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Invoice ID</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Amount (NPR)</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Due Date</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {invoices.map(invoice => (
                                <tr key={invoice.id}>
                                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">INV-{invoice.id}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium text-gray-800">{invoice.amount.toLocaleString()}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm text-gray-600">{invoice.dueDate}</td>
                                    <td className="px-4 py-3 whitespace-nowrap text-center text-sm">{getStatusPill(invoice.status)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : <div className="text-center p-6 bg-gray-50 rounded-lg"><p className="text-gray-500">No financial records found.</p></div>}
        </div>
    )
}

const LibraryTab: React.FC<{ student: Student, books: Book[], issuedBooks: IssuedBook[] }> = ({ student, books, issuedBooks }) => {
    const studentLibraryRecords = useMemo(() => {
        return issuedBooks.filter(ib => ib.studentId === student.id)
            .map(record => ({...record, book: books.find(b => b.id === record.bookId)}))
            .sort((a,b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
    }, [student.id, issuedBooks, books]);

    const currentlyIssued = studentLibraryRecords.filter(r => r.returnDate === null);
    const history = studentLibraryRecords.filter(r => r.returnDate !== null);
    
    return (
        <div>
            <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Currently Issued Books</h4>
            {currentlyIssued.length > 0 ? (
                 <table className="min-w-full divide-y divide-gray-200 mb-6">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentlyIssued.map(r => (
                            <tr key={r.id}>
                                <td className="px-4 py-3 text-sm font-medium">{r.book?.title || 'Unknown Book'}</td>
                                <td className="px-4 py-3 text-sm">{r.issueDate}</td>
                                <td className="px-4 py-3 text-sm">{r.dueDate}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            ) : <div className="text-center p-6 bg-gray-50 rounded-lg mb-6"><p className="text-gray-500">No books currently issued.</p></div>}

            <h4 className="text-lg font-semibold text-gray-700 mb-4 pb-2 border-b">Borrowing History</h4>
            {history.length > 0 ? (
                 <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Return Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map(r => (
                            <tr key={r.id}>
                                <td className="px-4 py-3 text-sm">{r.book?.title || 'Unknown Book'}</td>
                                <td className="px-4 py-3 text-sm">{r.issueDate}</td>
                                <td className="px-4 py-3 text-sm">{r.returnDate}</td>
                            </tr>
                        ))}
                    </tbody>
                 </table>
            ) : <div className="text-center p-6 bg-gray-50 rounded-lg"><p className="text-gray-500">No borrowing history found.</p></div>}
        </div>
    )
}

export default StudentDetailsModal;