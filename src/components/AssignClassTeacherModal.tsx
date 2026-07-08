import React, { useState, useEffect } from 'react';
import type { Teacher } from '../types';

interface AssignClassTeacherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (teacherId: number, classSection: string) => void;
  teachers: Teacher[];
  classes: string[];
  sectionsByClass: { [key: string]: string[] };
}

const AssignClassTeacherModal: React.FC<AssignClassTeacherModalProps> = ({ isOpen, onClose, onAssign, teachers, classes, sectionsByClass }) => {
    const [selectedTeacher, setSelectedTeacher] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');

    const availableSections = sectionsByClass[selectedClass] || [];
    
    // Set initial class and section on open or when classes change
    useEffect(() => {
        if (isOpen) {
            if (classes.length > 0) {
                const firstClass = classes[0];
                setSelectedClass(firstClass);
                const firstClassSections = sectionsByClass[firstClass] || [];
                if (firstClassSections.length > 0) {
                    setSelectedSection(firstClassSections[0]);
                } else {
                    setSelectedSection('');
                }
            } else {
                setSelectedClass('');
                setSelectedSection('');
            }
            setSelectedTeacher('');
        }
    }, [isOpen, classes, sectionsByClass]);

    // Effect to handle class change by user
    useEffect(() => {
        if (availableSections.length > 0) {
            setSelectedSection(availableSections[0]);
        } else {
            setSelectedSection('');
        }
    }, [selectedClass]);


    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTeacher || !selectedClass || !selectedSection) {
            alert('Please select a teacher, class, and section.');
            return;
        }
        onAssign(parseInt(selectedTeacher, 10), `${selectedClass} ${selectedSection}`);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4" aria-modal="true" role="dialog" onClick={onClose}>
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Assign Class Teacher</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-3xl leading-none" aria-label="Close modal">&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="teacher-select" className="block text-sm font-medium text-gray-700">Select Teacher</label>
                            <select 
                                id="teacher-select"
                                value={selectedTeacher}
                                onChange={e => setSelectedTeacher(e.target.value)}
                                required 
                                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="" disabled>-- Select a teacher --</option>
                                {teachers.map(teacher => (
                                    <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">Select Class</label>
                                <select 
                                    id="class-select"
                                    value={selectedClass}
                                    onChange={e => setSelectedClass(e.target.value)}
                                    required 
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                >
                                    {classes.map(className => (
                                        <option key={className} value={className}>{className}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label htmlFor="section-select" className="block text-sm font-medium text-gray-700">Select Section</label>
                                <select 
                                    id="section-select"
                                    value={selectedSection}
                                    onChange={e => setSelectedSection(e.target.value)}
                                    required 
                                    disabled={availableSections.length === 0}
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                                >
                                    {availableSections.map(section => (
                                        <option key={section} value={section}>{section}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex justify-end space-x-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                            Assign Teacher
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AssignClassTeacherModal;