import React, { useState, useEffect } from 'react';
import type { Result, Student, SubjectMark, Syllabus } from '../types';

interface AddResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddResult: (result: Omit<Result, 'id' | 'academicYear'>) => void;
  students: Student[];
}

const getGradeAndRemarks = (percentage: number): { grade: string, remarks: 'Excellent' | 'Very Good' | 'Good' | 'Needs Improvement' } => {
    if (percentage >= 90) return { grade: 'A+', remarks: 'Excellent' };
    if (percentage >= 80) return { grade: 'A', remarks: 'Very Good' };
    if (percentage >= 70) return { grade: 'B+', remarks: 'Very Good' };
    if (percentage >= 60) return { grade: 'B', remarks: 'Good' };
    if (percentage >= 50) return { grade: 'C+', remarks: 'Good' };
    if (percentage >= 40) return { grade: 'C', remarks: 'Needs Improvement' };
    return { grade: 'NG', remarks: 'Needs Improvement' };
};


const AddResultModal: React.FC<AddResultModalProps> = ({ isOpen, onClose, onAddResult, students }) => {
    const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
    const [studentId, setStudentId] = useState<string>('');
    const [examType, setExamType] = useState<'First Terminal' | 'Mid Terminal' | 'Final Terminal'>('Mid Terminal');
    const [className, setClassName] = useState('');
    const [section, setSection] = useState('');
    const [marks, setMarks] = useState<SubjectMark[]>([]);

    useEffect(() => {
        fetch('/api/syllabus')
            .then(res => res.json())
            .then(setSyllabuses)
            .catch(console.error);
    }, []);

    useEffect(() => {
        if (studentId) {
            const selectedStudent = students.find(s => s.id === parseInt(studentId, 10));
            if (selectedStudent) {
                setClassName(selectedStudent.className);
                setSection(selectedStudent.section);
                
                const syllabus = syllabuses.find(syl => syl.className === selectedStudent.className);
                if (syllabus) {
                    setMarks(syllabus.subjects.map(sub => ({ subject: sub, marksObtained: 0, fullMarks: 100 })));
                } else {
                    setMarks([]);
                }
            }
        } else {
            setClassName('');
            setSection('');
            setMarks([]);
        }
    }, [studentId, students, syllabuses]);

    const handleMarkChange = (index: number, field: keyof SubjectMark, value: string | number) => {
        const newMarks = [...marks];
        (newMarks[index] as any)[field] = field === 'subject' ? value : Number(value);
        setMarks(newMarks);
    };
    
    const resetForm = () => {
        setStudentId('');
        setExamType('Mid Terminal');
        setClassName('');
        setSection('');
        setMarks([]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!studentId || marks.length === 0 || marks.some(m => m.marksObtained < 0 || m.fullMarks <= 0)) {
            alert("Please select a student and fill all marks correctly. Ensure a syllabus is defined for the class.");
            return;
        }

        const totalMarksObtained = marks.reduce((acc, curr) => acc + curr.marksObtained, 0);
        const totalFullMarks = marks.reduce((acc, curr) => acc + curr.fullMarks, 0);
        const percentage = totalFullMarks > 0 ? (totalMarksObtained / totalFullMarks) * 100 : 0;
        const { grade, remarks } = getGradeAndRemarks(percentage);

        const newResult: Omit<Result, 'id' | 'academicYear'> = {
            studentId: parseInt(studentId, 10),
            examType,
            className,
            section,
            marks,
            totalMarks: totalMarksObtained,
            percentage,
            grade,
            remarks,
        };
        
        onAddResult(newResult);
        resetForm();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-2xl max-h-[95vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Add New Result</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                        <div className="md:col-span-2">
                            <label htmlFor="student" className="block text-sm font-medium text-gray-700">Student</label>
                            <select id="student" value={studentId} onChange={e => setStudentId(e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option value="" disabled>Select a student</option>
                                {students.map(student => (
                                    <option key={student.id} value={student.id}>{student.name} ({student.className} {student.section} - Roll {student.roll})</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="examType" className="block text-sm font-medium text-gray-700">Exam Type</label>
                            <select id="examType" value={examType} onChange={e => setExamType(e.target.value as any)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500">
                                <option>First Terminal</option>
                                <option>Mid Terminal</option>
                                <option>Final Terminal</option>
                            </select>
                        </div>
                         <div>
                            <label htmlFor="class" className="block text-sm font-medium text-gray-700">Class & Section</label>
                            <input type="text" id="class" value={`${className} ${section}`} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 cursor-not-allowed" />
                        </div>
                    </div>
                    
                    <hr className="my-6" />

                    <h3 className="text-lg font-medium text-gray-800 mb-4">Subject Marks</h3>
                    <div className="space-y-4">
                        {marks.length > 0 ? (
                            marks.map((mark, index) => (
                                <div key={index} className="grid grid-cols-12 gap-x-4 items-center">
                                    <div className="col-span-6">
                                        <label className="block text-xs font-medium text-gray-600">Subject</label>
                                        <input type="text" value={mark.subject} readOnly className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed" />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-xs font-medium text-gray-600">Marks Got</label>
                                        <input type="number" min="0" value={mark.marksObtained} onChange={e => handleMarkChange(index, 'marksObtained', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                    <div className="col-span-3">
                                        <label className="block text-xs font-medium text-gray-600">Full Marks</label>
                                        <input type="number" min="1" value={mark.fullMarks} onChange={e => handleMarkChange(index, 'fullMarks', e.target.value)} required className="mt-1 block w-full p-2 border border-gray-300 rounded-md" />
                                    </div>
                                </div>
                            ))
                        ) : (
                             <div className="text-center p-4 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 rounded-r-lg">
                                <p>No syllabus found for this class. Please define subjects in the <span className="font-semibold">Academics</span> section first.</p>
                            </div>
                        )}
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                            Add Result
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddResultModal;
