import React, { useState, useMemo, useEffect } from 'react';
import type { Notice, Student } from '../types';
import AddNoticeModal from '../components/AddNoticeModal';

interface NoticesProps {
    selectedAcademicYear: string;
}

const Notices: React.FC<NoticesProps> = ({ selectedAcademicYear }) => {
    const [notices, setNotices] = useState<Notice[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    
    const [selectedClass, setSelectedClass] = useState<string>('All');
    const [selectedSection, setSelectedSection] = useState<string>('All');
    
    useEffect(() => {
        fetch(`/api/notices?academicYear=${selectedAcademicYear}`)
            .then(res => res.json())
            .then(setNotices)
            .catch(console.error);
    }, [selectedAcademicYear]);

    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
    }, []);

    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);

    const availableClasses = useMemo(() => ['All', ...[...new Set(studentsThisYear.map(s => s.className))].sort((a,b) => Number(a)-Number(b))], [studentsThisYear]);
    const availableSections = useMemo(() => {
        if (selectedClass === 'All') return ['All'];
        return ['All', ...[...new Set(studentsThisYear.filter(s => s.className === selectedClass).map(s => s.section))].sort()];
    }, [selectedClass, studentsThisYear]);

    const filteredNotices = useMemo(() => {
        return notices.filter(notice => {
            if (notice.academicYear !== selectedAcademicYear) return false;

            const targetClass = notice.targetClass || 'All';
            const targetSection = notice.targetSection || 'All';
            
            const classMatch = selectedClass === 'All' || targetClass === 'All' || targetClass === selectedClass;
            const sectionMatch = selectedSection === 'All' || targetSection === 'All' || targetSection === selectedSection;

            if (selectedClass !== 'All' && targetClass === 'All' && selectedSection === 'All') {
                return true;
            }

            return classMatch && sectionMatch;
        }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [notices, selectedClass, selectedSection, selectedAcademicYear]);

    const handleAddNotice = async (newNoticeData: Omit<Notice, 'id' | 'academicYear'>) => {
        try {
            const res = await fetch('/api/notices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...newNoticeData, academicYear: selectedAcademicYear }),
            });
            const created = await res.json();
            setNotices(prev => [created, ...prev]);
            setIsModalOpen(false);
        } catch (error) {
            console.error('Failed to add notice:', error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Notice Board</h1>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                    Post New Notice
                </button>
            </div>

            <div className="bg-white p-4 rounded-xl shadow-lg mb-6 flex items-center space-x-4">
                <div>
                    <label htmlFor="class-filter" className="block text-sm font-medium text-gray-700">Filter by Class</label>
                    <select 
                        id="class-filter"
                        value={selectedClass} 
                        onChange={(e) => { setSelectedClass(e.target.value); setSelectedSection('All'); }}
                        className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
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
                        className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                    >
                        {availableSections.map(s => <option key={s} value={s}>{s === 'All' ? 'All Sections' : `Section ${s}`}</option>)}
                    </select>
                </div>
            </div>

            <div className="space-y-6">
                {filteredNotices.map((notice: Notice) => (
                    <div key={notice.id} className="bg-white p-6 rounded-xl shadow-lg border-l-8 border-yellow-500">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-xl font-bold text-gray-800">{notice.title}</h2>
                                <p className="text-xs text-gray-500 mt-1">
                                    Posted on {notice.date} by <span className="font-semibold">{notice.author}</span>
                                </p>
                            </div>
                            <span className="text-sm font-medium bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                To: {notice.targetClass === 'All' ? 'Everyone' : `Class ${notice.targetClass}${notice.targetSection !== 'All' ? ` Sec ${notice.targetSection}`: ''}`}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-4">{notice.content}</p>
                    </div>
                ))}
                 {filteredNotices.length === 0 && (
                    <div className="text-center p-8 text-gray-500 bg-white rounded-xl shadow-lg">
                        No notices found for academic year {selectedAcademicYear}.
                    </div>
                )}
            </div>
            
            <AddNoticeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAddNotice={handleAddNotice}
            />
        </div>
    );
};

export default Notices;
