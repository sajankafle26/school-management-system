'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Student, Teacher, Parent, Staff, Notice, Event, Result, FeeInvoice, AcademicYear, ClassSection } from '@/types';

export default function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Data states
  const [students, setStudents] = useState<Student[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [parents, setParents] = useState<Parent[]>([]);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [feeInvoices, setFeeInvoices] = useState<FeeInvoice[]>([]);
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [classSections, setClassSections] = useState<ClassSection[]>([]);
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
          studentsRes, teachersRes, parentsRes, staffRes,
          noticesRes, eventsRes, resultsRes, feeInvoicesRes,
          academicYearsRes, classSectionsRes
        ] = await Promise.all([
          fetch('/api/students').then(r => r.json()),
          fetch('/api/teachers').then(r => r.json()),
          fetch('/api/parents').then(r => r.json()),
          fetch('/api/staff').then(r => r.json()),
          fetch('/api/notices').then(r => r.json()),
          fetch('/api/events').then(r => r.json()),
          fetch('/api/results').then(r => r.json()),
          fetch('/api/fee-invoices').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
          fetch('/api/class-sections').then(r => r.json()),
        ]);

        setStudents(Array.isArray(studentsRes) ? studentsRes : []);
        setTeachers(Array.isArray(teachersRes) ? teachersRes : []);
        setParents(Array.isArray(parentsRes) ? parentsRes : []);
        setStaff(Array.isArray(staffRes) ? staffRes : []);
        setNotices(Array.isArray(noticesRes) ? noticesRes : []);
        setEvents(Array.isArray(eventsRes) ? eventsRes : []);
        setResults(Array.isArray(resultsRes) ? resultsRes : []);
        setFeeInvoices(Array.isArray(feeInvoicesRes) ? feeInvoicesRes : []);
        setAcademicYears(Array.isArray(academicYearsRes) ? academicYearsRes : []);
        setClassSections(Array.isArray(classSectionsRes) ? classSectionsRes : []);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;
  if (!user) return <div className="flex items-center justify-center h-[500px]">Please log in</div>;

  const currentYear = academicYears.find(y => y.isCurrent)?.year || academicYears[0]?.year || '2080/2081';
  const yearStudents = students.filter(s => s.academicYear === currentYear);
  const yearTeachers = teachers;
  const yearResults = results.filter(r => r.academicYear === currentYear);
  const yearFeeInvoices = feeInvoices.filter(f => f.academicYear === currentYear);

  // Compute stats
  const totalStudents = yearStudents.length;
  const totalTeachers = yearTeachers.length;
  const totalParents = parents.length;
  const totalStaff = staff.length;

  // Top students from results
  const topStudents = yearResults
    .sort((a, b) => b.percentage - a.percentage)
.slice(0, 5)
      .map((r, i) => {
        const student = yearStudents.find(s => String(s._id) === String(r.studentId) || s.id === r.studentId);
        return {
        name: student?.name || r.studentId,
        class: student ? `${student.className} ${student.section}` : 'N/A',
        marks: r.percentage,
        grade: r.grade,
      };
    });

  // Recent activity
  const recentActivity = [
    ...notices.slice(0, 3).map(n => ({
      action: `Notice: ${n.title}`,
      user: n.author,
      time: n.date,
      icon: '📢',
      color: 'bg-purple-500',
    })),
    ...events.slice(0, 2).map(e => ({
      action: `Event: ${e.title}`,
      user: 'System',
      time: e.date,
      icon: '🎉',
      color: 'bg-orange-500',
    })),
    ...yearFeeInvoices.filter(f => f.status === 'Paid').slice(0, 2).map(f => ({
      action: `Fee payment received - NPR ${f.amount.toLocaleString()}`,
      user: 'Accountant',
      time: f.dueDate,
      icon: '💰',
      color: 'bg-green-500',
    })),
  ].sort(() => Math.random() - 0.5).slice(0, 4);

  // Fee collection by month
  const feeByMonth = yearFeeInvoices.reduce((acc, f) => {
    const month = f.dueDate.substring(0, 7);
    if (!acc[month]) acc[month] = { collected: 0, pending: 0 };
    if (f.status === 'Paid') acc[month].collected += f.amount;
    else acc[month].pending += f.amount;
    return acc;
  }, {} as Record<string, {collected: number, pending: number}>);

  const feeOverview = Object.entries(feeByMonth).map(([month, data]) => ({
    month: month,
    collected: data.collected,
    pending: data.pending,
  }));

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Total Students', value: totalStudents, icon: '🎓', bg: 'bg-blue' },
                { label: 'Total Teachers', value: totalTeachers, icon: '👩‍🏫', bg: 'bg-green' },
                { label: 'Total Parents', value: totalParents, icon: '👪', bg: 'bg-yellow' },
                { label: 'Total Staff', value: totalStaff, icon: '💼', bg: 'bg-red' },
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

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-4">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Recent Activity</h3>
                  <button className="text-sm text-blue-600 hover:underline">View All</button>
                </div>
                <div className="p-4 space-y-3">
                  {recentActivity.map((activity, i) => (
                    <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
                      <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center text-white text-sm flex-shrink-0`}>
                        {activity.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 truncate">{activity.action}</p>
                        <p className="text-xs text-gray-400">by {activity.user}</p>
                      </div>
                      <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Students */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Top Students ({currentYear})</h3>
                </div>
                <div className="p-4 space-y-3">
                  {topStudents.length > 0 ? topStudents.map((student, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold ${
                        i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-500' : 'bg-gray-300'
                      }`}>
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.class}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-800">{student.marks}%</p>
                        <span className={`text-xs font-bold ${
                          student.grade.startsWith('A') ? 'text-green-600' : 'text-blue-600'
                        }`}>{student.grade}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-gray-400 text-center py-4">No results available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Second Row */}
            <div className="grid lg:grid-cols-2 gap-4">
              {/* Fee Collection */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-bold text-gray-800">Fee Collection Overview</h3>
                </div>
                <div className="p-4">
                  <div className="space-y-4">
                    {feeOverview.length > 0 ? feeOverview.map((fee, i) => (
                      <div key={i}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{fee.month}</span>
                          <span className="text-sm text-gray-500">NPR {fee.collected.toLocaleString()} / {(fee.collected + fee.pending).toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(fee.collected / (fee.collected + fee.pending) || 0) * 100}%` }}></div>
                        </div>
                      </div>
                    )) : (
                      <p className="text-gray-400 text-center py-4">No fee data</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Recent Notices */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-100">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-bold text-gray-800">Recent Notices</h3>
                </div>
                <div className="p-4">
                  {notices.length > 0 ? (
                    <div className="space-y-3">
                      {notices.slice(0, 5).map((notice, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">{notice.title}</p>
                            <p className="text-xs text-gray-500">{notice.date} • {notice.author}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-400 text-center py-8">No notices</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      case 'students':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h3 className="font-bold text-gray-800">Students ({totalStudents})</h3>
              <input
                type="text"
                placeholder="Search students..."
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-64"
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Roll</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Guardian</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">RFID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yearStudents
                    .filter(s => 
                      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.guardianName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      s.rfidCardId?.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((s, i) => (
                      <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.className} {s.section}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.roll}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.guardianName}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.contact}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{s.rfidCardId}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'teachers':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Teachers ({totalTeachers})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class Teacher</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yearTeachers.map((t, i) => (
                    <tr key={t._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{t.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.subject}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.classTeacherOf || 'N/A'}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{t.contact}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{t.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'parents':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Parents ({totalParents})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Address</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Children</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {parents.map((p, i) => {
                    const childrenCount = yearStudents.filter(s => s.parentId === i + 1 || s.guardianName === p.name).length;
                    return (
                      <tr key={p._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{p.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{p.contact}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{p.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{p.address || 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{childrenCount}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'staff':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Staff ({totalStaff})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Job Title</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Contact</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {staff.map((s, i) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{s.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.jobTitle}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{s.contact}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{s.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'attendance':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Attendance Management</h3>
            </div>
            <p className="text-gray-500">Attendance marking and reporting interface here.</p>
          </div>
        );
      case 'results':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Results Management</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Exam</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Percentage</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Rank</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yearResults.slice(0, 20).map((r, i) => {
                    const student = yearStudents.find(s => String(s._id) === String(r.studentId) || s.id === r.studentId);
                    return (
                      <tr key={r._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{student?.name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student ? `${student.className} ${student.section}` : 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.examType}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-800">{r.percentage}%</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            r.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                            r.grade.startsWith('B') ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-600'
                          }`}>{r.grade}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{r.rank || 'N/A'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'homework':
        return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Homework Management</h3><p className="text-gray-500">Assign and view homework here.</p></div>;
      case 'routines':
        return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Routines/Timetable</h3><p className="text-gray-500">Manage class routines here.</p></div>;
      case 'syllabus':
        return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Syllabus Management</h3><p className="text-gray-500">Manage syllabus here.</p></div>;
      case 'library':
        return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Library Management</h3><p className="text-gray-500">Manage library books and issues here.</p></div>;
      case 'accounting':
        return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Accounting</h3><p className="text-gray-500">Financial accounting and reports here.</p></div>;
      case 'fees':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 mb-4">Fee Collection</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Student</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Amount</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Due Date</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {yearFeeInvoices.slice(0, 20).map((f, i) => {
                    const student = yearStudents.find(s => String(s._id) === String(f.studentId) || s.id === f.studentId);
                    return (
                      <tr key={f._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm font-medium text-gray-800">{student?.name || 'Unknown'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student ? `${student.className} ${student.section}` : 'N/A'}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">NPR {f.amount.toLocaleString()}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{f.dueDate}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                            f.status === 'Paid' ? 'bg-green-100 text-green-700' :
                            f.status === 'Partial' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>{f.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'transport':
        return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Transport Management</h3><p className="text-gray-500">Manage buses, routes, and drivers here.</p></div>;
      case 'sms':
        return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">SMS Services</h3><p className="text-gray-500">Send SMS notifications here.</p></div>;
      case 'notices':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 mb-4">Notices ({notices.length})</h3>
            <div className="space-y-3">
              {notices.map((notice, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">{notice.title}</h4>
                    <span className="text-xs text-gray-400">{notice.date}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                  <p className="text-xs text-gray-500 mt-1">By: {notice.author} • For: {notice.targetClass} {notice.targetSection}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'events':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 mb-4">Events Calendar ({events.length})</h3>
            <div className="space-y-3">
              {events.map((event, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border-l-4 border-green-500">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">{event.title}</h4>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      event.type === 'Holiday' ? 'bg-red-100 text-red-700' :
                      event.type === 'Exam' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>{event.type}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{event.description}</p>
                  <p className="text-xs text-gray-500 mt-1">Date: {event.date}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 mb-4">Academic Settings</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Academic Years</h4>
                <div className="space-y-2">
                  {academicYears.map((ay, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{ay.year} {ay.isCurrent && '(Current)'}</span>
                      <span className="text-xs text-gray-500">Created: {ay.createdAt?.substring(0, 10) || 'N/A'}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Class Sections ({classSections.length})</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Section</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Teacher ID</th>
                        <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Capacity</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {classSections.map((cs, i) => (
                        <tr key={cs._id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-800">{cs.className}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cs.section}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cs.classTeacherId || 'N/A'}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">{cs.capacity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        );
      case 'website':
        return <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Website CMS</h3><p className="text-gray-500">Manage public website content here.</p></div>;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {renderTab()}
        </div>
      </div>
    </DashboardLayout>
  );
}