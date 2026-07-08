import React, { useState, useMemo, useEffect } from 'react';
import type { Student, RfidLog } from '../types';
import { AttendanceIcon, RfidIcon } from '../components/icons';

type AttendanceTab = 'Manual Entry' | 'RFID Log';

interface AttendanceProps {
    selectedAcademicYear: string;
}

const Attendance: React.FC<AttendanceProps> = ({ selectedAcademicYear }) => {
    const [activeTab, setActiveTab] = useState<AttendanceTab>('Manual Entry');
    const [students, setStudents] = useState<Student[]>([]);
    const [rfidLogs, setRfidLogs] = useState<RfidLog[]>([]);
    
    // Manual Attendance State
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [attendance, setAttendance] = useState<{[key: number]: 'present' | 'absent' | 'late'}>({});

    // RFID State
    const [rfidInput, setRfidInput] = useState('');
    const [scanMessage, setScanMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
    const [lastScanStatus, setLastScanStatus] = useState<Map<number, 'Check-in' | 'Check-out'>>(new Map());

    useEffect(() => {
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
        fetch('/api/rfid-logs')
            .then(res => res.json())
            .then((data: RfidLog[]) => {
                const sorted = data.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
                setRfidLogs(sorted);
                const map = new Map<number, 'Check-in' | 'Check-out'>();
                sorted.forEach(log => {
                    if (!map.has(log.studentId)) {
                        map.set(log.studentId, log.status);
                    }
                });
                setLastScanStatus(map);
            })
            .catch(console.error);
    }, []);

    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);
    const studentsMap = useMemo(() => new Map(students.map(s => [s.id, s])), [students]);
    
    // Manual Attendance Logic
    const availableClasses = useMemo(() => [...new Set(studentsThisYear.map(s => s.className))].sort((a,b) => Number(a)-Number(b)), [studentsThisYear]);
    const availableSections = useMemo(() => {
        if (!selectedClass) return [];
        return [...new Set(studentsThisYear.filter(s => s.className === selectedClass).map(s => s.section))].sort();
    }, [selectedClass, studentsThisYear]);

    useEffect(() => {
        if (availableClasses.length > 0 && (!selectedClass || !availableClasses.includes(selectedClass))) {
            setSelectedClass(availableClasses[0]);
        }
    }, [availableClasses, selectedClass, selectedAcademicYear]);

    useEffect(() => {
        if (availableSections.length > 0 && (!selectedSection || !availableSections.includes(selectedSection))) {
            setSelectedSection(availableSections[0]);
        } else if (availableSections.length === 0) {
            setSelectedSection('');
        }
    }, [selectedClass, selectedSection, availableSections]);

    const studentsInClass = studentsThisYear.filter(s => s.className === selectedClass && s.section === selectedSection);

    const handleStatusChange = (studentId: number, status: 'present' | 'absent' | 'late') => {
        setAttendance(prev => ({...prev, [studentId]: status}));
    };

    // RFID Logic
    const handleRfidScan = (e: React.FormEvent) => {
        e.preventDefault();
        setScanMessage(null);
        if (!rfidInput.trim()) return;

        const student = students.find(s => s.rfidCardId === rfidInput.trim());

        if (!student) {
            setScanMessage({ type: 'error', text: 'Invalid RFID Card ID. Student not found.' });
            return;
        }

        const lastStatus = lastScanStatus.get(student.id);
        const newStatus = lastStatus === 'Check-in' ? 'Check-out' : 'Check-in';
        
        const newLog: RfidLog = {
            id: Date.now(),
            studentId: student.id,
            timestamp: new Date().toISOString(),
            status: newStatus
        };
        
        setRfidLogs(prev => [newLog, ...prev]);
        setLastScanStatus(prev => new Map(prev).set(student.id, newStatus));
        setRfidInput('');
        setScanMessage({ type: 'success', text: `${student.name} has been successfully ${newStatus === 'Check-in' ? 'checked in' : 'checked out'}.` });
    };

    const TabButton: React.FC<{label: AttendanceTab, icon: React.ReactNode}> = ({label, icon}) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`flex items-center justify-center w-full px-4 py-3 font-semibold rounded-lg transition-all duration-200 ${
                activeTab === label ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 bg-gray-100 hover:bg-gray-200'
            }`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Student Attendance</h1>
            
            <div className="grid grid-cols-2 gap-4 mb-6 max-w-lg">
                <TabButton label="Manual Entry" icon={<AttendanceIcon className="w-6 h-6"/>} />
                <TabButton label="RFID Log" icon={<RfidIcon className="w-6 h-6"/>} />
            </div>

            {activeTab === 'Manual Entry' && (
                <div>
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
                                disabled={!selectedClass}
                                className="mt-1 block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md disabled:bg-gray-100"
                            >
                                {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="date-select" className="block text-sm font-medium text-gray-700">Select Date</label>
                            <input 
                                type="date" 
                                id="date-select"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="mt-1 block w-full pl-3 pr-3 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            />
                        </div>
                        <button className="self-end bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                            Save Attendance
                        </button>
                    </div>
                    
                    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Roll No.</th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                                        <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {studentsInClass.map(student => (
                                        <tr key={student.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{student.roll}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10">
                                                        <img className="h-10 w-10 rounded-full" src={student.profilePic} alt={student.name} />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{student.name}</div>
                                                        <div className="text-sm text-gray-500 font-nepali">{student.nepaliName}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex justify-center space-x-2">
                                                    <button onClick={() => handleStatusChange(student.id, 'present')} className={`px-3 py-1 text-sm rounded-full ${attendance[student.id] === 'present' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-800'}`}>Present</button>
                                                    <button onClick={() => handleStatusChange(student.id, 'absent')} className={`px-3 py-1 text-sm rounded-full ${attendance[student.id] === 'absent' ? 'bg-red-500 text-white' : 'bg-red-100 text-red-800'}`}>Absent</button>
                                                    <button onClick={() => handleStatusChange(student.id, 'late')} className={`px-3 py-1 text-sm rounded-full ${attendance[student.id] === 'late' ? 'bg-yellow-500 text-white' : 'bg-yellow-100 text-yellow-800'}`}>Late</button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {studentsInClass.length === 0 && (
                                <div className="text-center p-8 text-gray-500">
                                No students found for this class in academic year {selectedAcademicYear}.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
            
            {activeTab === 'RFID Log' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">RFID Scanner Terminal</h2>
                            <form onSubmit={handleRfidScan} className="space-y-4">
                                <div>
                                    <label htmlFor="rfid-input" className="block text-sm font-medium text-gray-700">Enter RFID Card ID</label>
                                    <input 
                                        type="text"
                                        id="rfid-input"
                                        value={rfidInput}
                                        onChange={(e) => { setRfidInput(e.target.value); setScanMessage(null); }}
                                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                        placeholder="e.g., RFID001"
                                        autoFocus
                                    />
                                </div>
                                <button type="submit" className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">
                                    Scan
                                </button>
                                {scanMessage && (
                                    <div className={`text-sm p-3 rounded-md ${scanMessage.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {scanMessage.text}
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>
                    <div className="lg:col-span-2">
                         <div className="bg-white p-6 rounded-xl shadow-lg">
                            <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's RFID Log</h2>
                            <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                                {rfidLogs.map(log => {
                                    const student = studentsMap.get(log.studentId);
                                    if (!student) return null;
                                    return (
                                        <div key={log.id} className="flex items-center p-3 bg-gray-50 rounded-lg">
                                            <img src={student.profilePic} alt={student.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800">{student.name}</p>
                                                <p className="text-sm text-gray-500">Class {student.className} {student.section}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-sm font-semibold text-gray-800">{new Date(log.timestamp).toLocaleTimeString()}</p>
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                    log.status === 'Check-in' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                    {log.status}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Attendance;
