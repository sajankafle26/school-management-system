import React, { useState, useEffect } from 'react';
import type { Syllabus } from '../types';
import SyllabusModal from '../components/SyllabusModal';
import { EditIcon } from '../components/icons';

const Academics: React.FC = () => {
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSyllabus, setEditingSyllabus] = useState<Syllabus | null>(null);

  useEffect(() => {
    fetch('/api/syllabus')
      .then(res => res.json())
      .then(setSyllabuses)
      .catch(console.error);
  }, []);

  const handleAddNew = () => {
    setEditingSyllabus(null);
    setIsModalOpen(true);
  };

  const handleEdit = (syllabus: Syllabus) => {
    setEditingSyllabus(syllabus);
    setIsModalOpen(true);
  };

  const handleSaveSyllabus = async (savedSyllabus: Syllabus) => {
    try {
      const res = await fetch('/api/syllabus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(savedSyllabus),
      });
      const created = await res.json();
      if (editingSyllabus) {
        setSyllabuses(syllabuses.map(s => s.className === editingSyllabus.className ? created : s));
      } else {
        if (syllabuses.some(s => s.className === created.className)) {
          alert(`A syllabus for Class ${created.className} already exists.`);
          return;
        }
        setSyllabuses([...syllabuses, created]);
      }
      setIsModalOpen(false);
      setEditingSyllabus(null);
    } catch (error) {
      console.error('Failed to save syllabus:', error);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Syllabus Management</h1>
        <button 
          onClick={handleAddNew}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Syllabus
        </button>
      </div>
      <p className="text-gray-600 mb-8">
        Manage subjects for each class. This syllabus will be used for creating result entries.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {syllabuses.map((syllabus: Syllabus) => (
          <div key={syllabus.className} className="bg-white p-6 rounded-xl shadow-lg relative">
            <h2 className="text-xl font-bold text-gray-800 mb-4 pb-2 border-b">
              Class {syllabus.className}
            </h2>
            <ul className="space-y-2">
              {syllabus.subjects.map(subject => (
                <li key={subject} className="flex items-center text-gray-700">
                  <svg className="w-4 h-4 mr-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  {subject}
                </li>
              ))}
            </ul>
             <button
              onClick={() => handleEdit(syllabus)}
              className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 p-2 rounded-full transition-colors"
              aria-label={`Edit syllabus for Class ${syllabus.className}`}
            >
              <EditIcon className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      <SyllabusModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSyllabus}
        existingSyllabus={editingSyllabus}
        allSyllabusClasses={syllabuses.map(s => s.className)}
      />
    </div>
  );
};

export default Academics;
