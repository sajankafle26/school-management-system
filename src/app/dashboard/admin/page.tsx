'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import type { User } from '@/types';

const modules = [
  { name: 'Students', icon: '🎓', color: 'bg-blue-500', count: 0, href: '#students' },
  { name: 'Teachers', icon: '👩‍🏫', color: 'bg-green-500', count: 0, href: '#teachers' },
  { name: 'Parents', icon: '👪', color: 'bg-purple-500', count: 0, href: '#parents' },
  { name: 'Staff', icon: '💼', color: 'bg-indigo-500', count: 0, href: '#staff' },
  { name: 'Attendance', icon: '📋', color: 'bg-orange-500', count: 0, href: '#attendance' },
  { name: 'Results', icon: '📊', color: 'bg-teal-500', count: 0, href: '#results' },
  { name: 'Notices', icon: '📢', color: 'bg-pink-500', count: 0, href: '#notices' },
  { name: 'Events', icon: '📅', color: 'bg-amber-500', count: 0, href: '#events' },
  { name: 'Accounting', icon: '💰', color: 'bg-emerald-500', count: 0, href: '#accounting' },
  { name: 'Library', icon: '📚', color: 'bg-violet-500', count: 0, href: '#library' },
  { name: 'Transport', icon: '🚌', color: 'bg-yellow-500', count: 0, href: '#transport' },
  { name: 'Website CMS', icon: '🌐', color: 'bg-cyan-500', count: 0, href: '#website' },
  { name: 'SMS Services', icon: '📱', color: 'bg-rose-500', count: 0, href: '#sms' },
  { name: 'Academic Settings', icon: '⚙️', color: 'bg-gray-500', count: 0, href: '#settings' },
];

const recentActivities = [
  { id: 1, action: 'New student enrolled', user: 'Admin', time: '2 min ago', icon: '➕', color: 'bg-blue-100 text-blue-600' },
  { id: 2, action: 'Fee payment received', user: 'Accountant', time: '15 min ago', icon: '💰', color: 'bg-green-100 text-green-600' },
  { id: 3, action: 'Notice published', user: 'Admin', time: '1 hour ago', icon: '📢', color: 'bg-purple-100 text-purple-600' },
  { id: 4, action: 'Results uploaded', user: 'Teacher', time: '2 hours ago', icon: '📊', color: 'bg-orange-100 text-orange-600' },
  { id: 5, action: 'Parent message received', user: 'Parent', time: '3 hours ago', icon: '💬', color: 'bg-pink-100 text-pink-600' },
  { id: 6, action: 'Attendance marked', user: 'Teacher', time: '4 hours ago', icon: '✅', color: 'bg-teal-100 text-teal-600' },
];

const topStudents = [
  { name: 'Ram Thapa', class: '10 A', marks: 89.83, grade: 'A+' },
  { name: 'Sita Sharma', class: '10 A', marks: 80.17, grade: 'A' },
  { name: 'Gita Rai', class: '9 B', marks: 78.50, grade: 'B+' },
  { name: 'Nabin Gurung', class: '8 C', marks: 75.20, grade: 'B' },
  { name: 'Anjali Lama', class: '10 A', marks: 72.80, grade: 'B' },
];

const feeOverview = [
  { month: 'Baisakh', collected: 450000, pending: 120000 },
  { month: 'Jestha', collected: 380000, pending: 95000 },
  { month: 'Ashadh', collected: 420000, pending: 110000 },
  { month: 'Shrawan', collected: 350000, pending: 85000 },
];

export default function AdminDashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState({ students: 0, teachers: 0, parents: 0, staff: 0 });
  const [notices, setNotices] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const stored = sessionStorage.getItem('currentUser');
    if (stored) setUser(JSON.parse(stored));

    Promise.all([
      fetch('/api/students').then(r => r.json()),
      fetch('/api/teachers').then(r => r.json()),
      fetch('/api/parents').then(r => r.json()),
      fetch('/api/staff').then(r => r.json()),
      fetch('/api/notices').then(r => r.json()),
    ]).then(([students, teachers, parents, staff, noticesData]) => {
      setStats({
        students: Array.isArray(students) ? students.length : 0,
        teachers: Array.isArray(teachers) ? teachers.length : 0,
        parents: Array.isArray(parents) ? parents.length : 0,
        staff: Array.isArray(staff) ? staff.length : 0,
      });
      setNotices(Array.isArray(noticesData) ? noticesData : []);
    }).catch(() => {});
  }, []);

  return (
    <DashboardLayout allowedRoles={['admin']}>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.name || 'Admin'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              + Add New
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors">
              Export
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            { label: 'Total Students', value: stats.students, icon: '🎓', color: 'from-blue-500 to-blue-600', change: '+12%', changeColor: 'text-green-500' },
            { label: 'Total Teachers', value: stats.teachers, icon: '👩‍🏫', color: 'from-green-500 to-green-600', change: '+3%', changeColor: 'text-green-500' },
            { label: 'Total Parents', value: stats.parents, icon: '👪', color: 'from-purple-500 to-purple-600', change: '+8%', changeColor: 'text-green-500' },
            { label: 'Total Staff', value: stats.staff, icon: '💼', color: 'from-orange-500 to-red-500', change: '+1%', changeColor: 'text-green-500' },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  <p className={`text-xs mt-2 font-medium ${stat.changeColor}`}>{stat.change} from last month</p>
                </div>
                <div className={`w-14 h-14 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white text-2xl shadow-lg`}>
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-100">
            <div className="flex gap-1 p-1">
              {['overview', 'students', 'fees', 'notices'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Activity */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {recentActivities.map(activity => (
                      <div key={activity.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${activity.color}`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-gray-800">{activity.action}</p>
                          <p className="text-xs text-gray-500">by {activity.user}</p>
                        </div>
                        <span className="text-xs text-gray-400">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Top Students */}
                <div>
                  <h3 className="text-lg font-bold text-gray-800 mb-4">Top Students</h3>
                  <div className="overflow-hidden rounded-xl border border-gray-100">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Name</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Class</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Marks</th>
                          <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase">Grade</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {topStudents.map((student, i) => (
                          <tr key={i} className="hover:bg-gray-50">
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-sm">
                                  {i + 1}
                                </div>
                                <span className="text-sm font-medium text-gray-800">{student.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-600">{student.class}</td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-800">{student.marks}%</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                                student.grade.startsWith('A') ? 'bg-green-100 text-green-700' :
                                student.grade.startsWith('B+') ? 'bg-blue-100 text-blue-700' :
                                'bg-gray-100 text-gray-600'
                              }`}>{student.grade}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Students Tab */}
            {activeTab === 'students' && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Student Distribution</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { label: 'Class 10', count: 2, color: 'bg-blue-500', pct: 40 },
                    { label: 'Class 9', count: 1, color: 'bg-green-500', pct: 20 },
                    { label: 'Class 8', count: 1, color: 'bg-purple-500', pct: 20 },
                  ].map((cls, i) => (
                    <div key={i} className="p-5 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-800">{cls.label}</span>
                        <span className="text-sm font-bold text-gray-600">{cls.count} students</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className={`${cls.color} h-2.5 rounded-full`} style={{ width: `${cls.pct}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fees Tab */}
            {activeTab === 'fees' && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Fee Collection Overview</h3>
                <div className="space-y-4">
                  {feeOverview.map((fee, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                      <div className="w-20 font-semibold text-gray-800">{fee.month}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm text-green-600 font-medium">Collected: NPR {fee.collected.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(fee.collected / (fee.collected + fee.pending)) * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-red-500 mt-1 inline-block">Pending: NPR {fee.pending.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notices Tab */}
            {activeTab === 'notices' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-gray-800">Recent Notices</h3>
                  <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700">+ Add Notice</button>
                </div>
                <div className="space-y-3">
                  {notices.length > 0 ? notices.map((notice: any, i: number) => (
                    <div key={i} className="p-4 bg-gray-50 rounded-xl border-l-4 border-blue-500">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold text-gray-800">{notice.title}</h4>
                        <span className="text-xs text-gray-400">{notice.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{notice.content}</p>
                    </div>
                  )) : (
                    <p className="text-gray-500 text-center py-8">No notices found</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Module Grid */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Access Modules</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {modules.map((mod, i) => (
              <a
                key={i}
                href={mod.href}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-center group"
              >
                <div className={`w-12 h-12 ${mod.color} rounded-xl flex items-center justify-center text-white text-xl mb-2 mx-auto group-hover:scale-110 transition-transform`}>
                  {mod.icon}
                </div>
                <div className="font-semibold text-gray-700 text-xs">{mod.name}</div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
