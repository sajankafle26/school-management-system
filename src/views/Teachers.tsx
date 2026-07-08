import React, { useState, useMemo, useEffect } from 'react';
import type { Teacher, Student } from '../types';
import AddTeacherModal from '../components/AddTeacherModal';
import AssignClassTeacherModal from '../components/AssignClassTeacherModal';

interface TeachersProps {
    selectedAcademicYear: string;
}

const Teachers: React.FC<TeachersProps> = ({ selectedAcademicYear }) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);

    useEffect(() => {
        fetch('/api/teachers')
            .then(res => res.json())
            .then(setTeachers)
            .catch(console.error);
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
    }, []);
    
    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);

    const { availableClasses, sectionsByClass } = useMemo(() => {
        const classMap = new Map<string, Set<string>>();
        studentsThisYear.forEach(s => {
            if (!classMap.has(s.className)) {
                classMap.set(s.className, new Set());
            }
            classMap.get(s.className)!.add(s.section);
        });

        const sortedClasses = Array.from(classMap.keys()).sort((a, b) => Number(a) - Number(b));
        
        const sections: { [key: string]: string[] } = {};
        classMap.forEach((sectionSet, className) => {
            sections[className] = Array.from(sectionSet).sort();
        });

        return { availableClasses: sortedClasses, sectionsByClass: sections };
    }, [studentsThisYear]);

    const handleAddTeacher = async (newTeacherData: Omit<Teacher, 'id'>) => {
        try {
            const res = await fetch('/api/teachers', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newTeacherData),
            });
            const created = await res.json();
            setTeachers(prev => [created, ...prev]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Failed to add teacher:', error);
        }
    };

    const handleAssignClassTeacher = (teacherId: number, className: string) => {
        setTeachers(prev => prev.map(teacher => {
            if (teacher.classTeacherOf === className) {
                return { ...teacher, classTeacherOf: undefined };
            }
            return teacher;
        }).map(teacher => {
            if (teacher.id === teacherId) {
                return { ...teacher, classTeacherOf: className };
            }
            return teacher;
        }));
        setIsAssignModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Teachers Management</h1>
                <div className="flex space-x-3">
                    <button 
                        onClick={() => setIsAssignModalOpen(true)}
                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                    >
                        Assign Class Teacher
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Teacher
                    </button>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {teachers.map((teacher: Teacher) => (
                                <tr key={teacher.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={teacher.profilePic} alt={teacher.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{teacher.name}</div>
                                                <div className="text-sm text-gray-500 font-nepali">{teacher.nepaliName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div>{teacher.contact}</div>
                                        <div className="text-xs text-gray-400">{teacher.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {teacher.classTeacherOf ? (
                                            <span className="bg-purple-100 text-purple-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                                                Class Teacher of {teacher.classTeacherOf}
                                            </span>
                                        ) : (
                                            <span>Subject Teacher</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button className="text-blue-600 hover:text-blue-900">Edit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AddTeacherModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddTeacher={handleAddTeacher}
            />

            <AssignClassTeacherModal
                isOpen={isAssignModalOpen}
                onClose={() => setIsAssignModalOpen(false)}
                onAssign={handleAssignClassTeacher}
                teachers={teachers}
                classes={availableClasses}
                sectionsByClass={sectionsByClass}
            />
        </div>
    );
};

export default Teachers;
