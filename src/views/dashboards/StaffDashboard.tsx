import React, { useState, useEffect } from 'react';
import type { User, Notice, Event, Staff } from '../../types';
import { NoticesIcon, EventsIcon } from '../../components/icons';

interface StaffDashboardProps {
    user: User;
    selectedAcademicYear: string;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, selectedAcademicYear }) => {
    const [staff, setStaff] = useState<Staff[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [events, setEvents] = useState<Event[]>([]);

    useEffect(() => {
        fetch('/api/staff').then(res => res.json()).then(setStaff).catch(console.error);
        fetch('/api/notices').then(res => res.json()).then(setNotices).catch(console.error);
        fetch('/api/events').then(res => res.json()).then(setEvents).catch(console.error);
    }, []);

    const staffDetails = staff.find(s => s.id === user.referenceId);
    
    const noticesThisYear = notices.filter(n => n.academicYear === selectedAcademicYear);
    const eventsThisYear = events.filter(e => e.academicYear === selectedAcademicYear);

    if (!staffDetails) {
        return <div className="text-red-500">Error: Staff details not found.</div>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {staffDetails.name}!</h1>
            <p className="text-gray-600 mb-6">Your staff dashboard. Job Title: <span className="font-semibold">{staffDetails.jobTitle}</span></p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <NoticesIcon className="w-6 h-6 mr-3 text-yellow-500" />
                        Recent School Notices
                    </h2>
                    <div className="space-y-4">
                        {noticesThisYear.slice(0, 4).map((notice: Notice) => (
                            <div key={notice.id} className="p-4 border-l-4 border-yellow-500 bg-yellow-50 rounded-r-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                                    <span className="text-xs text-gray-500">{notice.date}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1 truncate">{notice.content}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <EventsIcon className="w-6 h-6 mr-3 text-purple-500" />
                        Upcoming Calendar Events
                    </h2>
                    <ul className="space-y-3">
                        {eventsThisYear.slice(0, 4).map((event: Event) => (
                            <li key={event.id} className="flex items-start space-x-4 p-2">
                                <div className={`flex-shrink-0 w-16 text-center ${event.type === 'Exam' ? 'bg-indigo-100' : event.type === 'Holiday' ? 'bg-red-100' : 'bg-purple-100'} p-2 rounded-lg`}>
                                    <p className={`font-bold text-lg ${event.type === 'Exam' ? 'text-indigo-700' : event.type === 'Holiday' ? 'text-red-700' : 'text-purple-700'}`}>{new Date(event.date).getDate()}</p>
                                    <p className={`text-xs uppercase ${event.type === 'Exam' ? 'text-indigo-600' : event.type === 'Holiday' ? 'text-red-600' : 'text-purple-600'}`}>{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                                    <p className="text-sm text-gray-500">{event.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StaffDashboard;
