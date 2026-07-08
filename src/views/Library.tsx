import React, { useState, useMemo, useEffect } from 'react';
import type { Book, IssuedBook, Student } from '../types';
import AddBookModal from '../components/AddBookModal';
import IssueBookModal from '../components/IssueBookModal';

type LibraryTab = 'All Books' | 'Issued Books';

interface LibraryProps {
    selectedAcademicYear: string;
}

const Library: React.FC<LibraryProps> = ({ selectedAcademicYear }) => {
    const [activeTab, setActiveTab] = useState<LibraryTab>('All Books');
    const [books, setBooks] = useState<Book[]>([]);
    const [issuedBooks, setIssuedBooks] = useState<IssuedBook[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
    const [isIssueBookModalOpen, setIsIssueBookModalOpen] = useState(false);

    const [selectedClass, setSelectedClass] = useState<string>('All');
    const [selectedSection, setSelectedSection] = useState<string>('All');

    useEffect(() => {
        fetch('/api/books')
            .then(res => res.json())
            .then(setBooks)
            .catch(console.error);
        fetch('/api/issued-books')
            .then(res => res.json())
            .then(setIssuedBooks)
            .catch(console.error);
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
    }, []);

    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);
    const issuedBooksThisYear = useMemo(() => issuedBooks.filter(ib => ib.academicYear === selectedAcademicYear), [issuedBooks, selectedAcademicYear]);
    
    const studentsMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
    const booksMap = useMemo(() => new Map(books.map(b => [b.id, b])), [books]);
    
    const availableClasses = useMemo(() => ['All', ...[...new Set(studentsThisYear.map(s => s.className))].sort((a,b) => Number(a)-Number(b))], [studentsThisYear]);
    const availableSections = useMemo(() => {
        if (selectedClass === 'All') return ['All'];
        return ['All', ...[...new Set(studentsThisYear.filter(s => s.className === selectedClass).map(s => s.section))].sort()];
    }, [selectedClass, studentsThisYear]);

    useEffect(() => {
        setSelectedClass('All');
        setSelectedSection('All');
    },[selectedAcademicYear])

    useEffect(() => {
        setSelectedSection('All');
    }, [selectedClass]);

    const filteredIssuedBooks = useMemo(() => {
        if (selectedClass === 'All') return issuedBooksThisYear;
        return issuedBooksThisYear.filter(ib => {
            const student = studentsMap.get(ib.studentId);
            if (!student) return false;
            const classMatch = student.className === selectedClass;
            const sectionMatch = selectedSection === 'All' || student.section === selectedSection;
            return classMatch && sectionMatch;
        });
    }, [issuedBooksThisYear, selectedClass, selectedSection, studentsMap]);


    const handleAddBook = async (newBookData: Omit<Book, 'id' | 'availableCopies'>) => {
        try {
            const res = await fetch('/api/books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newBookData, availableCopies: newBookData.totalCopies }),
            });
            const created = await res.json();
            setBooks(prev => [created, ...prev]);
            setIsAddBookModalOpen(false);
        } catch (error) {
            console.error('Failed to add book:', error);
        }
    };

    const handleIssueBook = async (issueData: Omit<IssuedBook, 'id' | 'returnDate' | 'academicYear'>) => {
        try {
            const res = await fetch('/api/issued-books', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...issueData, returnDate: null, academicYear: selectedAcademicYear }),
            });
            const created = await res.json();
            setIssuedBooks(prev => [created, ...prev]);
            setBooks(prevBooks => prevBooks.map(book => 
                book.id === issueData.bookId 
                ? { ...book, availableCopies: book.availableCopies - 1 }
                : book
            ));
            setIsIssueBookModalOpen(false);
        } catch (error) {
            console.error('Failed to issue book:', error);
        }
    };

    const handleReturnBook = async (issuedBookId: number) => {
        const today = new Date().toISOString().split('T')[0];
        let bookToUpdate: IssuedBook | undefined;

        setIssuedBooks(prev => prev.map(ib => {
            if (ib.id === issuedBookId) {
                bookToUpdate = { ...ib, returnDate: today };
                return bookToUpdate;
            }
            return ib;
        }));

        if (bookToUpdate) {
            setBooks(prevBooks => prevBooks.map(book => 
                book.id === bookToUpdate!.bookId 
                ? { ...book, availableCopies: book.availableCopies + 1 }
                : book
            ));
        }
    };

    const renderAllBooks = () => (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Author</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ISBN</th>
                        <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Copies</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                    {books.map(book => (
                        <tr key={book.id}>
                            <td className="px-6 py-4 font-medium text-gray-900">{book.title}</td>
                            <td className="px-6 py-4">{book.author}</td>
                            <td className="px-6 py-4">{book.isbn}</td>
                            <td className="px-6 py-4 text-center">{book.availableCopies} / {book.totalCopies}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderIssuedBooks = () => (
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
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Book Title</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 text-gray-700">
                        {filteredIssuedBooks.map(ib => {
                            const book = booksMap.get(ib.bookId);
                            const student = studentsMap.get(ib.studentId);
                            const isOverdue = !ib.returnDate && new Date(ib.dueDate) < new Date();
                            
                            return (
                                <tr key={ib.id}>
                                    <td className="px-6 py-4 font-medium text-gray-900">{book?.title || 'N/A'}</td>
                                    <td className="px-6 py-4">{student?.name || 'N/A'} ({student?.className}-{student?.section})</td>
                                    <td className="px-6 py-4">{ib.issueDate}</td>
                                    <td className="px-6 py-4">{ib.dueDate}</td>
                                    <td className="px-6 py-4 text-center">
                                        {ib.returnDate ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Returned</span>
                                        : isOverdue ? <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>
                                        : <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Issued</span>}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        {!ib.returnDate && (
                                            <button onClick={() => handleReturnBook(ib.id)} className="text-blue-600 hover:text-blue-900 text-sm font-medium">Return</button>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );

    const tabs: LibraryTab[] = ['All Books', 'Issued Books'];

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Library Management</h1>
                <div className="flex space-x-3">
                    <button onClick={() => setIsIssueBookModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Issue Book</button>
                    <button onClick={() => setIsAddBookModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Add New Book</button>
                </div>
            </div>

            <div className="mb-6 border-b border-gray-200">
                <nav className="-mb-px flex space-x-6" aria-label="Tabs">
                    {tabs.map(tab => (
                        <button key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >{tab}</button>
                    ))}
                </nav>
            </div>

            <div>
                {activeTab === 'All Books' ? renderAllBooks() : renderIssuedBooks()}
            </div>

            <AddBookModal
                isOpen={isAddBookModalOpen}
                onClose={() => setIsAddBookModalOpen(false)}
                onAddBook={handleAddBook}
            />
            <IssueBookModal
                isOpen={isIssueBookModalOpen}
                onClose={() => setIsIssueBookModalOpen(false)}
                onIssueBook={handleIssueBook}
                books={books.filter(b => b.availableCopies > 0)}
                students={studentsThisYear}
            />
        </div>
    );
};

export default Library;
