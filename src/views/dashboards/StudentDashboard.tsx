import React, { useEffect, useRef, useMemo, useState } from 'react';
import type { User, Event, Bus, FeeInvoice, Student, Teacher, ClassRoutine, Period, Homework, Result } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { ResultsIcon, EventsIcon, AttendanceIcon, HomeworkIcon, WhatsAppIcon, RoutineIcon, ChartBarIcon, BusIcon, FinancialsIcon } from '../../components/icons';
import RoutineDisplay from '../../components/RoutineDisplay';
import LiveBusMap from '../../components/LiveBusMap';
import PaymentModal from '../../components/PaymentModal';

declare var Chart: any;

interface StudentDashboardProps {
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

const StudentDashboard: React.FC<StudentDashboardProps> = ({ user, selectedAcademicYear, invoices, setInvoices }) => {
    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [routines, setRoutines] = useState<ClassRoutine[]>([]);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const [buses, setBuses] = useState<Bus[]>([]);
    const performanceChartRef = useRef<HTMLCanvasElement>(null);

    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

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

    const studentDetails = students.find(s => s.id === user.referenceId);

    const [busDetails, setBusDetails] = useState<Bus | undefined>(undefined);

    useEffect(() => {
        if (studentDetails?.busId) {
            const bus = buses.find(b => b.id === studentDetails.busId);
            if (bus) {
                if (!isSchoolCommuteTime()) {
                    setBusDetails({ ...bus, currentPosition: { ...bus.currentPosition, x: 100 } });
                } else {
                    setBusDetails(bus);
                }
            }
        }
    }, [studentDetails?.busId, buses]);

    useEffect(() => {
        if (!studentDetails?.busId) return;

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
        }, 2500);

        return () => clearInterval(interval);
    }, [studentDetails?.busId]);

    const latestResult = useMemo(() => results
        .filter(r => r.studentId === studentDetails?.id && r.academicYear === selectedAcademicYear)
        .sort((a, b) => a.id - b.id)
        .pop(), [results, studentDetails, selectedAcademicYear]);
        
    const eventsThisYear = useMemo(() => events.filter(e => e.academicYear === selectedAcademicYear), [events, selectedAcademicYear]);

    const dueInvoices = useMemo(() => invoices.filter(i => 
        i.studentId === studentDetails?.id && 
        i.status !== 'Paid' && 
        i.academicYear === selectedAcademicYear
    ), [invoices, studentDetails, selectedAcademicYear]);

    const totalDue = useMemo(() => dueInvoices.reduce((sum, inv) => sum + inv.amount, 0), [dueInvoices]);

    const handlePaymentSuccess = (paidInvoiceIds: number[]) => {
        setInvoices(prevInvoices => 
            prevInvoices.map(inv => 
                paidInvoiceIds.includes(inv.id) ? { ...inv, status: 'Paid' } : inv
            )
        );
    };

    useEffect(() => {
        let performanceChart: any;
        if (performanceChartRef.current && latestResult) {
            const ctx = performanceChartRef.current.getContext('2d');
            performanceChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: latestResult.marks.map(m => m.subject),
                    datasets: [{
                        label: 'Percentage Score',
                        data: latestResult.marks.map(m => (m.marksObtained / m.fullMarks) * 100),
                        fill: true,
                        backgroundColor: 'rgba(59, 130, 246, 0.2)',
                        borderColor: 'rgb(59, 130, 246)',
                        pointBackgroundColor: 'rgb(59, 130, 246)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgb(59, 130, 246)'
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        r: {
                            angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
                            grid: { color: 'rgba(0, 0, 0, 0.1)' },
                            pointLabels: { font: { size: 12 } },
                            ticks: {
                                backdropColor: 'rgba(255, 255, 255, 0.75)',
                                color: '#666'
                            },
                            beginAtZero: true,
                            max: 100
                        }
                    },
                    plugins: {
                        legend: { display: false }
                    }
                }
            });
        }
        return () => {
            performanceChart?.destroy();
        };
    }, [latestResult]);

    if (!studentDetails) {
        return <div className="text-red-500">Error: Student details not found.</div>;
    }
    
    const homeworksForStudent = homeworks
        .filter(hw => hw.className === studentDetails.className && hw.section === studentDetails.section && hw.academicYear === selectedAcademicYear)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

    const studentRoutine = routines.find(r => r.className === studentDetails.className && r.section === studentDetails.section && r.academicYear === selectedAcademicYear);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {studentDetails.name}!</h1>
            <p className="text-gray-600 mb-6">Your personal dashboard.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                 <DashboardCard 
                    title="Last Exam Grade" 
                    value={latestResult?.grade || 'N/A'} 
                    icon={<ResultsIcon className="w-8 h-8 text-white" />} 
                    color="bg-green-500"
                />
                 <DashboardCard 
                    title="Attendance" 
                    value="95%"
                    icon={<AttendanceIcon className="w-8 h-8 text-white" />} 
                    color="bg-blue-500"
                />
                <DashboardCard 
                    title="Upcoming Calendar Events" 
                    value={eventsThisYear.length} 
                    icon={<EventsIcon className="w-8 h-8 text-white" />} 
                    color="bg-purple-500"
                />
            </div>
            
             {busDetails && (
                 <div className="mb-8 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 flex items-center mb-4">
                        <BusIcon className="w-6 h-6 mr-2 text-gray-600" />
                        {isSchoolCommuteTime() ? 'Live Bus Tracking' : 'Bus Information'}
                    </h2>
                    <LiveBusMap bus={busDetails} />
                    <div className="text-center mt-2 text-sm text-gray-600">
                         {!isSchoolCommuteTime() && (
                            <p className="mb-2 p-2 bg-blue-50 text-blue-700 rounded-md">
                                The bus is currently not on its route. Live tracking is active during school commute hours (7-9 AM & 3-5 PM).
                            </p>
                        )}
                        <p>Driver: <span className="font-semibold">{busDetails.driverName}</span> | Contact: <span className="font-semibold">{busDetails.driverContact}</span></p>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <RoutineIcon className="w-6 h-6 mr-3 text-indigo-500" />
                        Class Routine
                    </h2>
                    <RoutineDisplay routine={studentRoutine} teachers={teachers} periods={periods} />
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <HomeworkIcon className="w-6 h-6 mr-3 text-blue-500" />
                        Homework & Assignments
                    </h2>
                    {homeworksForStudent.length > 0 ? (
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {homeworksForStudent.map(hw => {
                                const teacher = teachers.find(t => t.id === hw.assignedByTeacherId);
                                return (
                                    <div key={hw.id} className="p-4 border rounded-lg bg-gray-50 shadow-sm">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <span className="text-xs font-semibold text-blue-800 bg-blue-100 px-2 py-1 rounded-full">{hw.subject}</span>
                                                <h3 className="font-semibold text-gray-800 mt-2">{hw.title}</h3>
                                                <p className="text-xs text-gray-500 mt-1">by {teacher?.name || 'Unknown'}</p>
                                            </div>
                                            <div className="text-right text-sm flex-shrink-0 ml-4">
                                                <p className="font-semibold text-red-600">Due: {hw.dueDate}</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-600 my-3">{hw.description}</p>

                                        {hw.imageUrl && (
                                            <div className="mt-3">
                                                <p className="text-xs font-medium text-gray-500 mb-1">Attachment:</p>
                                                <a href={hw.imageUrl} target="_blank" rel="noopener noreferrer">
                                                    <img src={hw.imageUrl} alt="Homework attachment" className="rounded-lg max-h-40 cursor-pointer hover:opacity-80 transition-opacity border" />
                                                </a>
                                            </div>
                                        )}
                                        
                                        {teacher && (
                                            <div className="flex justify-end mt-2">
                                                <button
                                                    onClick={() => {
                                                        const phoneNumber = teacher.contact.replace(/[^0-9]/g, '');
                                                        const whatsappUrl = `https://wa.me/${phoneNumber}`;
                                                        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                                                    }}
                                                    className="flex items-center text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full hover:bg-green-200 transition-colors"
                                                >
                                                    <WhatsAppIcon className="w-4 h-4 mr-2" />
                                                    Chat with Teacher
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-gray-500">No homework assigned at the moment.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                       <ChartBarIcon className="w-6 h-6 mr-2 text-blue-500" />
                       Performance Analysis ({latestResult?.examType || 'Latest Exam'})
                    </h2>
                    {latestResult ? (
                        <div className="max-h-80 mx-auto flex justify-center">
                            <canvas ref={performanceChartRef}></canvas>
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-10">No result data available to show analysis.</p>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                     <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                       <FinancialsIcon className="w-6 h-6 mr-2 text-red-500" />
                       Financials
                    </h2>
                    {totalDue > 0 ? (
                        <div className="text-center">
                            <p className="text-gray-600">You have outstanding dues of</p>
                            <p className="text-4xl font-bold text-red-600 my-2">NPR {totalDue.toLocaleString()}</p>
                            <button 
                                onClick={() => setIsPaymentModalOpen(true)}
                                className="mt-4 w-full bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Pay Now
                            </button>
                        </div>
                    ) : (
                         <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                               <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <p className="font-semibold text-gray-800">All fees are cleared!</p>
                            <p className="text-sm text-gray-500">Thank you for being up to date.</p>
                        </div>
                    )}
                </div>
                
                 <div className="bg-white p-6 rounded-xl shadow-lg lg:col-span-2">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Academic Calendar</h2>
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

            {isPaymentModalOpen && (
                <PaymentModal
                    isOpen={isPaymentModalOpen}
                    onClose={() => setIsPaymentModalOpen(false)}
                    onPaymentSuccess={handlePaymentSuccess}
                    student={studentDetails}
                    dueInvoices={dueInvoices}
                    totalDue={totalDue}
                />
            )}
        </div>
    );
};

export default StudentDashboard;
