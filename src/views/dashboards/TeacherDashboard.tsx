import React, { useEffect, useRef, useMemo, useState } from 'react';
import type { User, Teacher, ClassRoutine, Period, Homework, Result, RoutineEntry } from '../../types';
import DashboardCard from '../../components/DashboardCard';
import { StudentsIcon, HomeworkIcon, ResultsIcon, AttendanceIcon, RoutineIcon, ChartBarIcon, AcademicsIcon } from '../../components/icons';

declare var Chart: any;

interface TeacherDashboardProps {
    user: User;
    selectedAcademicYear: string;
}

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ user, selectedAcademicYear }) => {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [routines, setRoutines] = useState<ClassRoutine[]>([]);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [results, setResults] = useState<Result[]>([]);
    const [homeworks, setHomeworks] = useState<Homework[]>([]);
    const performanceChartRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        fetch('/api/teachers').then(res => res.json()).then(setTeachers).catch(console.error);
        fetch('/api/routines').then(res => res.json()).then(setRoutines).catch(console.error);
        fetch('/api/periods').then(res => res.json()).then(setPeriods).catch(console.error);
        fetch(`/api/results?academicYear=${selectedAcademicYear}`).then(res => res.json()).then(setResults).catch(console.error);
        fetch(`/api/homework?academicYear=${selectedAcademicYear}`).then(res => res.json()).then(setHomeworks).catch(console.error);
    }, [selectedAcademicYear]);

    const teacherDetails = teachers.find(t => t.id === user.referenceId);
    
    const teacherAssignments = useMemo(() => {
        if (!teacherDetails) return { assignments: [], uniqueSubjects: [] };
        
        const assignments = routines
            .filter(r => r.academicYear === selectedAcademicYear)
            .flatMap(classRoutine => 
                Object.values(classRoutine.routine).flat()
                    .filter(entry => entry.teacherId === teacherDetails.id)
                    .map(entry => ({
                        className: classRoutine.className,
                        section: classRoutine.section,
                        subject: entry.subject
                    }))
            );
        
        const uniqueAssignments = Array.from(new Map(assignments.map(a => [`${a.className}-${a.section}-${a.subject}`, a])).values());
        
        const uniqueSubjects = [...new Set(uniqueAssignments.map(a => a.subject))];

        return { assignments: uniqueAssignments, uniqueSubjects };
    }, [teacherDetails, routines, selectedAcademicYear]);


    useEffect(() => {
        let performanceChart: any;
        if (performanceChartRef.current && teacherDetails?.classTeacherOf) {
            const [className, section] = teacherDetails.classTeacherOf.split(' ');
            const classResults = results.filter(r => r.className === className && r.section === section && r.academicYear === selectedAcademicYear);
            
            const latestExamType = classResults.length > 0 
                ? classResults.sort((a, b) => b.id - a.id)[0].examType
                : null;

            if (latestExamType) {
                 const gradeCounts = classResults
                    .filter(r => r.examType === latestExamType)
                    .reduce((acc, result) => {
                        acc[result.grade] = (acc[result.grade] || 0) + 1;
                        return acc;
                    }, {} as Record<string, number>);

                const sortedGrades = Object.keys(gradeCounts).sort((a, b) => {
                    const order = ['A+', 'A', 'B+', 'B', 'C+', 'C', 'NG'];
                    return order.indexOf(a) - order.indexOf(b);
                });

                const ctx = performanceChartRef.current.getContext('2d');
                performanceChart = new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: sortedGrades,
                        datasets: [{
                            label: `Grade Distribution (${latestExamType})`,
                            data: sortedGrades.map(grade => gradeCounts[grade]),
                            backgroundColor: 'rgba(139, 92, 246, 0.5)',
                            borderColor: 'rgba(139, 92, 246, 1)',
                            borderWidth: 1,
                        }]
                    },
                    options: { responsive: true, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }, plugins: { legend: { display: true } } }
                });
            }
        }
        return () => {
            performanceChart?.destroy();
        }
    }, [teacherDetails, selectedAcademicYear, results]);

    if (!teacherDetails) {
        return <div className="text-red-500">Error: Teacher details not found.</div>;
    }
    
    const today = new Date();
    const dayName = daysOfWeek[today.getDay()];
    
    const todaysClasses = routines.filter(r => r.academicYear === selectedAcademicYear).flatMap(classRoutine => 
        (classRoutine.routine[dayName] || [])
            .filter(entry => entry.teacherId === teacherDetails.id)
            .map(entry => {
                const periodInfo = periods.find(p => p.period === entry.period);
                return {
                    ...entry,
                    time: periodInfo?.time || 'N/A',
                    className: classRoutine.className,
                    section: classRoutine.section
                };
            })
            .filter((value): value is NonNullable<typeof value> => value !== null) || []
    ).sort((a,b) => a.period - b.period);
    
    const assignedHomework = homeworks
        .filter(hw => hw.assignedByTeacherId === teacherDetails.id && hw.academicYear === selectedAcademicYear)
        .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
        .slice(0, 5);

    const quickActions = [
        { label: 'Manage Attendance', icon: <AttendanceIcon />, page: 'Attendance' },
        { label: 'Manage Homework', icon: <HomeworkIcon />, page: 'Homework' },
        { label: 'Manage Results', icon: <ResultsIcon />, page: 'Results' },
        { label: 'View Routines', icon: <RoutineIcon />, page: 'Routines' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {teacherDetails.name}!</h1>
            <p className="text-gray-600 mb-6">Here's your dashboard for today, {today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                 <DashboardCard 
                    title="Classes Today" 
                    value={todaysClasses.length} 
                    icon={<RoutineIcon className="w-8 h-8 text-white" />} 
                    color="bg-indigo-500"
                />
                 <DashboardCard 
                    title="Pending Homework" 
                    value={assignedHomework.length} 
                    icon={<HomeworkIcon className="w-8 h-8 text-white" />} 
                    color="bg-blue-500"
                />
                <DashboardCard 
                    title="Subjects Taught" 
                    value={teacherAssignments.uniqueSubjects.length} 
                    icon={<AcademicsIcon className="w-8 h-8 text-white" />} 
                    color="bg-purple-500"
                />
                 <DashboardCard 
                    title="Class Teacher Of" 
                    value={teacherDetails.classTeacherOf || 'N/A'} 
                    icon={<StudentsIcon className="w-8 h-8 text-white" />} 
                    color="bg-green-500"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Today's Schedule ({dayName})</h2>
                    {todaysClasses.length > 0 ? (
                        <div className="space-y-3">
                            {todaysClasses.map((entry, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded-lg border-l-4 border-indigo-500">
                                    <p className="font-bold text-gray-800">{entry.subject}</p>
                                    <p className="text-sm text-gray-600">Class {entry.className} {entry.section}</p>
                                    <p className="text-xs text-gray-500">{entry.time}</p>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You have no classes scheduled for today.</p>
                    )}
                </div>

                <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">My Classes & Subjects</h2>
                    {teacherAssignments.assignments.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {teacherAssignments.assignments.map((assignment, idx) => (
                                <div key={idx} className="p-3 bg-gray-50 rounded-lg flex justify-between items-center">
                                    <div>
                                        <p className="font-semibold text-gray-800">Class {assignment.className} {assignment.section}</p>
                                        <p className="text-sm text-gray-600">{assignment.subject}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500">You are not assigned to any classes for this academic year.</p>
                    )}
                </div>

                {teacherDetails.classTeacherOf ? (
                    <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <ChartBarIcon className="w-6 h-6 mr-3 text-purple-500" />
                            Class Performance: {teacherDetails.classTeacherOf}
                        </h2>
                        <canvas ref={performanceChartRef}></canvas>
                    </div>
                ) : (
                    <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <ChartBarIcon className="w-6 h-6 mr-3 text-purple-500" />
                            Class Performance
                        </h2>
                        <p className="text-gray-500 text-center py-10">Performance analytics are available for Class Teachers.</p>
                    </div>
                )}
                
                <div className="lg:col-span-3 bg-white p-6 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {quickActions.map(action => (
                            <button key={action.label} className="flex flex-col items-center justify-center p-4 bg-gray-50 hover:bg-blue-100 rounded-lg transition-colors">
                                <div className="p-3 bg-blue-200 text-blue-700 rounded-full mb-2">
                                    {React.cloneElement(action.icon, { className: 'w-6 h-6' })}
                                </div>
                                <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeacherDashboard;
