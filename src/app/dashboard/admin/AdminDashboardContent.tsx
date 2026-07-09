'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

const tabContent: Record<string, React.ReactNode> = {
  overview: (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: '0', icon: '🎓', bg: 'bg-blue' },
          { label: 'Total Teachers', value: '0', icon: '👩‍🏫', bg: 'bg-green' },
          { label: 'Total Parents', value: '0', icon: '👪', bg: 'bg-yellow' },
          { label: 'Total Staff', value: '0', icon: '💼', bg: 'bg-red' },
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
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Recent Activity</h3>
            <button className="text-sm text-blue-600 hover:underline">View All</button>
          </div>
          <div className="p-4 space-y-3">
            {[
              { action: 'New student enrolled - Ram Thapa', user: 'Admin', time: '2 min ago', icon: '➕', color: 'bg-blue-500' },
              { action: 'Fee payment received - NPR 16,700', user: 'Accountant', time: '15 min ago', icon: '💰', color: 'bg-green-500' },
              { action: 'Notice published - Annual Sports Day', user: 'Admin', time: '1 hour ago', icon: '📢', color: 'bg-purple-500' },
              { action: 'Results uploaded for Class 10', user: 'Teacher', time: '2 hours ago', icon: '📊', color: 'bg-orange-500' },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg">
                <div className={`w-10 h-10 ${activity.color} rounded-lg flex items-center justify-center text-white text-sm`}>
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-bold text-gray-800">Top Students</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { name: 'Ram Thapa', class: '10 A', marks: 89.83, grade: 'A+' },
              { name: 'Sita Sharma', class: '10 A', marks: 80.17, grade: 'A' },
              { name: 'Gita Rai', class: '9 B', marks: 78.50, grade: 'B+' },
              { name: 'Nabin Gurung', class: '8 C', marks: 75.20, grade: 'B' },
              { name: 'Anjali Lama', class: '10 A', marks: 72.80, grade: 'B' },
            ].map((student, i) => (
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
            ))}
          </div>
        </div>
      </div>
    </div>
  ),
  students: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Students Management</h3><p className="text-gray-500">Students list, add, edit, delete functionality here.</p></div>,
  teachers: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Teachers Management</h3><p className="text-gray-500">Teachers list, add, edit, delete functionality here.</p></div>,
  parents: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Parents Management</h3><p className="text-gray-500">Parents list, add, edit, delete functionality here.</p></div>,
  staff: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Staff Management</h3><p className="text-gray-500">Staff list, add, edit, delete functionality here.</p></div>,
  attendance: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Attendance Management</h3><p className="text-gray-500">Mark and view attendance here.</p></div>,
  results: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Results Management</h3><p className="text-gray-500">Enter and view results here.</p></div>,
  homework: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Homework Management</h3><p className="text-gray-500">Assign and view homework here.</p></div>,
  routines: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Routines/Timetable</h3><p className="text-gray-500">Manage class routines here.</p></div>,
  syllabus: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Syllabus Management</h3><p className="text-gray-500">Manage syllabus here.</p></div>,
  library: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Library Management</h3><p className="text-gray-500">Manage library books and issues here.</p></div>,
  accounting: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Accounting</h3><p className="text-gray-500">Financial accounting and reports here.</p></div>,
  fees: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Fee Collection</h3><p className="text-gray-500">Manage fee invoices and collections here.</p></div>,
  transport: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Transport Management</h3><p className="text-gray-500">Manage buses, routes, and drivers here.</p></div>,
  sms: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">SMS Services</h3><p className="text-gray-500">Send SMS notifications here.</p></div>,
  notices: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Notices</h3><p className="text-gray-500">Create and manage notices here.</p></div>,
  events: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Events Calendar</h3><p className="text-gray-500">Manage school events and holidays here.</p></div>,
  settings: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Academic Settings</h3><p className="text-gray-500">Configure academic years, classes, sections here.</p></div>,
  website: <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4"><h3 className="font-bold text-gray-800 mb-4">Website CMS</h3><p className="text-gray-500">Manage public website content here.</p></div>,
};

export default function AdminDashboardContent() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ students: 0, teachers: 0, parents: 0, staff: 0 });

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'overview');
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));
  }, [searchParams]);

  useEffect(() => {
    Promise.all([
      fetch('/api/students').then(r => r.json()),
      fetch('/api/teachers').then(r => r.json()),
      fetch('/api/parents').then(r => r.json()),
      fetch('/api/staff').then(r => r.json()),
    ]).then(([students, teachers, parents, staff]) => {
      setStats({
        students: Array.isArray(students) ? students.length : 0,
        teachers: Array.isArray(teachers) ? teachers.length : 0,
        parents: Array.isArray(parents) ? parents.length : 0,
        staff: Array.isArray(staff) ? staff.length : 0,
      });
    }).catch(() => {});
  }, []);

  if (!user) return <div className="flex items-center justify-center h-[500px]">Loading...</div>;

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {user?.name || 'Admin'}</p>
          </div>
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Total Students', value: stats.students, icon: '🎓', bg: 'bg-blue' },
              { label: 'Total Teachers', value: stats.teachers, icon: '👩‍🏫', bg: 'bg-green' },
              { label: 'Total Parents', value: stats.parents, icon: '👪', bg: 'bg-yellow' },
              { label: 'Total Staff', value: stats.staff, icon: '💼', bg: 'bg-red' },
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
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-100">
          {tabContent[activeTab] || tabContent.overview}
        </div>
      </div>
    </DashboardLayout>
  );
}