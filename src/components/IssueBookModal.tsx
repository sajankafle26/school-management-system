import React, { useState } from 'react';
import type { Book, IssuedBook, Student } from '../types';

interface IssueBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Update prop type to reflect that academicYear is handled by the parent.
  onIssueBook: (issueData: Omit<IssuedBook, 'id' | 'returnDate' | 'academicYear'>) => void;
  books: Book[];
  students: Student[];
}

const getDefaultDueDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 14); // Default 14 days
    return date.toISOString().split('T')[0];
};

const IssueBookModal: React.FC<IssueBookModalProps> = ({ isOpen, onClose, onIssueBook, books, students }) => {
  const [bookId, setBookId] = useState<string>('');
  const [studentId, setStudentId] = useState<string>('');
  const [dueDate, setDueDate] = useState(getDefaultDueDate());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookId || !studentId) {
      alert("Please select a book and a student.");
      return;
    }
    onIssueBook({
        bookId: Number(bookId),
        studentId: Number(studentId),
        issueDate: new Date().toISOString().split('T')[0],
        dueDate,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Issue a Book</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="bookId" className="block text-sm font-medium text-gray-700">Select Book (Available)</label>
              <select id="bookId" value={bookId} onChange={e => setBookId(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option value="" disabled>-- Choose a book --</option>
                {books.map(book => <option key={book.id} value={book.id}>{book.title} by {book.author}</option>)}
              </select>
            </div>
             <div>
              <label htmlFor="studentId" className="block text-sm font-medium text-gray-700">Select Student</label>
              <select id="studentId" value={studentId} onChange={e => setStudentId(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                <option value="" disabled>-- Choose a student --</option>
                {students.map(student => <option key={student.id} value={student.id}>{student.name} (Class {student.className} {student.section})</option>)}
              </select>
            </div>
             <div>
                <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>
          </div>
          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Issue Book</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default IssueBookModal;