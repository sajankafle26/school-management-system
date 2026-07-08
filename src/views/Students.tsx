import React, { useState, useMemo, useEffect, useRef } from 'react';
import type { Student, FeeInvoice } from '../types';
import AddStudentModal from '../components/AddStudentModal';
import StudentDetailsModal from '../components/StudentDetailsModal';
import { UploadIcon, DownloadIcon } from '../components/icons';

declare var XLSX: any;

interface StudentsProps {
    selectedAcademicYear: string;
    invoices: FeeInvoice[];
}

const Students: React.FC<StudentsProps> = ({ selectedAcademicYear, invoices }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    const [selectedClass, setSelectedClass] = useState<string>('All');
    const [selectedSection, setSelectedSection] = useState<string>('All');
    const [searchTerm, setSearchTerm] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
    }, []);

    const yearStudents = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);

    const availableClasses = useMemo(() => ['All', ...[...new Set(yearStudents.map(s => s.className))].sort()], [yearStudents]);

    const availableSections = useMemo(() => {
        if (selectedClass === 'All') {
            return ['All'];
        }
        return ['All', ...[...new Set(yearStudents.filter(s => s.className === selectedClass).map(s => s.section))].sort()];
    }, [yearStudents, selectedClass]);

    useEffect(() => {
        setSelectedClass('All');
        setSelectedSection('All');
    }, [selectedAcademicYear]);

    useEffect(() => {
        setSelectedSection('All');
    }, [selectedClass]);

    const filteredStudents = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();
        return yearStudents.filter(student => {
            const classMatch = selectedClass === 'All' || student.className === selectedClass;
            const sectionMatch = selectedSection === 'All' || student.section === selectedSection;
            const searchMatch = !lowercasedSearchTerm ||
                                student.name.toLowerCase().includes(lowercasedSearchTerm) ||
                                student.nepaliName.toLowerCase().includes(lowercasedSearchTerm) ||
                                String(student.roll).includes(lowercasedSearchTerm) ||
                                student.contact.includes(lowercasedSearchTerm);
            return classMatch && sectionMatch && searchMatch;
        });
    }, [yearStudents, selectedClass, selectedSection, searchTerm]);

    const handleAddStudent = async (newStudentData: Omit<Student, 'id' | 'academicYear'>) => {
        try {
            const res = await fetch('/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newStudentData, academicYear: selectedAcademicYear }),
            });
            const created = await res.json();
            setStudents(prevStudents => [created, ...prevStudents]);
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Failed to add student:', error);
        }
    };

    const triggerFileSelect = () => fileInputRef.current?.click();

    const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const binaryStr = event.target?.result;
                const workbook = XLSX.read(binaryStr, { type: 'binary' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const data = XLSX.utils.sheet_to_json(worksheet);
                
                const newStudents: Omit<Student, 'id'>[] = data.map((row: any, index: number) => {
                    if (!row.name || !row.className || !row.roll || !row.parentId) {
                        console.warn('Skipping invalid row:', row);
                        return null;
                    }
                    return {
                        name: row.name,
                        nepaliName: row.nepaliName || '',
                        className: String(row.className),
                        section: String(row.section || ''),
                        roll: Number(row.roll),
                        dob: row.dob || '',
                        guardianName: row.guardianName || '',
                        contact: String(row.contact || ''),
                        address: row.address || '',
                        profilePic: 'https://picsum.photos/seed/new-student/100',
                        parentId: Number(row.parentId),
                        academicYear: selectedAcademicYear,
                    };
                }).filter((s: Omit<Student, 'id'> | null): s is Omit<Student, 'id'> => s !== null);

                for (const studentData of newStudents) {
                    await fetch('/api/students', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(studentData),
                    });
                }
                const res = await fetch('/api/students');
                const updatedStudents = await res.json();
                setStudents(updatedStudents);
                alert(`${newStudents.length} students imported successfully to year ${selectedAcademicYear}!`);
            } catch (error) {
                console.error("Error importing file:", error);
                alert("Failed to import students. Please check the file format.");
            }
        };

        if (file.name.endsWith('.csv')) {
            reader.readAsText(file);
             reader.onload = async (event) => {
                const text = event.target?.result as string;
                const lines = text.split('\n').filter(line => line.trim());
                if (lines.length < 2) {
                    alert('CSV file is empty or has only a header.');
                    return;
                }
                const headers = lines[0].split(',').map(h => h.trim());
                const requiredHeaders = ['name', 'className', 'roll', 'parentId'];
                if (!requiredHeaders.every(h => headers.includes(h))) {
                    alert(`CSV must contain headers: ${requiredHeaders.join(', ')}`);
                    return;
                }
                const newStudents: Omit<Student, 'id'>[] = lines.slice(1).map((line, index) => {
                    const values = line.split(',');
                    const row = headers.reduce((obj, header, i) => {
                        obj[header] = values[i] ? values[i].trim() : '';
                        return obj;
                    }, {} as any);
                    return {
                        name: row.name,
                        nepaliName: row.nepaliName || '',
                        className: String(row.className),
                        section: String(row.section || ''),
                        roll: Number(row.roll),
                        dob: row.dob || '',
                        guardianName: row.guardianName || '',
                        contact: String(row.contact || ''),
                        address: row.address || '',
                        profilePic: 'https://picsum.photos/seed/new-student/100',
                        parentId: Number(row.parentId),
                        academicYear: selectedAcademicYear,
                    };
                });
                for (const studentData of newStudents) {
                    await fetch('/api/students', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(studentData),
                    });
                }
                const res = await fetch('/api/students');
                const updatedStudents = await res.json();
                setStudents(updatedStudents);
                alert(`${newStudents.length} students imported successfully from CSV!`);
             }
        } else {
            reader.readAsBinaryString(file);
        }
        if (e.target) e.target.value = '';
    };

    const handleExport = (format: 'csv' | 'excel') => {
        const dataToExport = filteredStudents.map(({ id, parentId, ...rest}) => rest);
        if (format === 'excel') {
            const worksheet = XLSX.utils.json_to_sheet(dataToExport);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, `Students_${selectedAcademicYear.replace('/', '-')}`);
            XLSX.writeFile(workbook, `students_${selectedAcademicYear.replace('/', '-')}.xlsx`);
        } else {
            const headers = Object.keys(dataToExport[0] || {});
            const csvContent = [
                headers.join(','),
                ...dataToExport.map(student => 
                    headers.map(header => `"${String((student as any)[header]).replace(/"/g, '""')}"`).join(',')
                )
            ].join('\n');

            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `students_${selectedAcademicYear.replace('/', '-')}.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Students Management</h1>
                 <div className="flex items-center space-x-3">
                    <button onClick={triggerFileSelect} className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors flex items-center">
                        <UploadIcon className="w-5 h-5 mr-2" />
                        Import
                    </button>
                    <button onClick={() => handleExport('csv')} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Export CSV
                    </button>
                    <button onClick={() => handleExport('excel')} className="bg-green-700 text-white px-4 py-2 rounded-lg hover:bg-green-800 transition-colors flex items-center">
                        <DownloadIcon className="w-5 h-5 mr-2" />
                        Export Excel
                    </button>
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Student
                    </button>
                </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileImport} className="hidden" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
            
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
                        className="mt-1 block w-48 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                        {availableSections.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sections' : `Section ${s}`}</option>)}
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4">
                    <input 
                        type="text" 
                        placeholder="Search by name, roll no, or contact..." 
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No.</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                                <th scope="col" className="relative px-6 py-3">
                                    <span className="sr-only">Actions</span>
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredStudents.map((student: Student) => (
                                <tr key={student.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10">
                                                <img className="h-10 w-10 rounded-full object-cover" src={student.profilePic} alt={student.name} />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                <div className="text-sm text-gray-500 font-nepali">{student.nepaliName}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.className} {student.section}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.roll}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.contact}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.address}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedStudent(student)} className="text-blue-600 hover:text-blue-900">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredStudents.length === 0 && (
                        <div className="text-center p-8 text-gray-500">
                            No students found for the selected criteria in academic year {selectedAcademicYear}.
                        </div>
                    )}
                </div>
            </div>

            <AddStudentModal 
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAddStudent={handleAddStudent}
            />

            {selectedStudent && (
                <StudentDetailsModal
                    student={selectedStudent}
                    results={[]}
                    invoices={invoices.filter(i => i.studentId === selectedStudent.id)}
                    books={[]}
                    issuedBooks={[]}
                    onClose={() => setSelectedStudent(null)}
                />
            )}
        </div>
    );
};

export default Students;
