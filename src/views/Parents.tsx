import React, { useState, useEffect } from 'react';
import type { Parent, Student } from '../types';
import { ParentIcon } from '../components/icons';

const Parents: React.FC = () => {
    const [parents, setParents] = useState<Parent[]>([]);
    const [students, setStudents] = useState<Student[]>([]);

    useEffect(() => {
        fetch('/api/parents')
            .then(res => res.json())
            .then(setParents)
            .catch(console.error);
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
    }, []);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Parents Information</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {parents.map(parent => {
                    const children = students.filter(s => s.parentId === parent.id);
                    return (
                        <div key={parent.id} className="bg-white p-6 rounded-xl shadow-lg">
                             <div className="flex items-center mb-4">
                                <div className="p-3 bg-blue-100 rounded-full mr-4">
                                    <ParentIcon className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                    <h2 className="text-xl font-bold text-gray-800">{parent.name}</h2>
                                    <p className="text-sm text-gray-500">{parent.contact} | {parent.email}</p>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-600 mb-2">Children:</h3>
                                <ul className="space-y-2">
                                    {children.map(child => (
                                        <li key={child.id} className="flex items-center text-gray-700 bg-gray-50 p-2 rounded-md">
                                            <img src={child.profilePic} alt={child.name} className="w-8 h-8 rounded-full mr-3"/>
                                            <span>{child.name} - Class {child.className} {child.section}</span>
                                        </li>
                                    ))}
                                </ul>
                                {children.length === 0 && <p className="text-sm text-gray-500 italic">No children registered.</p>}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Parents;
