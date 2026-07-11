'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Student } from '@/types';

export default function LibraryManagement() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<'books' | 'issue'>('books');
  const [books, setBooks] = useState<any[]>([]);
  const [issued, setIssued] = useState<any[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [showBookModal, setShowBookModal] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  const [bookForm, setBookForm] = useState({ title: '', author: '', isbn: '', totalCopies: '', shelfNo: '', description: '' });

  const [showIssueModal, setShowIssueModal] = useState(false);
  const [issueForm, setIssueForm] = useState({ bookId: '', studentId: '', issueDate: '', dueDate: '' });

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, issuedRes, studentsRes] = await Promise.all([
          fetch('/api/books').then(r => r.json()),
          fetch('/api/issued-books').then(r => r.json()),
          fetch('/api/students').then(r => r.json()),
        ]);
        setBooks(Array.isArray(booksRes) ? booksRes : []);
        setIssued(Array.isArray(issuedRes) ? issuedRes : []);
        setStudents(Array.isArray(studentsRes) ? studentsRes : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;
  if (!user || user.role !== 'admin') return <div className="flex items-center justify-center h-[500px]">Access denied</div>;

  const getStudentName = (id: string) => students.find(s => s._id === id)?.name || 'Unknown';
  const getBookTitle = (id: string) => books.find(b => b._id === id)?.title || 'Unknown';

  const filteredBooks = books.filter(b => {
    const q = searchQuery.toLowerCase();
    return b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.isbn.toLowerCase().includes(q);
  });

  const filteredIssued = issued.filter(i => {
    const q = searchQuery.toLowerCase();
    const studentName = getStudentName(i.studentId).toLowerCase();
    const bookTitle = getBookTitle(i.bookId).toLowerCase();
    return studentName.includes(q) || bookTitle.includes(q);
  });

  const availableBooks = books.filter(b => b.availableCopies > 0);

  // Book CRUD
  const handleOpenBookModal = (book?: any) => {
    if (book) {
      setEditingBook(book);
      setBookForm({
        title: book.title, author: book.author, isbn: book.isbn,
        totalCopies: String(book.totalCopies), shelfNo: book.shelfNo || '', description: book.description || ''
      });
    } else {
      setEditingBook(null);
      setBookForm({ title: '', author: '', isbn: '', totalCopies: '1', shelfNo: '', description: '' });
    }
    setShowBookModal(true);
  };

  const handleBookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: bookForm.title, author: bookForm.author, isbn: bookForm.isbn,
        totalCopies: Number(bookForm.totalCopies),
        availableCopies: editingBook ? undefined : Number(bookForm.totalCopies),
        shelfNo: bookForm.shelfNo, description: bookForm.description
      };
      const url = editingBook ? `/api/books/${editingBook._id}` : '/api/books';
      const method = editingBook ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save');
      setShowBookModal(false);
      const updated = await fetch('/api/books').then(r => r.json());
      setBooks(Array.isArray(updated) ? updated : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to save book');
    }
  };

  const handleDeleteBook = async (id: string) => {
    if (!confirm('Delete this book?')) return;
    try {
      const res = await fetch(`/api/books/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      const updated = await fetch('/api/books').then(r => r.json());
      setBooks(Array.isArray(updated) ? updated : []);
    } catch (error) {
      alert('Failed to delete book');
    }
  };

  const handleExportBooks = () => {
    const headers = ['Title', 'Author', 'ISBN', 'Total Copies', 'Available Copies', 'Shelf No', 'Description'];
    const rows = books.map(b => [b.title, b.author, b.isbn, String(b.totalCopies), String(b.availableCopies), b.shelfNo || '', b.description || '']);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `books-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBooks = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const text = event.target?.result as string;
        const lines = text.trim().split('\n');
        const data = lines.slice(1).map(line => {
          const v = line.split(',').map(x => x.replace(/^"|"$/g, '').trim());
          const total = Number(v[3]) || 1;
          return {
            title: v[0], author: v[1], isbn: v[2], totalCopies: total,
            availableCopies: Number(v[4]) || total, shelfNo: v[5] || '', description: v[6] || ''
          };
        });
        for (const item of data) {
          await fetch('/api/books', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(item) });
        }
        const updated = await fetch('/api/books').then(r => r.json());
        setBooks(Array.isArray(updated) ? updated : []);
        alert(`Imported ${data.length} books`);
      } catch (error) {
        alert('Import failed');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Issue/Return
  const handleOpenIssueModal = () => {
    setIssueForm({ bookId: '', studentId: '', issueDate: new Date().toISOString().split('T')[0], dueDate: '' });
    setShowIssueModal(true);
  };

  const handleIssueSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        bookId: issueForm.bookId, studentId: issueForm.studentId,
        issueDate: issueForm.issueDate, dueDate: issueForm.dueDate,
        status: 'Issued', academicYear: ''
      };
      const res = await fetch('/api/issued-books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to issue');
      setShowIssueModal(false);
      const [updatedIssued, updatedBooks] = await Promise.all([
        fetch('/api/issued-books').then(r => r.json()),
        fetch('/api/books').then(r => r.json()),
      ]);
      setIssued(Array.isArray(updatedIssued) ? updatedIssued : []);
      setBooks(Array.isArray(updatedBooks) ? updatedBooks : []);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to issue book');
    }
  };

  const handleReturnBook = async (item: any) => {
    if (!confirm('Mark this book as returned?')) return;
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await fetch(`/api/issued-books/${item._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ returnDate: today, status: 'Returned' })
      });
      if (!res.ok) throw new Error('Failed to return');
      const [updatedIssued, updatedBooks] = await Promise.all([
        fetch('/api/issued-books').then(r => r.json()),
        fetch('/api/books').then(r => r.json()),
      ]);
      setIssued(Array.isArray(updatedIssued) ? updatedIssued : []);
      setBooks(Array.isArray(updatedBooks) ? updatedBooks : []);
    } catch (error) {
      alert('Failed to return book');
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Library Management</h1>
            <p className="text-sm text-gray-500">Manage books and issue/return</p>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex gap-0">
            <button onClick={() => { setActiveTab('books'); setSearchQuery(''); }}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'books' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Books
            </button>
            <button onClick={() => { setActiveTab('issue'); setSearchQuery(''); }}
              className={`px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${activeTab === 'issue' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              Issue / Return
            </button>
          </div>
        </div>

        {activeTab === 'books' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Search books..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={handleExportBooks} className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700">Export CSV</button>
                <label className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 cursor-pointer">
                  Import CSV
                  <input type="file" accept=".csv" onChange={handleImportBooks} className="hidden" />
                </label>
                <button onClick={() => handleOpenBookModal()} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Add Book</button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <span className="text-sm text-gray-500">{filteredBooks.length} books</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Title</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Author</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">ISBN</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Total</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Available</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredBooks.map(b => (
                      <tr key={b._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{b.title}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{b.author}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{b.isbn || '-'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{b.totalCopies}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${b.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {b.availableCopies}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button onClick={() => handleOpenBookModal(b)} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium hover:bg-blue-200">Edit</button>
                            <button onClick={() => handleDeleteBook(b._id)} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-medium hover:bg-red-200">Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showBookModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">{editingBook ? 'Edit Book' : 'Add Book'}</h2>
                    <button onClick={() => setShowBookModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                  </div>
                  <form onSubmit={handleBookSubmit} className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                        <input type="text" value={bookForm.title} onChange={e => setBookForm({...bookForm, title: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
                        <input type="text" value={bookForm.author} onChange={e => setBookForm({...bookForm, author: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
                        <input type="text" value={bookForm.isbn} onChange={e => setBookForm({...bookForm, isbn: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total Copies *</label>
                        <input type="number" value={bookForm.totalCopies} onChange={e => setBookForm({...bookForm, totalCopies: e.target.value})} required min="1" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Shelf No</label>
                        <input type="text" value={bookForm.shelfNo} onChange={e => setBookForm({...bookForm, shelfNo: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea value={bookForm.description} onChange={e => setBookForm({...bookForm, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button type="button" onClick={() => setShowBookModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">{editingBook ? 'Update' : 'Create'}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === 'issue' && (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <input type="text" placeholder="Search by student or book..." value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64" />
              </div>
              <button onClick={handleOpenIssueModal} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">+ Issue Book</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100">
              <div className="p-4 border-b border-gray-100">
                <span className="text-sm text-gray-500">{filteredIssued.length} records</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Book</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Issue Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Return Date</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredIssued.map(i => (
                      <tr key={i._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{getStudentName(i.studentId)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{getBookTitle(i.bookId)}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{i.issueDate}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{i.dueDate}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{i.returnDate || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${i.status === 'Returned' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                            {i.status}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {i.status === 'Issued' && (
                            <button onClick={() => handleReturnBook(i)} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium hover:bg-green-200">Return</button>
                          )}
                          {i.status === 'Returned' && (
                            <span className="text-xs text-gray-400">-</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {showIssueModal && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Issue Book</h2>
                    <button onClick={() => setShowIssueModal(false)} className="text-gray-400 hover:text-gray-600 text-2xl">&times;</button>
                  </div>
                  <form onSubmit={handleIssueSubmit} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                      <select value={issueForm.studentId} onChange={e => setIssueForm({...issueForm, studentId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Student</option>
                        {students.map(s => <option key={s._id} value={s._id}>{s.name} ({s.className} {s.section}, Roll: {s.roll})</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Book *</label>
                      <select value={issueForm.bookId} onChange={e => setIssueForm({...issueForm, bookId: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select Book</option>
                        {availableBooks.map(b => <option key={b._id} value={b._id}>{b.title} by {b.author} ({b.availableCopies} available)</option>)}
                      </select>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Issue Date *</label>
                        <input type="date" value={issueForm.issueDate} onChange={e => setIssueForm({...issueForm, issueDate: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                        <input type="date" value={issueForm.dueDate} onChange={e => setIssueForm({...issueForm, dueDate: e.target.value})} required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                      <button type="button" onClick={() => setShowIssueModal(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700">Issue Book</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
