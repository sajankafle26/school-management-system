import React, { useState, useMemo, useEffect } from 'react';
import type { Notice, Student } from '../types';

interface AddNoticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddNotice: (notice: Omit<Notice, 'id' | 'academicYear'>) => void;
}

const AddNoticeModal: React.FC<AddNoticeModalProps> = ({ isOpen, onClose, onAddNotice }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetClass, setTargetClass] = useState('All');
  const [targetSection, setTargetSection] = useState('All');

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error);
  }, []);

  const availableClasses = useMemo(() => ['All', ...[...new Set(students.map(s => s.className))].sort((a,b) => Number(a)-Number(b))], [students]);
  const availableSections = useMemo(() => {
    if (targetClass === 'All') return ['All'];
    return ['All', ...[...new Set(students.filter(s => s.className === targetClass).map(s => s.section))].sort()];
  }, [targetClass, students]);
  
  useEffect(() => {
    if(targetClass === 'All') {
        setTargetSection('All');
    }
  }, [targetClass]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      alert("Please fill out all required fields.");
      return;
    }
    onAddNotice({
      title,
      content,
      targetClass,
      targetSection,
      date: new Date().toISOString().split('T')[0],
      author: 'School Admin'
    });
    setTitle('');
    setContent('');
    setTargetClass('All');
    setTargetSection('All');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Post New Notice</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="targetClass" className="block text-sm font-medium text-gray-700">Target Class</label>
                <select id="targetClass" value={targetClass} onChange={e => setTargetClass(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                  {availableClasses.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : c}</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="targetSection" className="block text-sm font-medium text-gray-700">Target Section</label>
                <select id="targetSection" value={targetSection} onChange={e => setTargetSection(e.target.value)} required disabled={targetClass === 'All'} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100">
                  {availableSections.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sections' : s}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
              <textarea id="content" value={content} onChange={e => setContent(e.target.value)} required rows={4} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Post Notice</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNoticeModal;
