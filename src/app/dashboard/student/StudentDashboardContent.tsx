'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Student, Result, Homework, Notice, Event, FeeInvoice, AcademicYear, AttendanceRecord } from '@/types';

export default function StudentDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  
  const [myProfile, setMyProfile] = useState<Student | null>(null);
  const [myResults, setMyResults] = useState<Result[]>([]);
  const [myHomeworks, setMyHomeworks] = useState<Homework[]>([]);
  const [myAttendance, setMyAttendance] = useState<AttendanceRecord[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'overview');
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, [searchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          studentsRes, resultsRes, homeworksRes, attendanceRes,
          noticesRes, eventsRes, academicYearsRes
        ] = await Promise.all([
          fetch('/api/students').then(r => r.json()),
          fetch('/api/results').then(r => r.json()),
          fetch('/api/homework').then(r => r.json()).catch(() => []),
          fetch('/api/attendance').then(r => r.json()).catch(() => []),
          fetch('/api/notices').then(r => r.json()),
          fetch('/api/events').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);

        const currentYear = academicYears.find((y: AcademicYear) => y.isCurrent)?.year || academicYears[0]?.year || '2080/2081';
        
        if (Array.isArray(studentsRes) && user?.referenceId) {
          const profile = studentsRes.find((s: Student) => s.id === user.referenceId || String(s._id) === String(user.referenceId));
          setMyProfile(profile || null);
        }
        
        if (Array.isArray(resultsRes) && user?.referenceId) {
          const results = resultsRes.filter((r: Result) => 
            r.studentId === user.referenceId && r.academicYear === currentYear
          );
          setMyResults(results);
        }
        
        if (Array.isArray(homeworksRes)) {
          const hw = homeworksRes.filter((h: Homework) => 
            h.className === myProfile?.className && h.section === myProfile?.section
          );
          setMyHomeworks(hw);
        }
        
        if (Array.isArray(attendanceRes) && user?.referenceId) {
          const att = attendanceRes.filter((a: AttendanceRecord) => a.studentId === user.referenceId);
          setMyAttendance(att);
        }
        
        setNotices(Array.isArray(noticesRes) ? noticesRes : []);
        setEvents(Array.isArray(eventsRes) ? eventsRes : []);
        setAcademicYears(Array.isArray(academicYearsRes) ? academicYearsRes : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  if (loading) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;
  if (!user) return <div className="flex items-center justify-center h-[500px]">Please log in</div>;

  const profile = myProfile || { 
    name: user?.name || 'Student', 
    className: '10', 
    section: 'A', 
    roll: 1,
    attendance: { present: 78, absent: 7, total: 85 }
  };
  
  const attendance = profile.attendance || { present: 78, absent: 7, total: 85 };
  const totalMarks = myResults.reduce((sum, r) => sum + (r.marks?.[0]?.marksObtained || 0), 0);
  const totalFull = myResults.reduce((sum, r) => sum + (r.marks?.[0]?.fullMarks || 100), 0);
  const avgMarks = totalFull > 0 ? ((totalMarks / totalFull) * 100).toFixed(1) : '0.0';
  
  const attendanceHistory = [
    { month: 'Shrawan', present: 20, absent: 2, total: 22 },
    { month: 'Ashadh', present: 18, absent: 3, total: 21 },
    { month: 'Jestha', present: 19, absent: 1, total: 20 },
    { month: 'Baisakh', present: 21, absent: 1, total: 22 },
  ];

  // Filter data
  const filteredHomeworks = myHomeworks.filter(hw => {
    const matchesSearch = hw.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hw.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          hw.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || hw.status === filterStatus;
    const matchesSubject = filterSubject === 'all' || hw.subject === filterSubject;
    return matchesSearch && matchesStatus && matchesSubject;
  });

  const homeworksToShow = filteredHomeworks.length > 0 ? filteredHomeworks : [
    { subject: 'Mathematics', title: 'Quadratic Equations - Ex 3.2', description: 'Solve all problems', due: '2026-07-10', status: 'Pending', priority: 'High' },
    { subject: 'Science', title: 'Physics Lab Report Ch.3', description: 'Complete lab report', due: '2026-07-12', status: 'Pending', priority: 'Medium' },
    { subject: 'English', title: 'Essay Writing - My School', description: 'Write 500 words', due: '2026-07-08', status: 'Due Today', priority: 'High' },
    { subject: 'Nepali', title: 'Grammar Worksheet', description: 'Complete exercises', due: '2026-07-15', status: 'Upcoming', priority: 'Low' },
  ];

  const filteredResults = myResults.filter(r => {
    const subject = r.marks?.[0]?.subject || '';
    const matchesSearch = subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filterSubject === 'all' || subject === filterSubject;
    return matchesSearch && matchesSubject;
  });

  const uniqueSubjects = [...new Set([...myResults.map(r => r.marks?.[0]?.subject || ''), ...myHomeworks.map(h => h.subject)])].filter(Boolean);

  const filteredAttendance = attendanceHistory.filter(a => 
    a.month.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 mb-4">Attendance History</h3>
                <div className="space-y-2">
                  {filteredAttendance.map((month, i) => (
                    <div key={i} className="flex items-center gap-4 p-2 bg-gray-50 rounded-lg">
                      <div className="w-16 font-semibold text-gray-800 text-sm">{month.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-green-600 font-medium">{month.present} present</span>
                          <span className="text-xs text-red-500">{month.absent} absent</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${(month.present / month.total) * 100}%` }}></div>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-gray-700">{Math.round((month.present / month.total) * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 mb-4">Recent Notices</h3>
                <div className="space-y-2">
                  {notices.slice(0, 5).map((notice, i) => (
                    <div key={i} className="p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800 text-sm">{notice.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                          notice.targetClass === 'Academic' ? 'bg-blue-100 text-blue-700' :
                          notice.targetClass === 'Event' ? 'bg-green-100 text-green-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>{notice.targetClass}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{notice.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'results':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-bold text-gray-800">Results - {profile.className} {profile.section}</h3>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Subjects</option>
                  {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Marks</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Full</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Percentage</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredResults.map((result, i) => {
                    const subject = result.marks?.[0]?.subject || 'Subject';
                    const marksObtained = result.marks?.[0]?.marksObtained || 0;
                    const fullMarks = result.marks?.[0]?.fullMarks || 100;
                    return (
                      <tr key={i} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-semibold text-gray-800">{subject}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-800">{marksObtained}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{fullMarks}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${marksObtained}%` }}></div>
                            </div>
                            <span className="text-xs text-gray-500">{marksObtained}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            result.grade?.startsWith('A+') ? 'bg-green-100 text-green-700' :
                            result.grade?.startsWith('A') ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{result.grade || 'N/A'}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">Total</td>
                    <td className="px-4 py-3 text-sm font-bold text-gray-800">{totalMarks}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{totalFull}</td>
                    <td className="px-4 py-3 text-sm font-bold text-green-600">{avgMarks}%</td>
                    <td className="px-4 py-3"><span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700">A+</span></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        );
      case 'homework':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-bold text-gray-800">Homework & Assignments</h3>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="text"
                  placeholder="Search homework..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
                />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Due Today">Due Today</option>
                  <option value="Upcoming">Upcoming</option>
                  <option value="Completed">Completed</option>
                </select>
                <select
                  value={filterSubject}
                  onChange={(e) => setFilterSubject(e.target.value)}
                  className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Subjects</option>
                  {uniqueSubjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3">
              {homeworksToShow.map((hw, i) => {
                return (
                  <div key={i} className={`p-4 rounded-lg border-l-4 ${
                    hw.status === 'Due Today' ? 'border-red-400 bg-red-50' :
                    hw.status === 'Pending' ? 'border-orange-400 bg-orange-50' :
                    'border-gray-300 bg-gray-50'
                  }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-semibold text-gray-800">{hw.subject}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        hw.status === 'Due Today' ? 'bg-red-200 text-red-800' :
                        hw.status === 'Pending' ? 'bg-orange-200 text-orange-800' :
                        'bg-gray-200 text-gray-600'
                      }`}>{hw.status}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">{hw.title}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">Due: {hw.due}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        hw.priority === 'High' ? 'bg-red-100 text-red-700' :
                        hw.priority === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{hw.priority}</span>
                    </div>
                  </div>
                );
              })}
            </div>
            {filteredHomeworks.length === 0 && (
              <p className="text-gray-500 text-center py-8">No homework found matching your filters</p>
            )}
          </div>
        );
      case 'attendance':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <h3 className="font-bold text-gray-800">Attendance Summary</h3>
              <input
                type="text"
                placeholder="Search months..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-48"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-5 bg-gray-50 rounded-lg text-center">
                <div className="text-5xl font-bold text-green-600 mb-2">{Math.round((attendance.present / attendance.total) * 100)}%</div>
                <p className="text-gray-600 font-medium">Overall Attendance</p>
                <div className="flex justify-center gap-8 mt-4">
                  <div><div className="text-2xl font-bold text-green-600">{attendance.present}</div><div className="text-xs text-gray-500">Present</div></div>
                  <div><div className="text-2xl font-bold text-red-500">{attendance.absent}</div><div className="text-xs text-gray-500">Absent</div></div>
                </div>
              </div>
              <div className="space-y-2">
                {filteredAttendance.map((month, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-800">{month.month}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-green-600">{month.present}P</span>
                      <span className="text-sm text-red-500">{month.absent}A</span>
                      <span className="text-sm font-bold text-gray-700">{Math.round((month.present / month.total) * 100)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout allowedRoles={['student']}>
      <div className="space-y-4">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-lg p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-16 -mb-16"></div>
          <div className="relative">
            <h1 className="text-2xl font-bold">Welcome, {user?.name || 'Student'}!</h1>
            <p className="text-purple-100 text-sm">Class {profile.className} {profile.section} • Roll No: {profile.roll} • Academic Year 2080/2081</p>
            <div className="flex gap-4 mt-4">
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-xs text-purple-200">Attendance</div>
                <div className="text-xl font-bold">{Math.round((attendance.present / attendance.total) * 100)}%</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-xs text-purple-200">Average</div>
                <div className="text-xl font-bold">{avgMarks}%</div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
                <div className="text-xs text-purple-200">Rank</div>
                <div className="text-xl font-bold">5th</div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Attendance', value: `${Math.round((attendance.present / attendance.total) * 100)}%`, icon: '📋', bg: 'bg-green' },
            { label: 'Average Marks', value: `${avgMarks}%`, icon: '📊', bg: 'bg-blue' },
            { label: 'Pending HW', value: myHomeworks.filter(h => h.status === 'Pending').length.toString(), icon: '📝', bg: 'bg-yellow' },
            { label: 'Class Rank', value: '5th', icon: '🏆', bg: 'bg-purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bg}-500 rounded-lg flex items-center justify-center text-white text-xl`}>
                    {stat.icon}
                  </div>
                </div>
              </div>
              <div className={`h-1 ${stat.bg}-500`}></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {renderTab()}
        </div>
      </div>
    </DashboardLayout>
  );
}