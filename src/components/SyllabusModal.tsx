import React, { useState, useEffect } from 'react';
import type { Syllabus } from '../types';
import { TrashIcon } from './icons';

interface SyllabusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (syllabus: Syllabus) => void;
  existingSyllabus: Syllabus | null;
  allSyllabusClasses: string[];
}

const SyllabusModal: React.FC<SyllabusModalProps> = ({ isOpen, onClose, onSave, existingSyllabus, allSyllabusClasses }) => {
  const [className, setClassName] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);
  const [currentSubject, setCurrentSubject] = useState('');

  const isEditMode = !!existingSyllabus;

  useEffect(() => {
    if (existingSyllabus) {
      setClassName(existingSyllabus.className);
      setSubjects(existingSyllabus.subjects);
    } else {
      setClassName('');
      setSubjects([]);
    }
    setCurrentSubject('');
  }, [existingSyllabus, isOpen]);

  const handleAddSubject = () => {
    if (currentSubject.trim() && !subjects.includes(currentSubject.trim())) {
      setSubjects([...subjects, currentSubject.trim()]);
      setCurrentSubject('');
    }
  };
  
  const handleRemoveSubject = (subjectToRemove: string) => {
    setSubjects(subjects.filter(s => s !== subjectToRemove));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className.trim() || subjects.length === 0) {
      alert('Please provide a class name and at least one subject.');
      return;
    }
    if (!isEditMode && allSyllabusClasses.includes(className.trim())) {
        alert(`A syllabus for Class ${className.trim()} already exists.`);
        return;
    }
    onSave({ className: className.trim(), subjects });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{isEditMode ? 'Edit Syllabus' : 'Add New Syllabus'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class Name</label>
              <input 
                type="text" 
                id="className" 
                value={className} 
                onChange={e => setClassName(e.target.value)} 
                required 
                disabled={isEditMode}
                placeholder="e.g., 10 or Nursery"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed" 
              />
            </div>

            <div>
              <label htmlFor="currentSubject" className="block text-sm font-medium text-gray-700">Add Subject</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input 
                  type="text" 
                  id="currentSubject" 
                  value={currentSubject}
                  onChange={e => setCurrentSubject(e.target.value)}
                  onKeyDown={e => { if(e.key === 'Enter') { e.preventDefault(); handleAddSubject(); }}}
                  className="flex-1 block w-full rounded-none rounded-l-md p-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500" 
                  placeholder="e.g., Mathematics"
                />
                <button 
                  type="button" 
                  onClick={handleAddSubject}
                  className="inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 rounded-r-md bg-gray-50 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Add
                </button>
              </div>
            </div>

            {subjects.length > 0 && (
                <div className="border rounded-lg p-3 bg-gray-50 max-h-60 overflow-y-auto">
                    <h3 className="text-sm font-medium text-gray-600 mb-2">Subjects for Class {className || '...'}</h3>
                    <ul className="space-y-2">
                        {subjects.map(subject => (
                            <li key={subject} className="flex justify-between items-center bg-white p-2 rounded shadow-sm">
                                <span className="text-gray-800">{subject}</span>
                                <button type="button" onClick={() => handleRemoveSubject(subject)} className="text-red-500 hover:text-red-700">
                                    <TrashIcon className="w-5 h-5"/>
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Save Syllabus
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SyllabusModal;