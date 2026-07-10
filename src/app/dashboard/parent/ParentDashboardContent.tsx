'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { User, Student, Result, Notice, FeeInvoice, AcademicYear } from '@/types';

const children = [
  { name: 'Aarav Sharma', class: '10 A', rollNo: 5, attendance: 93, avgMarks: 82, rank: '5th', id: 1 },
  { name: 'Anita Sharma', class: '7 B', rollNo: 12, attendance: 88, avgMarks: 79, rank: '8th', id: 2 },
];

export default function ParentDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [user, setUser] = useState<User | null>(null);
  const [selectedChild, setSelectedChild] = useState(0);
  
  // Data states
  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [allResults, setAllResults] = useState<Result[]>([]);
  const [allFeeInvoices, setAllFeeInvoices] = useState<FeeInvoice[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
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
          studentsRes, resultsRes, feeInvoicesRes, noticesRes, academicYearsRes
        ] = await Promise.all([
          fetch('/api/students').then(r => r.json()),
          fetch('/api/results').then(r => r.json()),
          fetch('/api/fee-invoices').then(r => r.json()),
          fetch('/api/notices').then(r => r.json()),
          fetch('/api/academic-years').then(r => r.json()),
        ]);

        const currentYear = academicYears.find((y: AcademicYear) => y.isCurrent)?.year || academicYears[0]?.year || '2080/2081';
        
        setAllStudents(Array.isArray(studentsRes) ? studentsRes : []);
        setAllResults(Array.isArray(resultsRes) ? resultsRes.filter((r: Result) => r.academicYear === currentYear) : []);
        setAllFeeInvoices(Array.isArray(feeInvoicesRes) ? feeInvoicesRes.filter((f: FeeInvoice) => f.academicYear === currentYear) : []);
        setNotices(Array.isArray(noticesRes) ? noticesRes : []);
        setAcademicYears(Array.isArray(academicYearsRes) ? academicYearsRes : []);
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

  const child = children[selectedChild];
  const myChildren = allStudents.filter(s => s.guardianName === user.name || children.some(c => c.name === s.name));
  const childResults = allResults.filter(r => r.studentId === child.id);
  const childInvoices = allFeeInvoices.filter(f => f.studentId === child.id);
  
  const totalPaid = childInvoices.filter(f => f.status === 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const totalPending = childInvoices.filter(f => f.status !== 'Paid').reduce((sum, f) => sum + f.amount, 0);
  const unreadMessages = 1;

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-4">
            <div className="grid lg:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 mb-4">Recent Results - {child.name}</h3>
                <div className="space-y-2">
                  {childResults.slice(0, 5).map((result, i) => {
                    const subject = result.marks?.[0]?.subject || 'Subject';
                    const marksObtained = result.marks?.[0]?.marksObtained || 0;
                    const fullMarks = result.marks?.[0]?.fullMarks || 100;
                    return (
                      <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-semibold text-gray-800 text-sm">{subject}</div>
                          <div className="text-xs text-gray-500">{result.examType}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-800">{marksObtained}/{fullMarks}</div>
                          <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                            result.grade?.startsWith('A') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                          }`}>{result.grade}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
                <h3 className="font-bold text-gray-800 mb-4">Recent Notices</h3>
                <div className="space-y-2">
                  {notices.slice(0, 3).map((notice, i) => (
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
            <h3 className="font-bold text-gray-800 mb-4">Academic Results - {child.name}</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Subject</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Marks</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Performance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
{childResults.map((result, i) => {
                      const subject = result.marks?.[0]?.subject || 'Subject';
                      const marksObtained = result.marks?.[0]?.marksObtained || 0;
                      return (
                        <tr key={i} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-800">{subject}</td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-800">{marksObtained}/100</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                              result.grade?.startsWith('A') ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>{result.grade}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="w-20 bg-gray-200 rounded-full h-1.5">
                              <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${marksObtained}%` }}></div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'fees':
        return (
          <div className="grid lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-800 mb-4">Fee Summary</h3>
              <div className="space-y-3">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Total Paid</span>
                    <span className="text-lg font-bold text-green-600">NPR {totalPaid.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Pending Amount</span>
                    <span className="text-lg font-bold text-red-600">NPR {totalPending.toLocaleString()}</span>
                  </div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-700 font-medium">Next Due Date</span>
                    <span className="font-bold text-orange-600">2026-07-15</span>
                  </div>
                </div>
                <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors">
                  Pay Fee Now - NPR 8,000
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h3 className="font-bold text-gray-800 mb-4">Payment History</h3>
              <div className="space-y-2">
                {childInvoices.map((payment, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">NPR {payment.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{payment.dueDate} • {payment.status}</div>
                    </div>
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{payment.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'notices':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <h3 className="font-bold text-gray-800 mb-4">School Notices ({notices.length})</h3>
            <div className="space-y-2">
              {notices.map((notice, i) => (
                <div key={i} className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">{notice.title}</h4>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        notice.targetClass === 'Academic' ? 'bg-blue-100 text-blue-700' :
                        notice.targetClass === 'Event' ? 'bg-green-100 text-green-700' :
                        notice.targetClass === 'Transport' ? 'bg-purple-100 text-purple-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{notice.targetClass}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                        notice.targetSection === 'High' ? 'bg-red-100 text-red-700' :
                        notice.targetSection === 'Medium' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-600'
                      }`}>{notice.targetSection}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                  <p className="text-xs text-gray-500 mt-1">{notice.date} • By: {notice.author}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case 'messages':
        return (
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-800">Messages from Teachers</h3>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ New Message</button>
            </div>
            <div className="space-y-2">
              {[
                { from: 'Hari Prasad Adhikari', subject: `${child.name} - Math Performance Update`, time: '2 hours ago', read: false },
                { from: 'School Admin', subject: 'Fee Reminder - Installment Due', time: '1 day ago', read: true },
                { from: 'Shanti Devi Shrestha', subject: 'Science Project Feedback', time: '3 days ago', read: true },
              ].map((msg, i) => (
                <div key={i} className={`p-4 rounded-lg border ${!msg.read ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                        {msg.from.charAt(0)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 text-sm">{msg.from}</div>
                        <div className="text-xs text-gray-500">{msg.time}</div>
                      </div>
                    </div>
                    {!msg.read && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                  </div>
                  <p className="text-sm text-gray-700 mt-2 ml-[52px]">{msg.subject}</p>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <DashboardLayout allowedRoles={['parent']}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Parent Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Parent'}</p>
          </div>
          <div className="flex items-center gap-2">
            {children.map((c, i) => (
              <button
                key={i}
                onClick={() => setSelectedChild(i)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedChild === i ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                  {c.name.charAt(0)}
                </div>
                {c.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 rounded-lg p-5 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20"></div>
          <div className="relative flex items-center gap-6">
            <div className="w-16 h-16 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold">
              {child.name.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{child.name}</h2>
              <p className="text-orange-100 text-sm">{child.class} • Roll No: {child.rollNo}</p>
              <div className="flex gap-4 mt-3">
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <div className="text-[10px] text-orange-200">Attendance</div>
                  <div className="text-lg font-bold">{child.attendance}%</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <div className="text-[10px] text-orange-200">Average</div>
                  <div className="text-lg font-bold">{child.avgMarks}%</div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
                  <div className="text-[10px] text-orange-200">Rank</div>
                  <div className="text-lg font-bold">{child.rank}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Attendance', value: `${child.attendance}%`, icon: '📋', bg: 'bg-green' },
            { label: 'Avg Marks', value: `${child.avgMarks}%`, icon: '📊', bg: 'bg-blue' },
            { label: 'Fee Pending', value: `NPR ${totalPending.toLocaleString()}`, icon: '💰', bg: 'bg-orange' },
            { label: 'Unread Messages', value: unreadMessages.toString(), icon: '💬', bg: 'bg-purple' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
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