import React, { useState, useMemo, useEffect } from 'react';
import type { Homework, Student, Teacher, Syllabus } from '../types';

interface AddHomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddHomework: (homework: Omit<Homework, 'id' | 'academicYear'>) => void;
}

const AddHomeworkModal: React.FC<AddHomeworkModalProps> = ({ isOpen, onClose, onAddHomework }) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
  const [className, setClassName] = useState('');
  const [section, setSection] = useState('');
  const [subject, setSubject] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [assignedByTeacherId, setAssignedByTeacherId] = useState('');
  const [imageUrl, setImageUrl] = useState<string | undefined>(undefined);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/students')
      .then(res => res.json())
      .then(setStudents)
      .catch(console.error);
    fetch('/api/teachers')
      .then(res => res.json())
      .then(setTeachers)
      .catch(console.error);
    fetch('/api/syllabus')
      .then(res => res.json())
      .then(setSyllabuses)
      .catch(console.error);
  }, []);
  
  const availableClasses = useMemo(() => [...new Set(students.map(s => s.className))].sort((a,b) => Number(a)-Number(b)), [students]);
  const availableSections = useMemo(() => {
    if (!className) return [];
    return [...new Set(students.filter(s => s.className === className).map(s => s.section))].sort();
  }, [className, students]);

  useEffect(() => {
    if (className && availableSections.length > 0 && !availableSections.includes(section)) {
        setSection(availableSections[0]);
        setSubject('');
    }
  }, [className, section, availableSections]);

  const availableSubjects = useMemo(() => {
    if (!className) return [];
    return syllabuses.find(s => s.className === className)?.subjects || [];
  }, [className, syllabuses]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setImageUrl(previewUrl);
    }
  };

  const resetForm = () => {
    setClassName('');
    setSection('');
    setSubject('');
    setTitle('');
    setDescription('');
    setDueDate('');
    setAssignedByTeacherId('');
    setImageUrl(undefined);
    setImagePreview(null);
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className || !section || !subject || !title || !dueDate || !assignedByTeacherId) {
        alert("Please fill out all required fields.");
        return;
    }

    onAddHomework({
      className,
      section,
      subject,
      title,
      description,
      dueDate,
      assignedByTeacherId: parseInt(assignedByTeacherId, 10),
      imageUrl,
    });
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Add New Homework</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none" aria-label="Close modal">&times;</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <label htmlFor="className" className="block text-sm font-medium text-gray-700">Class</label>
                    <select id="className" value={className} onChange={e => setClassName(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        <option value="" disabled>Select</option>
                        {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="section" className="block text-sm font-medium text-gray-700">Section</label>
                    <select id="section" value={section} onChange={e => setSection(e.target.value)} required disabled={!className} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100">
                         <option value="" disabled>Select</option>
                         {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                    <select id="subject" value={subject} onChange={e => setSubject(e.target.value)} required disabled={!className} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100">
                         <option value="" disabled>Select</option>
                         {availableSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
              <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>

             <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="assignedBy" className="block text-sm font-medium text-gray-700">Assigned By</label>
                    <select id="assignedBy" value={assignedByTeacherId} onChange={e => setAssignedByTeacherId(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm">
                        <option value="" disabled>Select a teacher</option>
                        {teachers.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">Due Date</label>
                    <input type="date" id="dueDate" value={dueDate} onChange={e => setDueDate(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm" />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Attach Image (Optional)</label>
                <div className="mt-2 flex items-center gap-4">
                    <label className="cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50">
                        <span>Upload File</span>
                        <input type="file" className="sr-only" accept="image/*" onChange={handleImageChange} />
                    </label>
                    {imagePreview && <img src={imagePreview} alt="Preview" className="h-16 w-16 rounded-md object-cover border" />}
                </div>
            </div>

          <div className="mt-8 flex justify-end space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Add Homework
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddHomeworkModal;
