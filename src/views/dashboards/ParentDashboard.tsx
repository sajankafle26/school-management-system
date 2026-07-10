import React, { useState, useEffect, useMemo } from 'react';
import type { User, Student, Bus, FeeInvoice, Teacher, ClassRoutine, Period, Homework, Event, Result } from '../../types';
import { ResultsIcon, FinancialsIcon, AttendanceIcon, AlertTriangleIcon, WhatsAppIcon, HomeworkIcon, EventsIcon, RoutineIcon, BusIcon } from '../../components/icons';
import RoutineDisplay from '../../components/RoutineDisplay';
import LiveBusMap from '../../components/LiveBusMap';
import PaymentModal from '../../components/PaymentModal';

interface ParentDashboardProps {
    user: User;
    selectedAcademicYear: string;
    invoices: FeeInvoice[];
    setInvoices: React.Dispatch<React.SetStateAction<FeeInvoice[]>>;
}

const isSchoolCommuteTime = () => {
    const now = new Date();
    const hours = now.getHours();
    return (hours >= 7 && hours < 9) || (hours >= 15 && hours < 17);
};

const ParentDashboard: React.FC<ParentDashboardProps> = ({ user, selectedAcademicYear, invoices, setInvoices }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [routines, setRoutines] = useState<ClassRoutine[]>([]);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);

    useEffect(() => {
        fetch('/api/students').then(res => res.json()).then(setStudents).catch(console.error);
        fetch('/api/teachers').then(res => res.json()).then(setTeachers).catch(console.error);
        fetch('/api/routines').then(res => res.json()).then(setRoutines).catch(console.error);
        fetch('/api/periods').then(res => res.json()).then(setPeriods).catch(console.error);
        fetch('/api/buses').then(res => res.json()).then(setBuses).catch(console.error);
        fetch(`/api/results?academicYear=${selectedAcademicYear}`).then(res => res.json()).then(setResults).catch(console.error);
        fetch(`/api/events?academicYear=${selectedAcademicYear}`).then(res => res.json()).then(setEvents).catch(console.error);
        fetch(`/api/homework?academicYear=${selectedAcademicYear}`).then(res => res.json()).then(setHomeworks).catch(console.error);
    }, [selectedAcademicYear]);

    const myChildren = students.filter(s => s.parentId === user.referenceId && s.academicYear === selectedAcademicYear);

    if (myChildren.length === 0) {
        return <div className="bg-white p-6 rounded-xl shadow-lg text-center text-gray-600">No children found linked to this account for the academic year {selectedAcademicYear}.</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {user.name}!</h1>
            <p className="text-gray-600 mb-6">Here is an overview of your child/children for the {selectedAcademicYear} academic year.</p>
            
            <div className="space-y-8">
                {myChildren.map(child => <ChildOverview key={child.id} student={child} selectedAcademicYear={selectedAcademicYear} invoices={invoices} setInvoices={setInvoices} teachers={teachers} routines={routines} periods={periods} results={results} events={events} homeworks={homeworks} buses={buses} />)}
            </div>
        </div>
    );
};

const ChildOverview: React.FC<{student: Student, selectedAcademicYear: string, invoices: FeeInvoice[], setInvoices: React.Dispatch<React.SetStateAction<FeeInvoice[]>>, teachers: Teacher[], routines: ClassRoutine[], periods: Period[], results: Result[], events: Event[], homeworks: Homework[], buses: Bus[]}> = ({ student, selectedAcademicYear, invoices, setInvoices, teachers, routines, periods, results, events, homeworks, buses }) => {
    const [busDetails, setBusDetails] = useState<Bus | undefined>(undefined);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    
    useEffect(() => {
        if (student.busId) {
            const bus = buses.find(b => b.id === student.busId);
            if (bus) {
                if (!isSchoolCommuteTime()) {
                    setBusDetails({ ...bus, currentPosition: { ...bus.currentPosition, x: 100 } });
                } else {
                    setBusDetails(bus);
                }
            }
        }
    }, [student.busId, buses]);

    useEffect(() => {
        if (!student.busId) return;

        const interval = setInterval(() => {
            if (isSchoolCommuteTime()) {
                 setBusDetails(prevBus => {
                    if (!prevBus) return undefined;
                    let newX = prevBus.currentPosition.x + (Math.random() * 4);
                    if (newX > 100) newX = 0;
                    return { ...prevBus, currentPosition: { ...prevBus.currentPosition, x: newX } };
                });
            } else {
                 setBusDetails(prevBus => {
                    if (prevBus && prevBus.currentPosition.x !== 100) {
                         return { ...prevBus, currentPosition: { ...prevBus.currentPosition, x: 100 } };
                    }
                    return prevBus;
                });
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [student.busId]);
    
    const latestResult = results
        .filter(r => r.studentId === student.id && r.academicYear === selectedAcademicYear)
        .sort((a,b) => b.id - a.id)
        .shift();

    const dueInvoices = invoices.filter(i => i.studentId === student.id && i.status !== 'Paid' && i.academicYear === selectedAcademicYear);
    const totalDue = dueInvoices.reduce((sum, inv) => sum + inv.amount, 0);

    const handlePaymentSuccess = (paidInvoiceIds: number[]) => {
        setInvoices(prevInvoices => 
            prevInvoices.map(inv => 
                paidInvoiceIds.includes(inv.id) ? { ...inv, status: 'Paid' } : inv
            )
        );
    };

    const classTeacher = teachers.find(t => t.classTeacherOf === `${student.className} ${student.section}`);
    
    const homeworksForChild = homeworks
        .filter(hw => hw.className === student.className && hw.section === student.section && hw.academicYear === selectedAcademicYear)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const studentRoutine = routines.find(r => r.className === student.className && r.section === student.section && r.academicYear === selectedAcademicYear);
    
    const eventsThisYear = events.filter(e => e.academicYear === selectedAcademicYear);

     const getStatusPill = (status: 'Paid' | 'Unpaid' | 'Overdue' | 'Partial') => {
        switch (status) {
            case 'Paid': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Paid</span>;
            case 'Unpaid': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Unpaid</span>;
            case 'Overdue': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Overdue</span>;
            case 'Partial': return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Partial</span>;
            default: return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">{status}</span>;
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
                <div className="flex items-center mb-4 sm:mb-0">
                    <img src={student.profilePic} alt={student.name} className="w-16 h-16 rounded-full object-cover mr-4" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">{student.name}</h2>
                        <p className="text-gray-500">Class {student.className} {student.section} - Roll {student.roll}</p>
                    </div>
                </div>
                {classTeacher && (
                     <button
                        onClick={() => {
                            const phoneNumber = classTeacher.contact.replace(/[^0-9]/g, '');
                            const whatsappUrl = `https://wa.me/${phoneNumber}`;
                            window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                        }}
                        className="flex items-center justify-center w-full sm:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                        <WhatsAppIcon className="w-5 h-5 mr-2" />
                        Chat with Class Teacher
                    </button>
                )}
            </div>

            {busDetails && (
                 <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 flex items-center mb-3 text-lg">
                        <BusIcon className="w-6 h-6 mr-2 text-gray-600" />
                        {isSchoolCommuteTime() ? 'Live Bus Tracking' : 'Bus Information'}
                    </h3>
                    <LiveBusMap bus={busDetails} />
                     <div className="text-center mt-2 text-sm text-gray-600">
                         {!isSchoolCommuteTime() && (
                            <p className="mb-2 p-2 bg-blue-50 text-blue-700 rounded-md">
                                Live tracking is active during school commute hours (7-9 AM & 3-5 PM).
                            </p>
                        )}
                        <p>Driver: <span className="font-semibold">{busDetails.driverName}</span> | Contact: <span className="font-semibold">{busDetails.driverContact}</span></p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 flex items-center mb-2"><ResultsIcon className="w-5 h-5 mr-2 text-green-500" /> Academics</h3>
                    {latestResult ? (
                        <>
                           <p className="text-sm text-gray-600">Latest Result ({latestResult.examType}):</p>
                           <p className="text-2xl font-bold text-gray-800">{latestResult.grade}</p>
                           <p className="text-sm text-gray-500">{latestResult.percentage.toFixed(2)}%</p>
                        </>
                    ) : <p className="text-sm text-gray-500">No results found.</p>}
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 flex items-center mb-2"><FinancialsIcon className="w-5 h-5 mr-2 text-red-500" /> Financials</h3>
                    {totalDue > 0 ? (
                        <>
                           <p className="text-sm text-gray-600">Outstanding Dues:</p>
                           <p className="text-2xl font-bold text-gray-800">NPR {totalDue.toLocaleString()}</p>
                           <div className="text-xs space-x-1 my-1">
                            {dueInvoices.map(inv => getStatusPill(inv.status))}
                           </div>
                           <button 
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="mt-2 w-full bg-red-500 text-white font-bold py-2 rounded-lg hover:bg-red-600 transition-colors text-sm"
                            >
                                Pay Now
                            </button>
                        </>
                    ) : <p className="text-sm text-gray-500">All fees cleared.</p>}
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 flex items-center mb-2"><AttendanceIcon className="w-5 h-5 mr-2 text-blue-500" /> Attendance</h3>
                     <p className="text-sm text-gray-600">This Month (Mock Data):</p>
                     <p className="text-2xl font-bold text-gray-800">95%</p>
                     <p className="text-sm text-gray-500">2 days absent</p>
                </div>
                 <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 flex items-center mb-3"><RoutineIcon className="w-5 h-5 mr-2 text-indigo-500" /> Class Routine</h3>
                    <div className="max-h-96 overflow-y-auto">
                        <RoutineDisplay routine={studentRoutine} teachers={teachers} periods={periods} />
                    </div>
                </div>
                <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 flex items-center mb-3"><HomeworkIcon className="w-5 h-5 mr-2 text-blue-500" /> Homework & Assignments</h3>
                    {homeworksForChild.length > 0 ? (
                        <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {homeworksForChild.map(hw => {
                            const teacher = teachers.find(t => t.id === hw.assignedByTeacherId);
                            return (
                                <div key={hw.id} className="p-3 border-l-4 border-blue-400 bg-white rounded-r-md shadow-sm">
                                    <div className="flex justify-between items-start text-sm">
                                        <div>
                                            <p className="font-semibold text-gray-800">{hw.title} <span className="text-xs font-normal text-gray-500">({hw.subject})</span></p>
                                            <p className="text-xs text-gray-500">Assigned by: {teacher?.name || 'Unknown'}</p>
                                        </div>
                                        <p className="font-semibold text-red-600 whitespace-nowrap pl-2">Due: {hw.dueDate}</p>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1 pl-1">{hw.description}</p>
                                    {hw.imageUrl && (
                                        <div className="mt-2 pl-1">
                                            <a href={hw.imageUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue-600 hover:underline flex items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                                View Attached Image
                                            </a>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                        </div>
                    ) : (
                        <p className="text-sm text-gray-500">No current homework for {student.name}.</p>
                    )}
                </div>
                <div className="md:col-span-3 bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 flex items-center mb-3"><EventsIcon className="w-5 h-5 mr-2 text-purple-500" /> Academic Calendar</h3>
                    {eventsThisYear.length > 0 ? (
                        <ul className="space-y-3 max-h-48 overflow-y-auto pr-2">
                        {eventsThisYear.slice(0, 4).map((event) => (
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
                    ) : (
                        <p className="text-sm text-gray-500">No upcoming events found.</p>
                    )}
                </div>
            </div>
             {isPaymentModalOpen && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentSuccess={handlePaymentSuccess}
                    student={student}
                    dueInvoices={dueInvoices}
                    totalDue={totalDue}
                />
            )}
        </div>
    );
}

export default ParentDashboard;
