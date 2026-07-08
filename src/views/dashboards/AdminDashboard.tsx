import React, { useEffect, useRef, useMemo, useState } from 'react';
import DashboardCard from '../../components/DashboardCard';
import { StudentsIcon, TeachersIcon, NoticesIcon, EventsIcon, AcademicsIcon, FinancialsIcon, AttendanceIcon, SparklesIcon, ResultsIcon, ChartBarIcon } from '../../components/icons';
import type { Notice, Event, FeeInvoice, Student, Teacher, Transaction, LedgerAccount } from '../../types';

declare var Chart: any;

interface AdminDashboardProps {
    selectedAcademicYear: string;
    invoices: FeeInvoice[];
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, color: string }> = ({ icon, title, description, color }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full">
            <div className="flex items-center mb-3">
                <div className={`p-3 rounded-full mr-4 ${color}`}>
                    {icon}
                </div>
                <h3 className="text-lg font-bold text-gray-800">{title}</h3>
            </div>
            <p className="text-sm text-gray-600">
                {description}
            </p>
        </div>
    );
};

const keyFeatures = [
    { title: "Student Lifecycle Management", description: "Complete student lifecycle with digital records, academic tracking, and performance analytics.", icon: <StudentsIcon className="w-6 h-6 text-blue-600" />, color: 'bg-blue-100' },
    { title: "Curriculum & Progress", description: "Streamlined curriculum planning, subject management, and continuous academic progress monitoring.", icon: <AcademicsIcon className="w-6 h-6 text-green-600" />, color: 'bg-green-100' },
    { title: "Automated Fee Collection", description: "Hassle-free, automated fee collection with comprehensive financial reporting and parent notifications.", icon: <FinancialsIcon className="w-6 h-6 text-red-600" />, color: 'bg-red-100' },
    { title: "Smart Attendance Tracking", description: "Smart, real-time attendance tracking with automated alerts for parents on student absence.", icon: <AttendanceIcon className="w-6 h-6 text-yellow-600" />, color: 'bg-yellow-100' },
    { title: "AI-Powered Scheduling", description: "Intelligent routine generation with resource optimization and conflict resolution.", icon: <SparklesIcon className="w-6 h-6 text-purple-600" />, color: 'bg-purple-100' },
    { title: "Complete Examination System", description: "A full examination lifecycle, from test creation and scheduling to automated result publication.", icon: <ResultsIcon className="w-6 h-6 text-indigo-600" />, color: 'bg-indigo-100' },
];

const AdminDashboard: React.FC<AdminDashboardProps> = ({ selectedAcademicYear, invoices }) => {
    const enrollmentChartRef = useRef<HTMLCanvasElement>(null);
    const financialChartRef = useRef<HTMLCanvasElement>(null);

    const [students, setStudents] = useState<Student[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [notices, setNotices] = useState<Notice[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [ledgerAccounts, setLedgerAccounts] = useState<LedgerAccount[]>([]);

    useEffect(() => {
        fetch('/api/students').then(res => res.json()).then(setStudents).catch(console.error);
        fetch('/api/teachers').then(res => res.json()).then(setTeachers).catch(console.error);
        fetch('/api/notices').then(res => res.json()).then(setNotices).catch(console.error);
        fetch('/api/events').then(res => res.json()).then(setEvents).catch(console.error);
        fetch('/api/transactions').then(res => res.json()).then(setTransactions).catch(console.error);
        fetch('/api/ledger-accounts').then(res => res.json()).then(setLedgerAccounts).catch(console.error);
    }, []);

    const studentsThisYear = useMemo(() => students.filter(s => s.academicYear === selectedAcademicYear), [students, selectedAcademicYear]);
    const noticesThisYear = useMemo(() => notices.filter(n => n.academicYear === selectedAcademicYear), [notices, selectedAcademicYear]);
    const eventsThisYear = useMemo(() => events.filter(e => e.academicYear === selectedAcademicYear), [events, selectedAcademicYear]);
    const invoicesThisYear = useMemo(() => invoices.filter(i => i.academicYear === selectedAcademicYear), [invoices, selectedAcademicYear]);
    const transactionsThisYear = useMemo(() => transactions.filter(t => t.academicYear === selectedAcademicYear), [transactions, selectedAcademicYear]);

    useEffect(() => {
        let enrollmentChart: any;
        let financialChart: any;

        if (enrollmentChartRef.current) {
            const ctx = enrollmentChartRef.current.getContext('2d');
            const classCounts = studentsThisYear.reduce((acc, student) => {
                acc[student.className] = (acc[student.className] || 0) + 1;
                return acc;
            }, {} as Record<string, number>);

            const sortedClasses = Object.keys(classCounts).sort((a, b) => Number(a) - Number(b));
            
            enrollmentChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: sortedClasses.map(c => `Class ${c}`),
                    datasets: [{
                        label: 'Number of Students',
                        data: sortedClasses.map(c => classCounts[c]),
                        backgroundColor: 'rgba(59, 130, 246, 0.5)',
                        borderColor: 'rgba(59, 130, 246, 1)',
                        borderWidth: 1
                    }]
                },
                options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
            });
        }

        if (financialChartRef.current) {
            const ctx = financialChartRef.current.getContext('2d');
            const totalIncome = invoicesThisYear.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
            const accountsMap = new Map(ledgerAccounts.map(a => [a.id, a]));
            const totalExpenses = transactionsThisYear
                .filter(t => accountsMap.get(t.debitAccountId)?.type === 'Expense')
                .reduce((sum, t) => sum + t.amount, 0);

            financialChart = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Total Income', 'Total Expenses'],
                    datasets: [{
                        label: 'Amount (NPR)',
                        data: [totalIncome, totalExpenses],
                        backgroundColor: ['rgba(16, 185, 129, 0.7)', 'rgba(239, 68, 68, 0.7)'],
                        borderColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
                    }]
                },
                options: { responsive: true, plugins: { legend: { position: 'top' } } }
            });
        }

        return () => {
            enrollmentChart?.destroy();
            financialChart?.destroy();
        };
    }, [studentsThisYear, invoicesThisYear, transactionsThisYear, ledgerAccounts]);

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Admin Dashboard</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <DashboardCard title="Total Students" value={studentsThisYear.length} icon={<StudentsIcon className="w-8 h-8 text-white" />} color="bg-blue-500" />
                <DashboardCard title="Total Teachers" value={teachers.length} icon={<TeachersIcon className="w-8 h-8 text-white" />} color="bg-green-500" />
                <DashboardCard title="Active Notices" value={noticesThisYear.length} icon={<NoticesIcon className="w-8 h-8 text-white" />} color="bg-yellow-500" />
                <DashboardCard title="Upcoming Calendar Events" value={eventsThisYear.length} icon={<EventsIcon className="w-8 h-8 text-white" />} color="bg-purple-500" />
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">School Analytics for {selectedAcademicYear}</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                            <ChartBarIcon className="w-6 h-6 mr-2 text-blue-500"/> Student Enrollment by Class
                        </h3>
                        <canvas ref={enrollmentChartRef}></canvas>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-lg">
                        <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                            <ChartBarIcon className="w-6 h-6 mr-2 text-green-500"/> Financial Summary
                        </h3>
                        <div className="max-h-64 mx-auto flex justify-center">
                           <canvas ref={financialChartRef}></canvas>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {keyFeatures.map(feature => <FeatureCard key={feature.title} {...feature} />)}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Notices</h2>
                    <div className="space-y-4">
                        {noticesThisYear.slice(0, 3).map((notice: Notice) => (
                            <div key={notice.id} className="p-4 border-l-4 border-blue-500 bg-blue-50 rounded-r-lg">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800">{notice.title}</h3>
                                    <span className="text-xs text-gray-500">{notice.date}</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">{notice.content.substring(0, 80)}...</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Upcoming Calendar Events</h2>
                    <ul className="space-y-3">
                        {eventsThisYear.slice(0, 4).map((event: Event) => (
                            <li key={event.id} className="flex items-start space-x-4 p-2">
                                <div className="flex-shrink-0 w-16 text-center bg-purple-100 p-2 rounded-lg">
                                    <p className="text-purple-700 font-bold text-lg">{new Date(event.date).getDate()}</p>
                                    <p className="text-purple-600 text-xs uppercase">{new Date(event.date).toLocaleString('default', { month: 'short' })}</p>
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

export default AdminDashboard;
