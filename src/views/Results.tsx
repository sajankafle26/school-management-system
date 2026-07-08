import React, { useState, useMemo, useEffect } from 'react';
import type { Result, Student } from '../types';
import AddResultModal from '../components/AddResultModal';
import ResultDetailsModal from '../components/ResultDetailsModal';

interface ResultsProps {
    selectedAcademicYear: string;
}

const Results: React.FC<ResultsProps> = ({ selectedAcademicYear }) => {
    const [results, setResults] = useState<Result[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedResult, setSelectedResult] = useState<{ result: Result, student: Student } | null>(null);

    useEffect(() => {
        fetch(`/api/results?academicYear=${selectedAcademicYear}`)
            .then(res => res.json())
            .then(setResults)
            .catch(console.error);
    }, [selectedAcademicYear]);

    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
    }, []);

    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);
    const resultsThisYear = useMemo(() => results.filter(r => r.academicYear === selectedAcademicYear), [results, selectedAcademicYear]);

    const [selectedClass, setSelectedClass] = useState<string>('10');
    const [selectedSection, setSelectedSection] = useState<string>('A');
    const [selectedExam, setSelectedExam] = useState<'First Terminal' | 'Mid Terminal' | 'Final Terminal'>('Mid Terminal');
    
    const availableClasses = useMemo(() => [...new Set(studentsThisYear.map(s => s.className))].sort((a,b) => Number(a)-Number(b)), [studentsThisYear]);
    const availableSections = useMemo(() => {
        if (!selectedClass) return [];
        return [...new Set(studentsThisYear.filter(s => s.className === selectedClass).map(s => s.section))].sort();
    }, [selectedClass, studentsThisYear]);

    useEffect(() => {
        if (availableClasses.length > 0 && !availableClasses.includes(selectedClass)) {
            setSelectedClass(availableClasses[0]);
        }
    }, [availableClasses, selectedClass]);

    useEffect(() => {
        if (availableSections.length > 0 && !availableSections.includes(selectedSection)) {
            setSelectedSection(availableSections[0]);
        }
    }, [selectedClass, selectedSection, availableSections]);

    const studentsMap = useMemo(() => 
        new Map(students.map(student => [student.id, student])),
    [students]);

    const rankedResults = useMemo(() => {
        const filtered = resultsThisYear
            .filter(r => r.className === selectedClass && r.section === selectedSection && r.examType === selectedExam)
            .sort((a, b) => b.totalMarks - a.totalMarks);

        if (filtered.length === 0) return [];
        
        let rank = 1;
        return filtered.map((result, index) => {
            if (index > 0 && result.totalMarks < filtered[index - 1].totalMarks) {
                rank = index + 1;
            }
            return { ...result, rank };
        });
    }, [resultsThisYear, selectedClass, selectedSection, selectedExam]);
    
    const subjects = rankedResults.length > 0 ? rankedResults[0].marks.map(m => m.subject) : [];

    const handleAddResult = (newResultData: Omit<Result, 'id' | 'academicYear'>) => {
        const newResult: Result = {
            id: Date.now(),
            ...newResultData,
            academicYear: selectedAcademicYear,
        };
        setResults(prevResults => [newResult, ...prevResults]);
        setIsModalOpen(false);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Student Results</h1>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setIsModalOpen(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add New Result
                    </button>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
                        Publish Results
                    </button>
                </div>
            </div>
            
            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex items-center space-x-4">
                <div>
                    <label htmlFor="class-select" className="block text-sm font-medium text-gray-700">Select Class</label>
                    <select 
                        id="class-select"
                        value={selectedClass} 
                        onChange={(e) => setSelectedClass(e.target.value)}
                        className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                        className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                 <div>
                    <label htmlFor="exam-select" className="block text-sm font-medium text-gray-700">Select Exam</label>
                    <select 
                        id="exam-select"
                        value={selectedExam}
                        onChange={(e) => setSelectedExam(e.target.value as 'First Terminal' | 'Mid Terminal' | 'Final Terminal')}
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                    >
                        <option>First Terminal</option>
                        <option>Mid Terminal</option>
                        <option>Final Terminal</option>
                    </select>
                </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                {subjects.map(subject => (
                                    <th key={subject} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">{subject}</th>
                                ))}
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">%</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                                <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                                <th scope="col" className="relative px-6 py-3"><span className="sr-only">Details</span></th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {rankedResults.map((result: Result) => {
                                const student = studentsMap.get(result.studentId);
                                if (!student) return null;
                                return (
                                    <tr key={result.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.roll}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                            <div className="text-sm text-gray-500 font-nepali">{student.nepaliName}</div>
                                        </td>
                                        {result.marks.map(mark => (
                                            <td key={mark.subject} className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{mark.marksObtained}</td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-semibold text-gray-800">{result.totalMarks}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">{result.percentage.toFixed(2)}%</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                result.grade === 'A+' || result.grade === 'A' ? 'bg-green-100 text-green-800' :
                                                result.grade === 'B+' || result.grade === 'B' ? 'bg-blue-100 text-blue-800' :
                                                result.grade === 'C+' || result.grade === 'C' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {result.grade}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-bold text-gray-800">{result.rank}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button onClick={() => setSelectedResult({ result, student })} className="text-indigo-600 hover:text-indigo-900">View</button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                     {rankedResults.length === 0 && (
                        <div className="text-center p-8 text-gray-500">
                            No results found for the selected criteria in academic year {selectedAcademicYear}.
                        </div>
                    )}
                </div>
            </div>

            <AddResultModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddResult={handleAddResult}
                students={studentsThisYear}
            />

            {selectedResult && (
                <ResultDetailsModal
                    isOpen={!!selectedResult}
                    onClose={() => setSelectedResult(null)}
                    result={selectedResult.result}
                    student={selectedResult.student}
                />
            )}
        </div>
    );
};

export default Results;
