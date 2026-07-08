import React, { useState, useMemo, useEffect } from 'react';
import type { SentSms, Student, Parent, Teacher } from '../types';
import { SmsIcon } from '../components/icons';

interface SmsServicesProps {
    selectedAcademicYear: string;
}

const SmsServices: React.FC<SmsServicesProps> = ({ selectedAcademicYear }) => {
    const [sentMessages, setSentMessages] = useState<SentSms[]>([]);
    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [parents, setParents] = useState<Parent[]>([]);
    const [message, setMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    const [recipientType, setRecipientType] = useState<string>('');
    const [selectedClass, setSelectedClass] = useState<string>('');
    const [selectedSection, setSelectedSection] = useState<string>('');
    const [specificAudience, setSpecificAudience] = useState<'students' | 'parents'>('students');

    useEffect(() => {
        fetch('/api/sms')
            .then(res => res.json())
            .then(setSentMessages)
            .catch(console.error);
        fetch('/api/students')
            .then(res => res.json())
            .then(setStudents)
            .catch(console.error);
        fetch('/api/teachers')
            .then(res => res.json())
            .then(setTeachers)
            .catch(console.error);
        fetch('/api/parents')
            .then(res => res.json())
            .then(setParents)
            .catch(console.error);
    }, []);

    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);
    const parentsThisYear = useMemo(() => {
        const studentParentIds = new Set(studentsThisYear.map(s => s.parentId));
        return parents.filter(p => studentParentIds.has(p.id));
    }, [studentsThisYear, parents]);

    const availableClasses = useMemo(() => [...new Set(studentsThisYear.map(s => s.className))].sort((a, b) => Number(a) - Number(b)), [studentsThisYear]);
    const availableSections = useMemo(() => {
        if (!selectedClass) return [];
        return [...new Set(studentsThisYear.filter(s => s.className === selectedClass).map(s => s.section))].sort();
    }, [selectedClass, studentsThisYear]);

    useEffect(() => {
        setSelectedClass('');
    }, [recipientType, selectedAcademicYear]);

    useEffect(() => {
        setSelectedSection('');
        if (selectedClass && availableSections.length > 0) {
            setSelectedSection(availableSections[0]);
        }
    }, [selectedClass, availableSections]);

    const recipientCount = useMemo(() => {
        switch (recipientType) {
            case 'all_students':
                return studentsThisYear.length;
            case 'all_parents':
                return parentsThisYear.length;
            case 'all_teachers':
                return teachers.length;
            case 'specific_class':
                if (!selectedClass || !selectedSection) return 0;
                
                const filteredStudents = studentsThisYear.filter(s => s.className === selectedClass && s.section === selectedSection);
                
                if (specificAudience === 'students') {
                    return filteredStudents.length;
                } else {
                    const parentIds = new Set(filteredStudents.map(s => s.parentId));
                    return parentIds.size;
                }
            default:
                return 0;
        }
    }, [recipientType, selectedClass, selectedSection, specificAudience, studentsThisYear, parentsThisYear, teachers]);

    const handleSendSms = (e: React.FormEvent) => {
        e.preventDefault();
        if (!message || recipientCount === 0) {
            alert('Please select valid recipients and write a message.');
            return;
        }

        let recipientGroupLabel = '';
        switch (recipientType) {
            case 'all_students': recipientGroupLabel = 'All Students'; break;
            case 'all_parents': recipientGroupLabel = 'All Parents'; break;
            case 'all_teachers': recipientGroupLabel = 'All Teachers'; break;
            case 'specific_class': 
                recipientGroupLabel = `${specificAudience === 'students' ? 'Students' : 'Parents'} of Class ${selectedClass} ${selectedSection}`;
                break;
        }

        const newSms: SentSms = {
            id: Date.now(),
            recipientGroup: recipientGroupLabel,
            recipientCount: recipientCount,
            message,
            sentDate: new Date().toLocaleString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false }).replace(',', ''),
        };

        setSentMessages(prev => [newSms, ...prev]);
        setMessage('');
        setRecipientType('');
        setSelectedClass('');
        setSelectedSection('');
        setSpecificAudience('students');
        
        setSuccessMessage(`Message successfully sent to ${recipientCount} recipients in "${recipientGroupLabel}".`);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">SMS Notification Service</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <SmsIcon className="w-6 h-6 mr-3 text-blue-500"/>
                            Compose New Message
                        </h2>
                        <form onSubmit={handleSendSms} className="space-y-4">
                            <div>
                                <label htmlFor="recipientType" className="block text-sm font-medium text-gray-700">Recipient Group</label>
                                <select 
                                    id="recipientType" 
                                    value={recipientType} 
                                    onChange={e => setRecipientType(e.target.value)} 
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                >
                                    <option value="" disabled>-- Select Group --</option>
                                    <option value="all_students">All Students</option>
                                    <option value="all_parents">All Parents</option>
                                    <option value="all_teachers">All Teachers</option>
                                    <option value="specific_class">Specific Class/Section</option>
                                </select>
                            </div>

                            {recipientType === 'specific_class' && (
                                <div className="p-3 border rounded-md bg-gray-50 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="classSelect" className="block text-xs font-medium text-gray-600">Class</label>
                                            <select id="classSelect" value={selectedClass} onChange={e => setSelectedClass(e.target.value)} required className="mt-1 block w-full p-2 border-gray-300 rounded-md text-sm">
                                                <option value="" disabled>Select Class</option>
                                                {availableClasses.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="sectionSelect" className="block text-xs font-medium text-gray-600">Section</label>
                                            <select id="sectionSelect" value={selectedSection} onChange={e => setSelectedSection(e.target.value)} required disabled={!selectedClass || availableSections.length === 0} className="mt-1 block w-full p-2 border-gray-300 rounded-md text-sm disabled:bg-gray-200">
                                                <option value="" disabled>Select Section</option>
                                                {availableSections.map(s => <option key={s} value={s}>{s}</option>)}
                                            </select>
                                        </div>
                                    </div>
                                    
                                    {selectedClass && selectedSection && (
                                        <div>
                                            <label className="block text-xs font-medium text-gray-600 mb-2">Send to:</label>
                                            <div className="flex items-center space-x-4">
                                                <label className="flex items-center text-sm">
                                                    <input type="radio" name="audience" value="students" checked={specificAudience === 'students'} onChange={() => setSpecificAudience('students')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                                    <span className="ml-2 text-gray-700">Students</span>
                                                </label>
                                                <label className="flex items-center text-sm">
                                                    <input type="radio" name="audience" value="parents" checked={specificAudience === 'parents'} onChange={() => setSpecificAudience('parents')} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500" />
                                                    <span className="ml-2 text-gray-700">Parents</span>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    value={message}
                                    onChange={e => setMessage(e.target.value)}
                                    maxLength={160}
                                    required
                                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm"
                                    placeholder="Write your notification here..."
                                ></textarea>
                                <p className="text-xs text-right text-gray-500 mt-1">{message.length} / 160 characters</p>
                            </div>
                            <button 
                                type="submit" 
                                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                                disabled={recipientCount === 0 || !message}
                            >
                                Send Message to {recipientCount} Recipients
                            </button>
                             {successMessage && (
                                <div className="mt-4 p-3 bg-green-100 text-green-800 text-sm rounded-lg text-center">
                                    {successMessage}
                                </div>
                            )}
                        </form>
                    </div>
                </div>

                <div className="lg:col-span-3">
                     <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Sent Message History</h2>
                        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                            {sentMessages.map(sms => (
                                <div key={sms.id} className="p-4 border rounded-lg bg-gray-50">
                                    <div className="flex justify-between items-start text-sm mb-2">
                                        <div>
                                            <p className="font-semibold text-gray-800">{sms.recipientGroup}</p>
                                            <p className="text-xs text-gray-500">{sms.recipientCount} recipients</p>
                                        </div>
                                        <p className="text-xs text-gray-500">{sms.sentDate}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 bg-white p-2 rounded border">{sms.message}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SmsServices;
