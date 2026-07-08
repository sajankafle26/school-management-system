import React, { useState, useMemo, useEffect } from 'react';
import type { User, ClassRoutine, Period, Student, Teacher, Syllabus, RoutineEntry } from '../types';
import RoutineDisplay from '../components/RoutineDisplay';
import EditRoutineModal from '../components/EditRoutineModal';
import { EditIcon, ClockIcon } from '../components/icons';
import EditPeriodsModal from '../components/EditPeriodsModal';

interface RoutinesProps {
    user: User;
    selectedAcademicYear: string;
}

const Routines: React.FC<RoutinesProps> = ({ user, selectedAcademicYear }) => {
    const [routines, setRoutines] = useState<ClassRoutine[]>([]);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [syllabuses, setSyllabuses] = useState<Syllabus[]>([]);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPeriodsModalOpen, setIsPeriodsModalOpen] = useState(false);

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
        fetch('/api/periods')
            .then(res => res.json())
            .then(setPeriods)
            .catch(console.error);
        fetch('/api/routines')
            .then(res => res.json())
            .then(setRoutines)
            .catch(console.error);
    }, []);

    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);
    const routinesThisYear = useMemo(() => routines.filter(r => r.academicYear === selectedAcademicYear), [routines, selectedAcademicYear]);

    const availableClasses = useMemo(() => [...new Set(studentsThisYear.map(s => s.className))].sort((a,b) => Number(a)-Number(b)), [studentsThisYear]);
    
    const [selectedClass, setSelectedClass] = useState(availableClasses[0] || '');
    
    const availableSections = useMemo(() => {
        if (!selectedClass) return [];
        return [...new Set(studentsThisYear.filter(s => s.className === selectedClass).map(s => s.section))].sort();
    }, [selectedClass, studentsThisYear]);

    const [selectedSection, setSelectedSection] = useState(availableSections[0] || '');

    useEffect(() => {
        if (availableClasses.length > 0) {
            setSelectedClass(availableClasses[0]);
        } else {
            setSelectedClass('');
        }
    }, [selectedAcademicYear, availableClasses]);

    useEffect(() => {
        if (availableSections.length > 0 && !availableSections.includes(selectedSection)) {
            setSelectedSection(availableSections[0]);
        } else if (availableSections.length === 0) {
            setSelectedSection('');
        }
    }, [selectedClass, selectedSection, availableSections]);

    const selectedRoutine = useMemo(() => {
        return routinesThisYear.find(r => r.className === selectedClass && r.section === selectedSection);
    }, [routinesThisYear, selectedClass, selectedSection]);

    const handleSaveRoutine = async (updatedRoutine: ClassRoutine) => {
        try {
            const res = await fetch('/api/routines', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedRoutine),
            });
            const saved = await res.json();
            setRoutines(prev => {
                const exists = prev.some(r => r.className === saved.className && r.section === saved.section && r.academicYear === selectedAcademicYear);
                if (exists) {
                    return prev.map(r => (r.className === saved.className && r.section === saved.section && r.academicYear === selectedAcademicYear) ? saved : r);
                }
                return [...prev, saved];
            });
            setIsEditModalOpen(false);
        } catch (error) {
            console.error('Failed to save routine:', error);
        }
    };
    
    const handleSavePeriods = (updatedPeriods: Period[]) => {
        setPeriods(updatedPeriods);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Class Routines</h1>
                 {user.role === 'admin' && (
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setIsPeriodsModalOpen(true)}
                            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                        >
                            <ClockIcon className="w-5 h-5 mr-2" />
                            Manage Periods
                        </button>
                        <button 
                            onClick={() => setIsEditModalOpen(true)}
                            disabled={!selectedClass || !selectedSection}
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center disabled:bg-blue-300"
                        >
                            <EditIcon className="w-5 h-5 mr-2" />
                            Edit Routine
                        </button>
                    </div>
                 )}
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex items-center space-x-4">
                <div>
                    <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">Select Class</label>
                    <select 
                        id="class-select"
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="section-select" className="block text-sm font-medium text-gray-700">Select Section</label>
                    <select 
                        id="section-select"
                        value={selectedSection} 
                        onChange={(e) => setSelectedSection(e.target.value)}
                        className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            <RoutineDisplay routine={selectedRoutine} teachers={teachers} periods={periods} />

            {user.role === 'admin' && (
                <>
                    <EditRoutineModal
                        isOpen={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        onSave={handleSaveRoutine}
                        routines={routinesThisYear}
                        selectedClassName={selectedClass}
                        selectedSection={selectedSection}
                        teachers={teachers}
                        syllabuses={syllabuses}
                        periods={periods}
                        academicYear={selectedAcademicYear}
                    />
                    <EditPeriodsModal 
                        isOpen={isPeriodsModalOpen}
                        onClose={() => setIsPeriodsModalOpen(false)}
                        onSave={handleSavePeriods}
                        initialPeriods={periods}
                    />
                </>
            )}
        </div>
    );
};

export default Routines;
