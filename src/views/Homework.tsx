import React, { useState, useMemo, useEffect } from 'react';
import type { Homework, Student, Teacher } from '../types';
import AddHomeworkModal from '../components/AddHomeworkModal';
import { HomeworkIcon } from '../components/icons';

interface HomeworkPageProps {
    selectedAcademicYear: string;
}

const HomeworkPage: React.FC<HomeworkPageProps> = ({ selectedAcademicYear }) => {
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    useEffect(() => {
        fetch(`/api/homework?academicYear=${selectedAcademicYear}`)
            .then(res => res.json())
            .then(setHomeworks)
            .catch(console.error);
    }, [selectedAcademicYear]);

    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
        fetch('/api/teachers')
            .then(res => res.json())
            .then(setTeachers)
            .catch(console.error);
    }, []);
    
    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);

    const [selectedClass, setSelectedClass] = useState<string>('All');
    const [selectedSection, setSelectedSection] = useState<string>('All');
    
    const availableClasses = useMemo(() => ['All', ...[...new Set(studentsThisYear.map(s => s.className))].sort((a,b) => Number(a)-Number(b))], [studentsThisYear]);
    const availableSections = useMemo(() => {
        if (selectedClass === 'All') return ['All'];
        return ['All', ...[...new Set(studentsThisYear.filter(s => s.className === selectedClass).map(s => s.section))].sort()];
    }, [selectedClass, studentsThisYear]);
    
    useEffect(() => {
        setSelectedClass('All');
        setSelectedSection('All');
    }, [selectedAcademicYear]);

    useEffect(() => {
        setSelectedSection('All');
    }, [selectedClass]);

    const teachersMap = useMemo(() => new Map(teachers.map(t => [t.id, t])), [teachers]);

    const filteredHomeworks = useMemo(() => {
        return homeworks
            .filter(hw => {
                if (hw.academicYear !== selectedAcademicYear) return false;
                const classMatch = selectedClass === 'All' || hw.className === selectedClass;
                const sectionMatch = selectedSection === 'All' || hw.section === selectedSection;
                return classMatch && sectionMatch;
            })
            .sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    }, [homeworks, selectedClass, selectedSection, selectedAcademicYear]);

    const handleAddHomework = async (newHomeworkData: Omit<Homework, 'id' | 'academicYear'>) => {
        try {
            const res = await fetch('/api/homework', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newHomeworkData, academicYear: selectedAcademicYear }),
            });
            const created = await res.json();
            setHomeworks(prev => [created, ...prev]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Failed to add homework:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Homework Management</h1>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    Add New Homework
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex items-center space-x-4">
                <div>
                    <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700">Filter by Class</label>
                    <select 
                        id="class-filter"
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {availableClasses.map(c => <option key={c} value={c}>{c === 'All' ? 'All Classes' : `Class ${c}`}</option>)}
                    </select>
                </div>
                <div>
                    <label htmlFor="section-filter" className="block text-sm font-medium text-gray-700">Filter by Section</label>
                    <select 
                        id="section-filter"
                        value={selectedSection} 
                        onChange={(e) => setSelectedSection(e.target.value)}
                        disabled={selectedClass === 'All'}
                        className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                    >
                        {availableSections.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sections' : `Section ${s}`}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-6">
                {filteredHomeworks.length > 0 ? filteredHomeworks.map(hw => {
                    const teacher = teachersMap.get(hw.assignedByTeacherId);
                    return (
                        <div key={hw.id} className="bg-white p-6 rounded-xl shadow-lg">
                            <div className="flex flex-col md:flex-row justify-between md:items-start">
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="font-bold text-gray-800 text-lg">Class {hw.className} {hw.section}</span>
                                        <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-full">{hw.subject}</span>
                                    </div>
                                    <h2 className="text-xl font-bold text-gray-800">{hw.title}</h2>
                                    <p className="text-sm text-gray-500 mt-1">Assigned by {teacher?.name || 'Unknown'} | Due on <span className="font-semibold text-red-600">{hw.dueDate}</span></p>
                                </div>
                                <div className="mt-4 md:mt-0">
                                </div>
                            </div>
                            <p className="text-gray-600 mt-4">{hw.description}</p>
                            {hw.imageUrl && (
                                <div className="mt-4">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Attachment:</p>
                                    <a href={hw.imageUrl} target="_blank" rel="noopener noreferrer">
                                        <img src={hw.imageUrl} alt="Homework attachment" className="rounded-lg max-h-52 border p-1" />
                                    </a>
                                </div>
                            )}
                        </div>
                    );
                }) : (
                    <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                        <HomeworkIcon className="w-16 h-16 mx-auto text-gray-300" />
                        <h3 className="mt-2 text-xl font-medium text-gray-800">No Homework Found</h3>
                        <p className="mt-1 text-sm text-gray-500">There are no homework assignments for the selected academic year and filters.</p>
                    </div>
                )}
            </div>

            <AddHomeworkModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddHomework={handleAddHomework}
            />
        </div>
    );
};

export default HomeworkPage;
